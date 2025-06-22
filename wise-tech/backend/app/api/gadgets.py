"""
Gadget API endpoints.
"""

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/gadgets", response_model=List[schemas.Gadget])
def read_gadgets(
    *,
    db: Session = Depends(deps.get_db),
    category: Optional[str] = Query(None, description="Filter by category"),
    brand: Optional[str] = Query(None, description="Filter by brand"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    min_rating: Optional[float] = Query(None, description="Minimum rating"),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Get gadgets with filtering.
    """
    return crud.gadget.filter_gadgets(
        db,
        category=category,
        brand=brand,
        min_price=min_price,
        max_price=max_price,
        min_rating=min_rating,
        skip=skip,
        limit=limit,
    )


@router.get("/gadgets/search", response_model=List[schemas.Gadget])
def search_gadgets(
    *,
    db: Session = Depends(deps.get_db),
    query: str = Query(..., min_length=1, description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Search gadgets with optional category filter.
    """
    return crud.gadget.search_gadgets(db, query=query, category=category, skip=skip, limit=limit)


@router.get("/gadgets/featured", response_model=List[schemas.Gadget])
def read_featured_gadgets(
    *,
    db: Session = Depends(deps.get_db),
    limit: int = Query(4, description="Number of featured gadgets to return"),
) -> Any:
    """
    Get featured gadgets.
    """
    return crud.gadget.get_featured_gadgets(db, limit=limit)


@router.get("/gadgets/all", response_model=List[schemas.Gadget])
def read_all_gadgets(
    *,
    db: Session = Depends(deps.get_db),
    limit: int = Query(100, description="Maximum number of gadgets to return"),
) -> Any:
    """
    Get all gadgets (not limited to featured).
    """
    return crud.gadget.get_multi(db, skip=0, limit=limit)


@router.get("/gadgets/{id}", response_model=schemas.GadgetWithReviews)
def read_gadget(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get a specific gadget with reviews.
    """
    gadget = crud.gadget.get(db, id=id)
    if not gadget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gadget not found",
        )
    
    # Convert to GadgetWithReviews schema
    gadget_dict = {
        **gadget.__dict__,
        "specs": gadget.specs,
        "reviews": gadget.reviews,
        "average_rating": gadget.average_rating,
        "review_count": len(gadget.reviews),
    }
    
    # Convert reviews to ReviewInGadget schema
    reviews_with_usernames = []
    for review in gadget.reviews:
        review_dict = {
            **review.__dict__,
            "user_name": review.user.username,
        }
        reviews_with_usernames.append(schemas.ReviewInGadget(**review_dict))
        
    gadget_dict["reviews"] = reviews_with_usernames
        
    return schemas.GadgetWithReviews(**gadget_dict)


@router.get("/gadgets/{id}/reviews", response_model=List[schemas.Review])
def read_gadget_reviews(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Get reviews for a specific gadget.
    """
    gadget = crud.gadget.get(db, id=id)
    if not gadget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gadget not found",
        )
        
    reviews = crud.review.get_reviews_by_gadget(
        db, gadget_id=id, skip=skip, limit=limit
    )
    
    # Add user names to reviews
    result = []
    for review in reviews:
        review_dict = {
            **review.__dict__,
            "user_name": review.user.username,
        }
        result.append(schemas.Review(**review_dict))
        
    return result


@router.post("/gadgets", response_model=schemas.Gadget)
def create_gadget(
    *,
    db: Session = Depends(deps.get_db),
    gadget_in: schemas.GadgetCreate,
    specs: List[Dict[str, str]],
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create a new gadget (admin only).
    """
    return crud.gadget.create_with_specs(db, gadget_in=gadget_in, specs=specs)


@router.put("/gadgets/{id}", response_model=schemas.Gadget)
def update_gadget(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    gadget_in: schemas.GadgetUpdate,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Update a gadget (admin only).
    """
    gadget = crud.gadget.get(db, id=id)
    if not gadget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gadget not found",
        )
        
    return crud.gadget.update(db, db_obj=gadget, obj_in=gadget_in)


@router.delete("/gadgets/{id}", response_model=schemas.Gadget)
def delete_gadget(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Delete a gadget (admin only).
    """
    gadget = crud.gadget.get(db, id=id)
    if not gadget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gadget not found",
        )
        
    return crud.gadget.remove(db, id=id)
