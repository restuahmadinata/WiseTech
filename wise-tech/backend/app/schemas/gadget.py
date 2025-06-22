"""
Pydantic schemas for gadget-related API operations.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class GadgetSpecBase(BaseModel):
    """Base schema for gadget specifications."""
    spec_name: str
    spec_value: str


class GadgetSpecCreate(GadgetSpecBase):
    """Schema for creating a gadget specification."""
    pass


class GadgetSpecUpdate(GadgetSpecBase):
    """Schema for updating a gadget specification."""
    spec_name: Optional[str] = None
    spec_value: Optional[str] = None


class GadgetSpecInDBBase(GadgetSpecBase):
    """Base schema for gadget specification in database."""
    id: int
    gadget_id: int

    class Config:
        from_attributes = True


class GadgetSpec(GadgetSpecInDBBase):
    """Schema for gadget specification response."""
    pass


class GadgetBase(BaseModel):
    """Base schema for gadget."""
    name: str
    brand: str
    category: str
    description: str
    price: float
    image_url: Optional[str] = None


class GadgetCreate(GadgetBase):
    """Schema for creating a gadget."""
    release_date: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class GadgetUpdate(BaseModel):
    """Schema for updating a gadget."""
    name: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    release_date: Optional[datetime] = None
    image_url: Optional[str] = None


class GadgetInDBBase(GadgetBase):
    """Base schema for gadget in database."""
    id: int
    release_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Gadget(GadgetInDBBase):
    """Schema for gadget response."""
    specs: List[GadgetSpec] = []
    average_rating: float = 0
    review_count: int = 0


class ReviewInGadget(BaseModel):
    """Simplified review schema for inclusion in gadget response."""
    id: int
    user_id: int
    title: str
    content: str
    rating: float
    pros: Optional[str] = None
    cons: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    user_name: str
    
    class Config:
        from_attributes = True


class GadgetWithReviews(Gadget):
    """Schema for gadget response with reviews."""
    reviews: List[ReviewInGadget] = []
