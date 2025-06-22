"""
CRUD operations for gadget model.
"""

from typing import List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.gadget import Gadget, GadgetSpec
from app.models.review import Review
from app.schemas.gadget import GadgetCreate, GadgetUpdate


class CRUDGadget(CRUDBase[Gadget, GadgetCreate, GadgetUpdate]):
    """
    CRUD operations for gadget model.
    """

    def create(self, db: Session, *, obj_in: GadgetCreate) -> Gadget:
        """
        Create a new gadget with proper datetime handling.
        """
        # Ensure release_date is a datetime object
        from datetime import datetime
        if isinstance(obj_in.release_date, str):
            try:
                # Parse ISO format string to datetime
                release_date = datetime.fromisoformat(obj_in.release_date.replace('Z', '+00:00'))
            except ValueError:
                release_date = datetime.utcnow()
        else:
            release_date = obj_in.release_date
        
        # Create gadget manually to avoid pydantic datetime encoding issues
        gadget = Gadget(
            name=obj_in.name,
            brand=obj_in.brand,
            category=obj_in.category,
            description=obj_in.description,
            price=obj_in.price,
            release_date=release_date,  # Use the properly converted datetime
            image_url=obj_in.image_url
        )
        db.add(gadget)
        db.commit()
        db.refresh(gadget)
        return gadget

    def get_gadgets_by_category(
        self, db: Session, *, category: str, skip: int = 0, limit: int = 100
    ) -> List[Gadget]:
        """
        Get gadgets by category.
        """
        return (
            db.query(Gadget)
            .filter(Gadget.category.ilike(category))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_featured_gadgets(
        self, db: Session, *, limit: int = 4
    ) -> List[Gadget]:
        """
        Get featured gadgets based on average rating.
        """
        # Subquery to calculate average rating
        avg_ratings = (
            db.query(
                Review.gadget_id,
                func.avg(Review.rating).label("avg_rating"),
                func.count(Review.id).label("review_count")
            )
            .group_by(Review.gadget_id)
            .subquery()
        )
        
        # Join with gadgets and order by rating
        return (
            db.query(Gadget)
            .outerjoin(avg_ratings, Gadget.id == avg_ratings.c.gadget_id)
            .order_by(avg_ratings.c.avg_rating.desc(), avg_ratings.c.review_count.desc())
            .limit(limit)
            .all()
        )
        
    def search_gadgets(
        self, db: Session, *, query: str, category: Optional[str] = None, skip: int = 0, limit: int = 100
    ) -> List[Gadget]:
        """
        Search gadgets by name, brand, or category with improved relevance.
        
        Prioritizes:
        1. Exact match in name/brand
        2. Word start match in name/brand  
        3. Word contains match in name/brand
        4. Match in description (only for longer queries)
        """
        query_lower = query.lower().strip()
        
        # For very short queries (1-2 characters), be more restrictive
        if len(query_lower) <= 2:
            # Only search for word starts or exact matches
            exact_pattern = f"{query_lower}"
            start_pattern = f"{query_lower}%"
            word_start_pattern = f"% {query_lower}%"
            
            gadgets_query = db.query(Gadget).filter(
                (Gadget.name.ilike(exact_pattern)) |
                (Gadget.brand.ilike(exact_pattern)) |
                (Gadget.name.ilike(start_pattern)) |
                (Gadget.brand.ilike(start_pattern)) |
                (Gadget.name.ilike(word_start_pattern)) |
                (Gadget.brand.ilike(word_start_pattern))
            )
        else:
            # For longer queries, include description search
            contains_pattern = f"%{query_lower}%"
            gadgets_query = db.query(Gadget).filter(
                (Gadget.name.ilike(contains_pattern)) |
                (Gadget.brand.ilike(contains_pattern)) |
                (Gadget.description.ilike(contains_pattern))
            )
        
        # Add category filter if specified
        if category:
            gadgets_query = gadgets_query.filter(Gadget.category.ilike(category))
        
        # Get all matching gadgets
        all_gadgets = gadgets_query.all()
        
        # Score and sort by relevance
        scored_gadgets = []
        for gadget in all_gadgets:
            score = 0
            name_lower = gadget.name.lower()
            brand_lower = gadget.brand.lower()
            desc_lower = gadget.description.lower() if gadget.description else ""
            
            # Exact match (highest priority)
            if name_lower == query_lower or brand_lower == query_lower:
                score += 100
            
            # Starts with query
            elif name_lower.startswith(query_lower) or brand_lower.startswith(query_lower):
                score += 80
            
            # Word starts with query (e.g., "Samsung Galaxy" matches "gal")
            elif (f" {query_lower}" in f" {name_lower}") or (f" {query_lower}" in f" {brand_lower}"):
                score += 60
            
            # Contains query in name or brand (but not for very short queries)
            elif len(query_lower) > 2 and (query_lower in name_lower or query_lower in brand_lower):
                score += 40
            
            # Contains query in description (only for longer queries and lowest priority)
            elif len(query_lower) > 3 and query_lower in desc_lower:
                score += 10
            
            # Skip results with very low relevance for short queries
            if len(query_lower) <= 2 and score < 40:
                continue
                
            # Add small bonus for shorter names (more specific)
            if len(name_lower) < 20:
                score += 5
            
            scored_gadgets.append((score, gadget))
        
        # Sort by score (descending) and take pagination
        scored_gadgets.sort(key=lambda x: x[0], reverse=True)
        
        # Apply pagination
        start_idx = skip
        end_idx = skip + limit
        return [gadget for _, gadget in scored_gadgets[start_idx:end_idx]]
        
    def create_with_specs(
        self, db: Session, *, gadget_in: GadgetCreate, specs: List[dict]
    ) -> Gadget:
        """
        Create a gadget with specifications.
        """
        # Create gadget manually to avoid pydantic datetime issues
        from app.models.gadget import Gadget as GadgetModel
        
        gadget = GadgetModel(
            name=gadget_in.name,
            brand=gadget_in.brand,
            category=gadget_in.category,
            description=gadget_in.description,
            price=gadget_in.price,
            release_date=gadget_in.release_date,
            image_url=gadget_in.image_url
        )
        db.add(gadget)
        db.commit()
        db.refresh(gadget)
        
        # Add specifications
        for spec in specs:
            from app.models.gadget import GadgetSpec
            db_spec = GadgetSpec(
                gadget_id=gadget.id,
                spec_name=spec["name"],
                spec_value=spec["value"]
            )
            db.add(db_spec)
        
        db.commit()
        db.refresh(gadget)
        return gadget
        
    def filter_gadgets(
        self, 
        db: Session, 
        *, 
        category: Optional[str] = None,
        brand: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        min_rating: Optional[float] = None,
        skip: int = 0, 
        limit: int = 100
    ) -> List[Gadget]:
        """
        Filter gadgets by various criteria.
        """
        query = db.query(Gadget)
        
        if category:
            query = query.filter(Gadget.category.ilike(category))
            
        if brand:
            # Support comma-separated brands for multiple brand filtering
            brands = [b.strip() for b in brand.split(',') if b.strip()]
            if brands:
                query = query.filter(Gadget.brand.in_(brands))
            
        if min_price is not None:
            query = query.filter(Gadget.price >= min_price)
            
        if max_price is not None:
            query = query.filter(Gadget.price <= max_price)
            
        if min_rating is not None:
            # This is a bit tricky with SQLAlchemy since average_rating is a property
            # A more efficient approach would involve a subquery with AVG
            gadgets = query.all()
            gadgets = [g for g in gadgets if g.average_rating >= min_rating]
            return gadgets[skip:skip+limit]
            
        return query.offset(skip).limit(limit).all()


gadget = CRUDGadget(Gadget)
