"""
Database model for gadgets.
"""

from datetime import datetime
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Gadget(Base):
    """Gadget model for smartphones, laptops, and tablets."""
    
    __tablename__ = "gadgets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    brand = Column(String, index=True, nullable=False)
    category = Column(String, index=True, nullable=False)  # smartphone, laptop, tablet
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    release_date = Column(DateTime, nullable=False)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    specs = relationship("GadgetSpec", back_populates="gadget", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="gadget", cascade="all, delete-orphan")
    
    # Method for calculating average rating
    @property
    def average_rating(self):
        if not self.reviews:
            return 0
        return sum(review.rating for review in self.reviews) / len(self.reviews)


class GadgetSpec(Base):
    """Specifications for gadgets."""
    
    __tablename__ = "gadget_specs"
    
    id = Column(Integer, primary_key=True, index=True)
    gadget_id = Column(Integer, ForeignKey("gadgets.id"), nullable=False)
    spec_name = Column(String, nullable=False)  # e.g., "CPU", "RAM", "Storage"
    spec_value = Column(String, nullable=False)  # e.g., "Snapdragon 888", "8GB", "256GB"
    
    # Relationships
    gadget = relationship("Gadget", back_populates="specs")
