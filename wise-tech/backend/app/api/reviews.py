"""
Review API endpoints.
"""

from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.models.review import Review

router = APIRouter()


@router.get("/reviews", response_model=schemas.ReviewPaginatedResponse)
def get_all_reviews(
    *,
    db: Session = Depends(deps.get_db),
    search: Optional[str] = Query(None, description="Search in review content and gadget names"),
    category: Optional[str] = Query(None, description="Filter by gadget category"),
    rating: Optional[int] = Query(None, description="Minimum rating filter"),
    sort: str = Query("newest", description="Sort order: newest, oldest, rating_high, rating_low"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(12, ge=1, le=100, description="Number of reviews per page"),
) -> Any:
    """
    Get all reviews with filtering, search, and pagination.
    """
    from sqlalchemy import and_, or_, desc, asc
    from app.models.gadget import Gadget
    
    # Calculate skip value
    skip = (page - 1) * limit
    
    # Base query with joins
    query = db.query(Review).join(Review.user).join(Review.gadget)
    
    # Apply filters
    filters = []
    
    # Search filter (search in review content, title, gadget name, username, and user full_name)
    if search:
        search_term = f"%{search}%"
        from app.models.user import User
        filters.append(
            or_(
                Review.content.ilike(search_term),
                Review.title.ilike(search_term),
                Review.pros.ilike(search_term),
                Review.cons.ilike(search_term),
                Gadget.name.ilike(search_term),
                Gadget.brand.ilike(search_term),
                User.username.ilike(search_term),
                User.full_name.ilike(search_term)
            )
        )
    
    # Category filter
    if category and category.lower() != "all":
        filters.append(Gadget.category.ilike(f"%{category}%"))
    
    # Rating filter
    if rating:
        filters.append(Review.rating >= rating)
    
    # Apply all filters
    if filters:
        query = query.filter(and_(*filters))
    
    # Apply sorting
    if sort == "oldest":
        query = query.order_by(asc(Review.created_at))
    elif sort == "rating_high":
        query = query.order_by(desc(Review.rating), desc(Review.created_at))
    elif sort == "rating_low":
        query = query.order_by(asc(Review.rating), desc(Review.created_at))
    else:  # newest (default)
        query = query.order_by(desc(Review.created_at))
    
    # Get total count for pagination
    total_count = query.count()
    total_pages = (total_count + limit - 1) // limit
    
    # Apply pagination
    reviews = query.offset(skip).limit(limit).all()
    
    # Add user names and gadget info to reviews
    result_reviews = []
    for review in reviews:
        review_dict = {
            "id": review.id,
            "title": review.title,
            "content": review.content,
            "rating": review.rating,
            "pros": review.pros,
            "cons": review.cons,
            "user_id": review.user_id,
            "gadget_id": review.gadget_id,
            "status": review.status,
            "created_at": review.created_at,
            "updated_at": review.updated_at,
            "user_name": review.user.username,
            "user": {
                "id": review.user.id,
                "username": review.user.username,
                "full_name": getattr(review.user, 'full_name', None),
                "profile_photo": getattr(review.user, 'profile_photo', None),
            },
            "gadget": {
                "id": review.gadget.id,
                "name": review.gadget.name,
                "category": review.gadget.category,
                "brand": review.gadget.brand,
            }
        }
        result_reviews.append(review_dict)
    
    return schemas.ReviewPaginatedResponse(
        reviews=result_reviews,
        total=total_count,
        total_pages=total_pages,
        current_page=page,
        limit=limit
    )


@router.get("/reviews/recent", response_model=List[schemas.Review])
def read_recent_reviews(
    *,
    db: Session = Depends(deps.get_db),
    limit: int = 10,
) -> Any:
    """
    Get recent reviews with user and gadget information.
    """
    reviews = crud.review.get_recent_reviews(db, limit=limit)
    
    # Convert to dict with full user and gadget information
    result = []
    for review in reviews:
        review_dict = {
            "id": review.id,
            "title": review.title,
            "content": review.content,
            "rating": review.rating,
            "pros": review.pros,
            "cons": review.cons,
            "user_id": review.user_id,
            "gadget_id": review.gadget_id,
            "status": review.status,
            "created_at": review.created_at,
            "updated_at": review.updated_at,
            "user_name": review.user.username if review.user else "Unknown",
            "user": {
                "id": review.user.id,
                "username": review.user.username,
                "full_name": getattr(review.user, 'full_name', review.user.username),
                "profile_photo": getattr(review.user, 'profile_photo', None),
            } if review.user else None,
            "gadget": {
                "id": review.gadget.id,
                "name": review.gadget.name,
                "category": review.gadget.category,
                "brand": review.gadget.brand,
            } if review.gadget else None
        }
        result.append(review_dict)
        
    return result


@router.post("/reviews", response_model=schemas.Review)
def create_review(
    *,
    db: Session = Depends(deps.get_db),
    review_in: schemas.ReviewCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Create a new review.
    """
    # Check if gadget exists
    gadget = crud.gadget.get(db, id=review_in.gadget_id)
    if not gadget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gadget not found",
        )
        
    # Note: Removed duplicate review restriction - users can now submit multiple reviews for the same gadget
    
    # Create review
    review = crud.review.create_user_review(
        db, obj_in=review_in, user_id=current_user.id
    )
    
    # Add complete user info to review response
    review_dict = {
        **review.__dict__,
        "user_name": current_user.username,
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "full_name": current_user.full_name,
            "profile_photo": current_user.profile_photo,
            "bio": current_user.bio,
        }
    }
    
    return schemas.Review(**review_dict)


@router.put("/reviews/{id}", response_model=schemas.Review)
def update_review(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    review_in: schemas.ReviewUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Update a review.
    """
    review = crud.review.get(db, id=id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )
        
    # Check if user is owner or admin
    if review.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
        
    # Update review
    updated_review = crud.review.update(db, db_obj=review, obj_in=review_in)
    
    # Add complete user info to review response
    review_dict = {
        **updated_review.__dict__,
        "user_name": updated_review.user.username,
        "user": {
            "id": updated_review.user.id,
            "username": updated_review.user.username,
            "full_name": updated_review.user.full_name,
            "profile_photo": updated_review.user.profile_photo,
            "bio": updated_review.user.bio,
        }
    }
    
    return schemas.Review(**review_dict)


@router.delete("/reviews/{id}", response_model=schemas.Review)
def delete_review(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a review.
    """
    review = crud.review.get(db, id=id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )
        
    # Check if user is owner or admin
    if review.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    
    # Add user name to review for response
    review_dict = {
        **review.__dict__,
        "user_name": review.user.username,
    }
    
    # Delete review
    crud.review.remove(db, id=id)
    
    return schemas.Review(**review_dict)
