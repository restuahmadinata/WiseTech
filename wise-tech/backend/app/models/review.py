"""
Database model for reviews.
"""

from datetime import datetime
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.base_class import Base


class ReviewStatus(str, enum.Enum):
    """Review status enumeration."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Review(Base):
    """Review model for gadget reviews."""
    
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    gadget_id = Column(Integer, ForeignKey("gadgets.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    rating = Column(Float, nullable=False)  # 1-5 star rating
    pros = Column(Text, nullable=True)
    cons = Column(Text, nullable=True)
    status = Column(Enum(ReviewStatus), default=ReviewStatus.APPROVED, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="reviews")
    gadget = relationship("Gadget", back_populates="reviews")
