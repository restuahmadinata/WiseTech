"""
Pydantic schemas for review-related API operations.
"""

from datetime import datetime
from typing import Dict, List, Optional, Any

from pydantic import BaseModel
from app.models.review import ReviewStatus


class ReviewBase(BaseModel):
    """Base schema for review."""
    title: str
    content: str
    rating: float
    pros: Optional[str] = None
    cons: Optional[str] = None


class ReviewCreate(ReviewBase):
    """Schema for creating a review."""
    gadget_id: int


class ReviewUpdate(BaseModel):
    """Schema for updating a review."""
    title: Optional[str] = None
    content: Optional[str] = None
    rating: Optional[float] = None
    pros: Optional[str] = None
    cons: Optional[str] = None
    status: Optional[ReviewStatus] = None


class ReviewInDBBase(ReviewBase):
    """Base schema for review in database."""
    id: int
    user_id: int
    gadget_id: int
    status: ReviewStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Review(ReviewInDBBase):
    """Schema for review response."""
    user_name: str  # Additional field for user's name
    user: Optional[Dict[str, Any]] = None  # User information
    gadget: Optional[Dict[str, Any]] = None  # Gadget information


class ReviewWithDetails(Review):
    """Schema for review response with gadget details."""
    gadget_name: str
    gadget_brand: str
    gadget_category: str


class ReviewStatusUpdate(BaseModel):
    """Schema for updating review status (admin only)."""
    status: ReviewStatus


class ReviewPaginatedResponse(BaseModel):
    """Schema for paginated review response."""
    reviews: List[Review]
    total: int
    total_pages: int
    current_page: int
    limit: int
