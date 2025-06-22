"""
Script to initialize database with sample data.
"""

import logging
import sys
from datetime import datetime, timedelta
from pathlib import Path
from sqlalchemy.orm import Session

# Add parent directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app import crud, schemas
from app.db.base_class import Base
from app.db.session import SessionLocal, engine
from app.core.security import get_password_hash


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_db(db: Session) -> None:
    """
    Initialize database with sample data.
    """
    # Create admin user
    admin_user = crud.user.get_by_email(db, email="admin@wisetech.com")
    if not admin_user:
        logger.info("Creating admin user")
        admin_in = schemas.UserCreate(
            email="admin@wisetech.com",
            username="admin",
            password="admin123",
            full_name="Admin User",
            bio="Administrator account for WiseTech platform.",
        )
        admin_user = crud.user.create(db, obj_in=admin_in)
        
        # Set admin privileges
        admin_user.is_admin = True
        db.add(admin_user)
        db.commit()
    
    # Create sample users
    sample_users = [
        {
            "email": "john.doe@example.com",
            "username": "johndoe",
            "password": "password123",
            "full_name": "John Doe",
            "bio": "Tech enthusiast and reviewer.",
        },
        {
            "email": "sarah.smith@example.com",
            "username": "sarahsmith",
            "password": "password123",
            "full_name": "Sarah Smith",
            "bio": "Passionate about smartphones and photography.",
        },
        {
            "email": "michael.johnson@example.com",
            "username": "mikejohnson",
            "password": "password123",
            "full_name": "Michael Johnson",
            "bio": "Computer engineer and laptop expert.",
        },
    ]
    
    created_users = []
    for user_data in sample_users:
        user = crud.user.get_by_email(db, email=user_data["email"])
        if not user:
            logger.info(f"Creating user {user_data['username']}")
            user_in = schemas.UserCreate(**user_data)
            user = crud.user.create(db, obj_in=user_in)
            created_users.append(user)
    
    # Create sample gadgets
    sample_gadgets = [
        {
            "name": "iPhone 15 Probro",
            "brand": "Apple",
            "category": "Smartphones",
            "description": "The latest iPhone with enhanced camera capabilities and powerful A17 chip. Featuring a stunning display, improved battery life, and the latest iOS features.",
            "price": 999.0,
            "release_date": datetime.now() - timedelta(days=90),
            "image_url": "https://placehold.co/600x400/4F46E5/FFFFFF?text=iPhone+15+Pro",
            "specs": [
                {"name": "Display", "value": "6.1\" Super Retina XDR"},
                {"name": "Processor", "value": "A17 Pro chip"},
                {"name": "RAM", "value": "8GB"},
                {"name": "Storage", "value": "128GB/256GB/512GB/1TB"},
                {"name": "Camera", "value": "Triple 48MP system"},
                {"name": "Battery", "value": "3,200 mAh"},
            ],
        },
        {
            "name": "Samsung Galaxy Book Probro",
            "brand": "Samsung",
            "category": "Laptops",
            "description": "Ultra-thin laptop with stunning AMOLED display and all-day battery life. Perfect for creative professionals and business users who need a powerful yet portable device.",
            "price": 1299.0,
            "release_date": datetime.now() - timedelta(days=120),
            "image_url": "https://placehold.co/600x400/4F46E5/FFFFFF?text=Galaxy+Book+Pro",
            "specs": [
                {"name": "Display", "value": "15.6\" AMOLED FHD"},
                {"name": "Processor", "value": "Intel Core i7-1165G7"},
                {"name": "RAM", "value": "16GB"},
                {"name": "Storage", "value": "512GB SSD"},
                {"name": "Graphics", "value": "Intel Iris Xe"},
                {"name": "Battery", "value": "68Wh"},
            ],
        },
        {
            "name": "iPad Aira",
            "brand": "Apple",
            "category": "Tablets",
            "description": "Powerful and versatile tablet with M1 chip and beautiful Retina display. Great for both productivity and entertainment with support for Apple Pencil and Magic Keyboard.",
            "price": 599.0,
            "release_date": datetime.now() - timedelta(days=150),
            "image_url": "https://placehold.co/600x400/4F46E5/FFFFFF?text=iPad+Air",
            "specs": [
                {"name": "Display", "value": "10.9\" Liquid Retina"},
                {"name": "Processor", "value": "Apple M1"},
                {"name": "RAM", "value": "8GB"},
                {"name": "Storage", "value": "64GB/256GB"},
                {"name": "Camera", "value": "12MP"},
                {"name": "Battery", "value": "28.6Wh"},
            ],
        },
        {
            "name": "Google Pixel 800",
            "brand": "Google",
            "category": "Smartphones",
            "description": "Pure Android experience with outstanding camera quality and AI features. Known for its exceptional photo processing capabilities and clean software experience.",
            "price": 699.0,
            "release_date": datetime.now() - timedelta(days=60),
            "image_url": "https://placehold.co/600x400/4F46E5/FFFFFF?text=Pixel+8",
            "specs": [
                {"name": "Display", "value": "6.3\" OLED FHD+"},
                {"name": "Processor", "value": "Google Tensor G3"},
                {"name": "RAM", "value": "8GB"},
                {"name": "Storage", "value": "128GB/256GB"},
                {"name": "Camera", "value": "Dual 50MP system"},
                {"name": "Battery", "value": "4,500 mAh"},
            ],
        },
    ]
    
    created_gadgets = []
    for gadget_data in sample_gadgets:
        specs = gadget_data.pop("specs")
        
        # Check if gadget already exists
        existing_gadgets = crud.gadget.filter_gadgets(
            db, category=gadget_data["category"], brand=gadget_data["brand"]
        )
        
        exists = False
        for g in existing_gadgets:
            if g.name == gadget_data["name"]:
                exists = True
                created_gadgets.append(g)
                break
                
        if not exists:
            logger.info(f"Creating gadget {gadget_data['name']}")
            gadget_in = schemas.GadgetCreate(**gadget_data)
            gadget = crud.gadget.create_with_specs(db, gadget_in=gadget_in, specs=specs)
            created_gadgets.append(gadget)
    
    # Create sample reviews
    sample_reviews = [
        {
            "gadget_name": "iPhone 15 Pro",
            "user_name": "johndoe",
            "title": "Amazing Camera Quality",
            "content": "The camera quality is mind-blowing! Battery life is also much improved.",
            "rating": 5.0,
            "pros": "Great camera, excellent build quality, improved battery life",
            "cons": "Still expensive, charger not included",
        },
        {
            "gadget_name": "Samsung Galaxy Book Pro",
            "user_name": "sarahsmith",
            "title": "Great Performance, Mediocre Speakers",
            "content": "Great performance but the speakers could be better.",
            "rating": 4.0,
            "pros": "Lightweight, beautiful display, fast performance",
            "cons": "Average speakers, limited ports",
        },
        {
            "gadget_name": "iPad Air",
            "user_name": "mikejohnson",
            "title": "Perfect for Productivity",
            "content": "This is the perfect device for productivity. The M1 chip makes everything smooth and responsive.",
            "rating": 5.0,
            "pros": "Powerful processor, great for drawing with Apple Pencil, portable",
            "cons": "Base storage could be better, accessories sold separately",
        },
    ]
    
    for review_data in sample_reviews:
        # Get gadget
        gadget_name = review_data.pop("gadget_name")
        user_name = review_data.pop("user_name")
        
        gadget = None
        for g in created_gadgets:
            if g.name == gadget_name:
                gadget = g
                break
                
        if not gadget:
            continue
            
        # Get user
        user = crud.user.get_by_username(db, username=user_name)
        if not user:
            continue
            
        # Check if review already exists
        existing_reviews = crud.review.get_reviews_by_gadget(db, gadget_id=gadget.id)
        exists = False
        for r in existing_reviews:
            if r.user_id == user.id:
                exists = True
                break
                
        if not exists:
            logger.info(f"Creating review for {gadget_name} by {user_name}")
            review_in = schemas.ReviewCreate(gadget_id=gadget.id, **review_data)
            crud.review.create_user_review(db, obj_in=review_in, user_id=user.id)


def main() -> None:
    """
    Main function to initialize database.
    """
    logger.info("Creating initial data")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Create session
    db = SessionLocal()
    
    # Initialize database with sample data
    init_db(db)
    
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
