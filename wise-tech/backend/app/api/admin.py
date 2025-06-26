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


@router.post("/admin/users", response_model=schemas.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserAdminCreate,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create new user (admin only).
    """
    # Validasi input
    if not user_in.email or not user_in.email.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is required",
        )
    
    if not user_in.username or not user_in.username.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username is required",
        )
    
    if not user_in.password or not user_in.password.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is required",
        )
    
    if not user_in.full_name or not user_in.full_name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Full name is required",
        )
    
    # Mengecek apakah email sudah ada
    existing_user = crud.user.get_by_email(db, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )
    
    # Mengecek apakah username sudah ada
    existing_username = crud.user.get_by_username(db, username=user_in.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken",
        )
    
    user = crud.user.create_admin_user(db, obj_in=user_in)
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
    
    # Jangan izinkan admin mengubah status admin mereka sendiri
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


@router.get("/admin/dashboard/stats")
def get_dashboard_stats(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Dict[str, int]:
    """
    Get dashboard statistics (admin only).
    """
    # Menghitung total pengguna
    total_users = db.query(func.count(models.User.id)).scalar() or 0
    
    # Menghitung total gadget
    total_gadgets = db.query(func.count(models.Gadget.id)).scalar() or 0
    
    # Menghitung total review
    total_reviews = db.query(func.count(models.Review.id)).scalar() or 0
    
    return {
        "totalUsers": total_users,
        "totalGadgets": total_gadgets,
        "totalReviews": total_reviews,
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
    from sqlalchemy import desc
    from sqlalchemy.orm import joinedload
    
    # Get reviews with user and gadget data, sorted by creation date (newest first)
    reviews = (
        db.query(models.Review)
        .options(joinedload(models.Review.user), joinedload(models.Review.gadget))
        .order_by(desc(models.Review.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    # Add user_name and format response consistently
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
            "status": getattr(review, 'status', 'approved'),
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
