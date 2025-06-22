"""
Database model for users.
"""

from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class User(Base):
    """User model for authentication and user profiles."""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, index=True)
    bio = Column(String, nullable=True)
    profile_photo = Column(String, nullable=True)  # URL to profile photo
    is_admin = Column(Boolean, default=False)
    joined_date = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    reviews = relationship("Review", back_populates="user")
