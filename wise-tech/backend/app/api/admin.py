"""
Admin API endpoints.
"""

from typing import Any, List, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/admin/users", response_model=List[schemas.User])
def read_users(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Get all users (admin only).
    """
    return crud.user.get_multi(db, skip=skip, limit=limit)


@router.get("/admin/users/{id}", response_model=schemas.User)
def read_user(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Get user by ID (admin only).
    """
    user = crud.user.get(db, id=id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.post("/admin/users", response_model=schemas.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create new user (admin only).
    """
    # Check if user with email already exists
    existing_user = crud.user.get_by_email(db, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )
    
    # Check if username already exists
    existing_username = crud.user.get_by_username(db, username=user_in.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )
    
    user = crud.user.create(db, obj_in=user_in)
    return user


@router.put("/admin/users/{id}", response_model=schemas.User)
def update_user(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    user_in: schemas.UserAdminUpdate,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Update user (admin only).
    """
    user = crud.user.get(db, id=id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Don't allow admins to modify their own admin status
    if user.id == current_user.id and hasattr(user_in, 'is_admin'):
        user_in.is_admin = current_user.is_admin
    
    user = crud.user.update(db, db_obj=user, obj_in=user_in)
    return user


@router.delete("/admin/users/{id}")
def delete_user(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Delete user (admin only).
    """
    user = crud.user.get(db, id=id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Don't allow admins to delete themselves
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account",
        )
    
    crud.user.remove(db, id=id)
    return {"message": "User deleted successfully"}


@router.put("/admin/reviews/{id}", response_model=schemas.Review)
def update_review(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    review_in: schemas.ReviewUpdate,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Update review (admin only).
    """
    review = crud.review.get(db, id=id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )
    
    review = crud.review.update(db, db_obj=review, obj_in=review_in)
    return review


@router.delete("/admin/reviews/{id}")
def delete_review(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Delete review (admin only).
    """
    review = crud.review.get(db, id=id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )
    
    crud.review.remove(db, id=id)
    return {"message": "Review deleted successfully"}


@router.put("/admin/reviews/{id}/approve", response_model=schemas.Review)
def approve_review(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Approve a review (admin only).
    
    Note: This endpoint assumes we're adding a status field to reviews
    in a future update. For now it's a placeholder.
    """
    review = crud.review.get(db, id=id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )
        
    # In a real implementation, we would update the review status here
    # For now, we'll just return the review as is
    review_dict = {
        **review.__dict__,
        "user_name": review.user.username,
    }
    
    return schemas.Review(**review_dict)


@router.put("/admin/reviews/{id}/reject", response_model=schemas.Review)
def reject_review(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Reject a review (admin only).
    
    Note: This endpoint assumes we're adding a status field to reviews
    in a future update. For now it's a placeholder.
    """
    review = crud.review.get(db, id=id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )
        
    # In a real implementation, we would update the review status here
    # For now, we'll just return the review as is
    review_dict = {
        **review.__dict__,
        "user_name": review.user.username,
    }
    
    return schemas.Review(**review_dict)


@router.get("/admin/reviews/{id}", response_model=schemas.Review)
def get_review(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Get review by ID (admin only).
    """
    review = crud.review.get(db, id=id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )
    
    review_dict = {
        **review.__dict__,
        "user_name": review.user.username,
        "gadget_name": review.gadget.name,
    }
    
    return schemas.Review(**review_dict)


@router.get("/admin/dashboard/stats")
def get_dashboard_stats(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Dict[str, int]:
    """
    Get dashboard statistics (admin only).
    """
    # Count total users
    total_users = db.query(func.count(models.User.id)).scalar() or 0
    
    # Count total gadgets
    total_gadgets = db.query(func.count(models.Gadget.id)).scalar() or 0
    
    # Count total reviews
    total_reviews = db.query(func.count(models.Review.id)).scalar() or 0
    
    # Count pending reviews (assuming we'll add status field later)
    # For now, we'll assume all reviews are pending if they don't have a status
    pending_reviews = 0  # Placeholder for future implementation
    
    return {
        "totalUsers": total_users,
        "totalGadgets": total_gadgets,
        "totalReviews": total_reviews,
        "pendingReviews": pending_reviews,
    }


@router.get("/admin/reviews", response_model=List[schemas.Review])
def get_all_reviews(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Get all reviews (admin only).
    """
    reviews = crud.review.get_multi(db, skip=skip, limit=limit)
    
    # Add user_name to each review
    result = []
    for review in reviews:
        review_dict = {
            **review.__dict__,
            "user_name": review.user.username,
        }
        result.append(schemas.Review(**review_dict))
    
    return result


@router.get("/admin/gadgets", response_model=List[schemas.Gadget])
def get_all_gadgets(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Get all gadgets (admin only).
    """
    return crud.gadget.get_multi(db, skip=skip, limit=limit)


@router.post("/admin/gadgets", response_model=schemas.Gadget)
def create_gadget(
    *,
    db: Session = Depends(deps.get_db),
    gadget_in: schemas.GadgetCreate,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create new gadget (admin only).
    """
    gadget = crud.gadget.create(db, obj_in=gadget_in)
    return gadget


@router.put("/admin/gadgets/{id}", response_model=schemas.Gadget)
def update_gadget(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    gadget_in: schemas.GadgetUpdate,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Update gadget (admin only).
    """
    gadget = crud.gadget.get(db, id=id)
    if not gadget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gadget not found",
        )
    
    gadget = crud.gadget.update(db, db_obj=gadget, obj_in=gadget_in)
    return gadget


@router.delete("/admin/gadgets/{id}")
def delete_gadget(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Delete gadget (admin only).
    """
    gadget = crud.gadget.get(db, id=id)
    if not gadget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gadget not found",
        )
    
    crud.gadget.remove(db, id=id)
    return {"message": "Gadget deleted successfully"}
