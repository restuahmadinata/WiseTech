"""
User API endpoints.
"""

import os
import shutil
import uuid
from typing import Any, List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/users/profile", response_model=schemas.User)
def read_user_profile(
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user profile.
    """
    return current_user


@router.put("/users/profile", response_model=schemas.User)
def update_user_profile(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update current user profile.
    """
    user = crud.user.update(db, db_obj=current_user, obj_in=user_in)
    return user





@router.get("/users/reviews", response_model=List[schemas.ReviewWithDetails])
def get_current_user_reviews(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user's reviews.
    """
    reviews = crud.review.get_reviews_by_user(
        db, user_id=current_user.id, skip=skip, limit=limit
    )
    
    # Convert to ReviewWithDetails schema
    result = []
    for review in reviews:
        gadget = crud.gadget.get(db, id=review.gadget_id)
        review_dict = {
            **review.__dict__,
            "user_name": review.user.username,
            "gadget_name": gadget.name,
            "gadget_brand": gadget.brand,
            "gadget_category": gadget.category,
        }
        result.append(schemas.ReviewWithDetails(**review_dict))
        
    return result


@router.post("/users/profile/photo")
def upload_profile_photo(
    *,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload profile photo for current user.
    """
    print(f"📸 Upload profile photo request from user: {current_user.id}")
    print(f"📸 File details: name={file.filename}, type={file.content_type}")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
    if file.content_type not in allowed_types:
        print(f"❌ Invalid file type: {file.content_type}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG, and GIF files are allowed",
        )
    
    # Validate file size (max 5MB)
    max_size = 5 * 1024 * 1024  # 5MB
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Seek back to beginning
    
    print(f"📸 File size: {file_size} bytes")
    
    if file_size > max_size:
        print(f"❌ File too large: {file_size} > {max_size}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size must be less than 5MB",
        )
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    
    print(f"📸 Generated unique filename: {unique_filename}")
    
    # Create upload directory if it doesn't exist
    upload_dir = "uploads/profile_photos"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save file
    file_path = os.path.join(upload_dir, unique_filename)
    print(f"📸 Saving file to: {file_path}")
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"✅ File saved successfully")
    except Exception as e:
        print(f"❌ Failed to save file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save file",
        )
    
    # Delete old profile photo if exists
    if current_user.profile_photo:
        old_file_path = current_user.profile_photo.replace("/uploads/", "uploads/")
        print(f"📸 Deleting old photo: {old_file_path}")
        if os.path.exists(old_file_path):
            try:
                os.remove(old_file_path)
                print(f"✅ Old photo deleted")
            except Exception as e:
                print(f"⚠️ Failed to delete old photo: {e}")
                pass  # Ignore if file doesn't exist
    
    # Update user profile with new photo URL
    photo_url = f"/uploads/profile_photos/{unique_filename}"
    print(f"📸 Photo URL: {photo_url}")
    
    user_update = schemas.UserUpdate(profile_photo=photo_url)
    user = crud.user.update(db, db_obj=current_user, obj_in=user_update)
    
    print(f"✅ User profile updated successfully")
    
    response_data = {
        "message": "Profile photo uploaded successfully", 
        "photo_url": photo_url,
        "profile_photo_url": photo_url  # For frontend compatibility
    }
    
    print(f"📸 Returning response: {response_data}")
    return response_data


@router.delete("/users/profile/photo")
def delete_profile_photo(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete profile photo for current user.
    """
    if not current_user.profile_photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No profile photo to delete",
        )
    
    # Delete file from filesystem
    file_path = current_user.profile_photo.replace("/uploads/", "uploads/")
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception:
            pass  # Ignore if file doesn't exist
    
    # Update user profile to remove photo URL
    user_update = schemas.UserUpdate(profile_photo=None)
    user = crud.user.update(db, db_obj=current_user, obj_in=user_update)
    
    return {"message": "Profile photo deleted successfully"}
