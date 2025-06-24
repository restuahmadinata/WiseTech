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
    
    # Create sample users - 15 users total
    sample_users = [
        {
            "email": "john.doe@example.com",
            "username": "johndoe",
            "password": "password123",
            "full_name": "John Doe",
            "bio": "Tech enthusiast and reviewer specializing in smartphones.",
        },
        {
            "email": "sarah.smith@example.com",
            "username": "sarahsmith",
            "password": "password123",
            "full_name": "Sarah Smith",
            "bio": "Passionate about smartphones and mobile photography.",
        },
        {
            "email": "michael.johnson@example.com",
            "username": "mikejohnson",
            "password": "password123",
            "full_name": "Michael Johnson",
            "bio": "Computer engineer and laptop expert.",
        },
        {
            "email": "emily.chen@example.com",
            "username": "emilychen",
            "password": "password123",
            "full_name": "Emily Chen",
            "bio": "Content creator and tablet enthusiast.",
        },
        {
            "email": "david.wilson@example.com",
            "username": "davidwilson",
            "password": "password123",
            "full_name": "David Wilson",
            "bio": "Gaming enthusiast and hardware reviewer.",
        },
        {
            "email": "lisa.garcia@example.com",
            "username": "lisagarcia",
            "password": "password123",
            "full_name": "Lisa Garcia",
            "bio": "Professional photographer and tech reviewer.",
        },
        {
            "email": "james.taylor@example.com",
            "username": "jamestaylor",
            "password": "password123",
            "full_name": "James Taylor",
            "bio": "Software developer with passion for mobile devices.",
        },
        {
            "email": "amanda.brown@example.com",
            "username": "amandabrown",
            "password": "password123",
            "full_name": "Amanda Brown",
            "bio": "Business professional focusing on productivity tools.",
        },
        {
            "email": "robert.lee@example.com",
            "username": "robertlee",
            "password": "password123",
            "full_name": "Robert Lee",
            "bio": "Tech journalist and industry analyst.",
        },
        {
            "email": "maria.gonzalez@example.com",
            "username": "mariagonzalez",
            "password": "password123",
            "full_name": "Maria Gonzalez",
            "bio": "Digital artist and creative professional.",
        },
        {
            "email": "kevin.kim@example.com",
            "username": "kevinkim",
            "password": "password123",
            "full_name": "Kevin Kim",
            "bio": "Student and casual tech user.",
        },
        {
            "email": "stephanie.davis@example.com",
            "username": "stephaniedavis",
            "password": "password123",
            "full_name": "Stephanie Davis",
            "bio": "UI/UX designer interested in device ergonomics.",
        },
        {
            "email": "alex.rodriguez@example.com",
            "username": "alexrodriguez",
            "password": "password123",
            "full_name": "Alex Rodriguez",
            "bio": "IT consultant and enterprise technology expert.",
        },
        {
            "email": "jennifer.white@example.com",
            "username": "jenniferwhite",
            "password": "password123",
            "full_name": "Jennifer White",
            "bio": "Marketing professional and social media enthusiast.",
        },
        {
            "email": "daniel.martinez@example.com",
            "username": "danielmartinez",
            "password": "password123",
            "full_name": "Daniel Martinez",
            "bio": "Video editor and content creation specialist.",
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
    
    # Create sample gadgets - 30 items across different categories
    sample_gadgets = [
        # Smartphones (10 items)
        {
            "name": "iPhone 15 Pro",
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
            "name": "Samsung Galaxy S24 Ultra",
            "brand": "Samsung",
            "category": "Smartphones",
            "description": "Premium Android flagship with S Pen, advanced AI features, and exceptional camera system. Perfect for productivity and creativity.",
            "price": 1199.0,
            "release_date": datetime.now() - timedelta(days=60),
            "image_url": "https://placehold.co/600x400/1F2937/FFFFFF?text=Galaxy+S24+Ultra",
            "specs": [
                {"name": "Display", "value": "6.8\" Dynamic AMOLED 2X"},
                {"name": "Processor", "value": "Snapdragon 8 Gen 3"},
                {"name": "RAM", "value": "12GB"},
                {"name": "Storage", "value": "256GB/512GB/1TB"},
                {"name": "Camera", "value": "Quad 200MP system"},
                {"name": "Battery", "value": "5,000 mAh"},
            ],
        },
        {
            "name": "Google Pixel 8 Pro",
            "brand": "Google",
            "category": "Smartphones",
            "description": "Pure Android experience with outstanding camera quality and AI features. Known for its exceptional photo processing capabilities and clean software experience.",
            "price": 899.0,
            "release_date": datetime.now() - timedelta(days=120),
            "image_url": "https://placehold.co/600x400/059669/FFFFFF?text=Pixel+8+Pro",
            "specs": [
                {"name": "Display", "value": "6.7\" LTPO OLED"},
                {"name": "Processor", "value": "Google Tensor G3"},
                {"name": "RAM", "value": "12GB"},
                {"name": "Storage", "value": "128GB/256GB/512GB"},
                {"name": "Camera", "value": "Triple 50MP system"},
                {"name": "Battery", "value": "5,050 mAh"},
            ],
        },
        {
            "name": "OnePlus 12",
            "brand": "OnePlus",
            "category": "Smartphones",
            "description": "Flagship killer with incredible fast charging, smooth performance, and premium design at a competitive price point.",
            "price": 799.0,
            "release_date": datetime.now() - timedelta(days=80),
            "image_url": "https://placehold.co/600x400/DC2626/FFFFFF?text=OnePlus+12",
            "specs": [
                {"name": "Display", "value": "6.82\" LTPO AMOLED"},
                {"name": "Processor", "value": "Snapdragon 8 Gen 3"},
                {"name": "RAM", "value": "12GB"},
                {"name": "Storage", "value": "256GB/512GB"},
                {"name": "Camera", "value": "Triple 50MP system"},
                {"name": "Battery", "value": "5,400 mAh"},
            ],
        },
        {
            "name": "Xiaomi 14 Ultra",
            "brand": "Xiaomi",
            "category": "Smartphones",
            "description": "Photography-focused flagship with Leica cameras, premium materials, and flagship performance at competitive pricing.",
            "price": 1099.0,
            "release_date": datetime.now() - timedelta(days=100),
            "image_url": "https://placehold.co/600x400/7C3AED/FFFFFF?text=Xiaomi+14+Ultra",
            "specs": [
                {"name": "Display", "value": "6.73\" LTPO AMOLED"},
                {"name": "Processor", "value": "Snapdragon 8 Gen 3"},
                {"name": "RAM", "value": "16GB"},
                {"name": "Storage", "value": "512GB/1TB"},
                {"name": "Camera", "value": "Quad 50MP Leica system"},
                {"name": "Battery", "value": "5,300 mAh"},
            ],
        },
        {
            "name": "iPhone 14",
            "brand": "Apple",
            "category": "Smartphones",
            "description": "Reliable iPhone with great camera system, solid performance, and iOS ecosystem integration. Perfect for everyday use.",
            "price": 699.0,
            "release_date": datetime.now() - timedelta(days=400),
            "image_url": "https://placehold.co/600x400/4F46E5/FFFFFF?text=iPhone+14",
            "specs": [
                {"name": "Display", "value": "6.1\" Super Retina XDR"},
                {"name": "Processor", "value": "A15 Bionic chip"},
                {"name": "RAM", "value": "6GB"},
                {"name": "Storage", "value": "128GB/256GB/512GB"},
                {"name": "Camera", "value": "Dual 12MP system"},
                {"name": "Battery", "value": "3,279 mAh"},
            ],
        },
        {
            "name": "Samsung Galaxy A54",
            "brand": "Samsung",
            "category": "Smartphones",
            "description": "Mid-range smartphone with premium features, great camera, and long battery life. Excellent value for money.",
            "price": 449.0,
            "release_date": datetime.now() - timedelta(days=200),
            "image_url": "https://placehold.co/600x400/1F2937/FFFFFF?text=Galaxy+A54",
            "specs": [
                {"name": "Display", "value": "6.4\" Super AMOLED"},
                {"name": "Processor", "value": "Exynos 1380"},
                {"name": "RAM", "value": "8GB"},
                {"name": "Storage", "value": "128GB/256GB"},
                {"name": "Camera", "value": "Triple 50MP system"},
                {"name": "Battery", "value": "5,000 mAh"},
            ],
        },
        {
            "name": "Nothing Phone 2",
            "brand": "Nothing",
            "category": "Smartphones",
            "description": "Unique transparent design with Glyph interface, clean Android experience, and distinctive aesthetic that stands out.",
            "price": 599.0,
            "release_date": datetime.now() - timedelta(days=180),
            "image_url": "https://placehold.co/600x400/374151/FFFFFF?text=Nothing+Phone+2",
            "specs": [
                {"name": "Display", "value": "6.7\" LTPO OLED"},
                {"name": "Processor", "value": "Snapdragon 8+ Gen 1"},
                {"name": "RAM", "value": "12GB"},
                {"name": "Storage", "value": "256GB/512GB"},
                {"name": "Camera", "value": "Dual 50MP system"},
                {"name": "Battery", "value": "4,700 mAh"},
            ],
        },
        {
            "name": "ASUS ROG Phone 8",
            "brand": "ASUS",
            "category": "Smartphones",
            "description": "Ultimate gaming smartphone with advanced cooling, high refresh rate display, and gaming-specific features.",
            "price": 1199.0,
            "release_date": datetime.now() - timedelta(days=50),
            "image_url": "https://placehold.co/600x400/991B1B/FFFFFF?text=ROG+Phone+8",
            "specs": [
                {"name": "Display", "value": "6.78\" AMOLED 165Hz"},
                {"name": "Processor", "value": "Snapdragon 8 Gen 3"},
                {"name": "RAM", "value": "16GB"},
                {"name": "Storage", "value": "512GB/1TB"},
                {"name": "Camera", "value": "Triple 50MP system"},
                {"name": "Battery", "value": "6,000 mAh"},
            ],
        },
        {
            "name": "Sony Xperia 1 V",
            "brand": "Sony",
            "category": "Smartphones",
            "description": "Professional photography and videography smartphone with 4K display, advanced camera controls, and content creation focus.",
            "price": 1399.0,
            "release_date": datetime.now() - timedelta(days=160),
            "image_url": "https://placehold.co/600x400/0F172A/FFFFFF?text=Xperia+1+V",
            "specs": [
                {"name": "Display", "value": "6.5\" 4K OLED"},
                {"name": "Processor", "value": "Snapdragon 8 Gen 2"},
                {"name": "RAM", "value": "12GB"},
                {"name": "Storage", "value": "256GB/512GB"},
                {"name": "Camera", "value": "Triple 48MP system"},
                {"name": "Battery", "value": "5,000 mAh"},
            ],
        },

        # Laptops (10 items)
        {
            "name": "MacBook Pro 16\" M3",
            "brand": "Apple",
            "category": "Laptops",
            "description": "Professional laptop with M3 chip, stunning Liquid Retina XDR display, and incredible performance for creative professionals.",
            "price": 2499.0,
            "release_date": datetime.now() - timedelta(days=70),
            "image_url": "https://inbox.ph/wp-content/uploads/2023/12/MacBook-Air-Pro-16-space-black.jpg",
            "specs": [
                {"name": "Display", "value": "16.2\" Liquid Retina XDR"},
                {"name": "Processor", "value": "Apple M3 Pro/Max"},
                {"name": "RAM", "value": "18GB/36GB"},
                {"name": "Storage", "value": "512GB/1TB/2TB SSD"},
                {"name": "Graphics", "value": "Integrated GPU"},
                {"name": "Battery", "value": "100Wh"},
            ],
        },
        {
            "name": "Dell XPS 13 Plus",
            "brand": "Dell",
            "category": "Laptops",
            "description": "Premium ultrabook with stunning InfinityEdge display, modern design, and excellent build quality for professionals.",
            "price": 1299.0,
            "release_date": datetime.now() - timedelta(days=150),
            "image_url": "https://placehold.co/600x400/1F2937/FFFFFF?text=Dell+XPS+13",
            "specs": [
                {"name": "Display", "value": "13.4\" InfinityEdge OLED"},
                {"name": "Processor", "value": "Intel Core i7-1360P"},
                {"name": "RAM", "value": "16GB/32GB"},
                {"name": "Storage", "value": "512GB/1TB SSD"},
                {"name": "Graphics", "value": "Intel Iris Xe"},
                {"name": "Battery", "value": "55Wh"},
            ],
        },
        {
            "name": "Samsung Galaxy Book Pro",
            "brand": "Samsung",
            "category": "Laptops",
            "description": "Ultra-thin laptop with stunning AMOLED display and all-day battery life. Perfect for creative professionals and business users.",
            "price": 1199.0,
            "release_date": datetime.now() - timedelta(days=120),
            "image_url": "https://placehold.co/600x400/1F2937/FFFFFF?text=Galaxy+Book+Pro",
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
            "name": "ASUS ROG Strix G16",
            "brand": "ASUS",
            "category": "Laptops",
            "description": "Gaming laptop with powerful RTX graphics, high refresh rate display, and advanced cooling for intense gaming sessions.",
            "price": 1899.0,
            "release_date": datetime.now() - timedelta(days=90),
            "image_url": "https://placehold.co/600x400/991B1B/FFFFFF?text=ROG+Strix+G16",
            "specs": [
                {"name": "Display", "value": "16\" QHD 165Hz"},
                {"name": "Processor", "value": "Intel Core i7-13650HX"},
                {"name": "RAM", "value": "16GB DDR5"},
                {"name": "Storage", "value": "1TB SSD"},
                {"name": "Graphics", "value": "RTX 4060 8GB"},
                {"name": "Battery", "value": "90Wh"},
            ],
        },
        {
            "name": "HP Spectre x360 14",
            "brand": "HP",
            "category": "Laptops",
            "description": "Convertible 2-in-1 laptop with 360-degree hinge, premium design, and versatile functionality for work and entertainment.",
            "price": 1399.0,
            "release_date": datetime.now() - timedelta(days=110),
            "image_url": "https://placehold.co/600x400/7C3AED/FFFFFF?text=HP+Spectre+x360",
            "specs": [
                {"name": "Display", "value": "13.5\" OLED Touch"},
                {"name": "Processor", "value": "Intel Core i7-1355U"},
                {"name": "RAM", "value": "16GB"},
                {"name": "Storage", "value": "512GB SSD"},
                {"name": "Graphics", "value": "Intel Iris Xe"},
                {"name": "Battery", "value": "66Wh"},
            ],
        },
        {
            "name": "Lenovo ThinkPad X1 Carbon",
            "brand": "Lenovo",
            "category": "Laptops",
            "description": "Business laptop with legendary ThinkPad reliability, excellent keyboard, and robust security features for professionals.",
            "price": 1599.0,
            "release_date": datetime.now() - timedelta(days=130),
            "image_url": "https://placehold.co/600x400/0F172A/FFFFFF?text=ThinkPad+X1",
            "specs": [
                {"name": "Display", "value": "14\" WUXGA IPS"},
                {"name": "Processor", "value": "Intel Core i7-1355U"},
                {"name": "RAM", "value": "16GB"},
                {"name": "Storage", "value": "512GB SSD"},
                {"name": "Graphics", "value": "Intel Iris Xe"},
                {"name": "Battery", "value": "57Wh"},
            ],
        },
        {
            "name": "Microsoft Surface Laptop 5",
            "brand": "Microsoft",
            "category": "Laptops",
            "description": "Elegant laptop with premium Alcantara finish, excellent display, and seamless Windows integration for productivity.",
            "price": 1299.0,
            "release_date": datetime.now() - timedelta(days=200),
            "image_url": "https://placehold.co/600x400/059669/FFFFFF?text=Surface+Laptop+5",
            "specs": [
                {"name": "Display", "value": "13.5\" PixelSense Touch"},
                {"name": "Processor", "value": "Intel Core i7-1255U"},
                {"name": "RAM", "value": "16GB"},
                {"name": "Storage", "value": "512GB SSD"},
                {"name": "Graphics", "value": "Intel Iris Xe"},
                {"name": "Battery", "value": "47.4Wh"},
            ],
        },
        {
            "name": "Acer Swift 3 OLED",
            "brand": "Acer",
            "category": "Laptops",
            "description": "Affordable laptop with stunning OLED display, solid performance, and great value for students and professionals.",
            "price": 899.0,
            "release_date": datetime.now() - timedelta(days=180),
            "image_url": "https://placehold.co/600x400/DC2626/FFFFFF?text=Acer+Swift+3",
            "specs": [
                {"name": "Display", "value": "14\" OLED 2.8K"},
                {"name": "Processor", "value": "Intel Core i7-1355U"},
                {"name": "RAM", "value": "16GB"},
                {"name": "Storage", "value": "512GB SSD"},
                {"name": "Graphics", "value": "Intel Iris Xe"},
                {"name": "Battery", "value": "59Wh"},
            ],
        },
        {
            "name": "ASUS ZenBook 14",
            "brand": "ASUS",
            "category": "Laptops",
            "description": "Compact ultrabook with NumberPad 2.0, excellent portability, and solid performance for everyday computing needs.",
            "price": 799.0,
            "release_date": datetime.now() - timedelta(days=140),
            "image_url": "https://placehold.co/600x400/374151/FFFFFF?text=ZenBook+14",
            "specs": [
                {"name": "Display", "value": "14\" FHD IPS"},
                {"name": "Processor", "value": "Intel Core i5-1235U"},
                {"name": "RAM", "value": "8GB"},
                {"name": "Storage", "value": "512GB SSD"},
                {"name": "Graphics", "value": "Intel Iris Xe"},
                {"name": "Battery", "value": "75Wh"},
            ],
        },
        {
            "name": "MSI Creator Z16P",
            "brand": "MSI",
            "category": "Laptops",
            "description": "Content creation laptop with powerful RTX graphics, color-accurate display, and professional-grade performance.",
            "price": 2299.0,
            "release_date": datetime.now() - timedelta(days=85),
            "image_url": "https://placehold.co/600x400/991B1B/FFFFFF?text=MSI+Creator+Z16P",
            "specs": [
                {"name": "Display", "value": "16\" QHD+ 165Hz"},
                {"name": "Processor", "value": "Intel Core i7-12700H"},
                {"name": "RAM", "value": "32GB DDR5"},
                {"name": "Storage", "value": "1TB SSD"},
                {"name": "Graphics", "value": "RTX 4070 8GB"},
                {"name": "Battery", "value": "90Wh"},
            ],
        },

        # Tablets (10 items)
        {
            "name": "iPad Pro 12.9\" M2",
            "brand": "Apple",
            "category": "Tablets",
            "description": "Professional tablet with M2 chip, Liquid Retina XDR display, and powerful performance for creative professionals and productivity.",
            "price": 1099.0,
            "release_date": datetime.now() - timedelta(days=180),
            "image_url": "https://placehold.co/600x400/4F46E5/FFFFFF?text=iPad+Pro+12.9",
            "specs": [
                {"name": "Display", "value": "12.9\" Liquid Retina XDR"},
                {"name": "Processor", "value": "Apple M2"},
                {"name": "RAM", "value": "8GB/16GB"},
                {"name": "Storage", "value": "128GB/256GB/512GB/1TB/2TB"},
                {"name": "Camera", "value": "12MP + LiDAR"},
                {"name": "Battery", "value": "40.88Wh"},
            ],
        },
        {
            "name": "iPad Air 5th Gen",
            "brand": "Apple",
            "category": "Tablets",
            "description": "Powerful and versatile tablet with M1 chip and beautiful Liquid Retina display. Great for both productivity and entertainment.",
            "price": 599.0,
            "release_date": datetime.now() - timedelta(days=150),
            "image_url": "https://placehold.co/600x400/4F46E5/FFFFFF?text=iPad+Air+5",
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
            "name": "Samsung Galaxy Tab S9 Ultra",
            "brand": "Samsung",
            "category": "Tablets",
            "description": "Premium Android tablet with massive display, S Pen included, and flagship performance for productivity and creativity.",
            "price": 1199.0,
            "release_date": datetime.now() - timedelta(days=100),
            "image_url": "https://placehold.co/600x400/1F2937/FFFFFF?text=Galaxy+Tab+S9+Ultra",
            "specs": [
                {"name": "Display", "value": "14.6\" Dynamic AMOLED 2X"},
                {"name": "Processor", "value": "Snapdragon 8 Gen 2"},
                {"name": "RAM", "value": "12GB/16GB"},
                {"name": "Storage", "value": "256GB/512GB/1TB"},
                {"name": "Camera", "value": "Dual 13MP"},
                {"name": "Battery", "value": "11,200 mAh"},
            ],
        },
        {
            "name": "Microsoft Surface Pro 9",
            "brand": "Microsoft",
            "category": "Tablets",
            "description": "2-in-1 tablet with laptop-grade performance, detachable keyboard, and full Windows experience for ultimate versatility.",
            "price": 999.0,
            "release_date": datetime.now() - timedelta(days=220),
            "image_url": "https://placehold.co/600x400/059669/FFFFFF?text=Surface+Pro+9",
            "specs": [
                {"name": "Display", "value": "13\" PixelSense Flow"},
                {"name": "Processor", "value": "Intel Core i5/i7"},
                {"name": "RAM", "value": "8GB/16GB/32GB"},
                {"name": "Storage", "value": "128GB/256GB/512GB/1TB"},
                {"name": "Camera", "value": "10MP rear, 5MP front"},
                {"name": "Battery", "value": "47.36Wh"},
            ],
        },
        {
            "name": "Lenovo Tab P12 Pro",
            "brand": "Lenovo",
            "category": "Tablets",
            "description": "Premium Android tablet with OLED display, JBL speakers, and optional productivity accessories for work and entertainment.",
            "price": 699.0,
            "release_date": datetime.now() - timedelta(days=160),
            "image_url": "https://placehold.co/600x400/7C3AED/FFFFFF?text=Tab+P12+Pro",
            "specs": [
                {"name": "Display", "value": "12.6\" OLED 2K"},
                {"name": "Processor", "value": "MediaTek Dimensity 7050"},
                {"name": "RAM", "value": "8GB/12GB"},
                {"name": "Storage", "value": "128GB/256GB"},
                {"name": "Camera", "value": "13MP + 5MP"},
                {"name": "Battery", "value": "10,200 mAh"},
            ],
        },
        {
            "name": "Amazon Fire Max 11",
            "brand": "Amazon",
            "category": "Tablets",
            "description": "Budget-friendly tablet with large display, long battery life, and seamless integration with Amazon services and Alexa.",
            "price": 229.0,
            "release_date": datetime.now() - timedelta(days=140),
            "image_url": "https://placehold.co/600x400/DC2626/FFFFFF?text=Fire+Max+11",
            "specs": [
                {"name": "Display", "value": "11\" 2K"},
                {"name": "Processor", "value": "MediaTek MT8188J"},
                {"name": "RAM", "value": "4GB"},
                {"name": "Storage", "value": "64GB/128GB"},
                {"name": "Camera", "value": "8MP rear, 8MP front"},
                {"name": "Battery", "value": "14 hours"},
            ],
        },
        {
            "name": "ASUS ROG Flow Z13",
            "brand": "ASUS",
            "category": "Tablets",
            "description": "Gaming tablet with detachable keyboard, powerful performance, and unique design for gaming on the go.",
            "price": 1599.0,
            "release_date": datetime.now() - timedelta(days=190),
            "image_url": "https://placehold.co/600x400/991B1B/FFFFFF?text=ROG+Flow+Z13",
            "specs": [
                {"name": "Display", "value": "13.4\" Touchscreen 120Hz"},
                {"name": "Processor", "value": "Intel Core i7-12700H"},
                {"name": "RAM", "value": "16GB"},
                {"name": "Storage", "value": "512GB SSD"},
                {"name": "Graphics", "value": "RTX 3050 Ti"},
                {"name": "Battery", "value": "56Wh"},
            ],
        },
        {
            "name": "Huawei MatePad Pro 12.6",
            "brand": "Huawei",
            "category": "Tablets",
            "description": "Professional tablet with OLED display, M-Pencil support, and HarmonyOS for productivity and creative work.",
            "price": 799.0,
            "release_date": datetime.now() - timedelta(days=170),
            "image_url": "https://placehold.co/600x400/374151/FFFFFF?text=MatePad+Pro+12.6",
            "specs": [
                {"name": "Display", "value": "12.6\" OLED 2.5K"},
                {"name": "Processor", "value": "Kirin 9000E"},
                {"name": "RAM", "value": "8GB"},
                {"name": "Storage", "value": "128GB/256GB"},
                {"name": "Camera", "value": "13MP + 8MP"},
                {"name": "Battery", "value": "10,050 mAh"},
            ],
        },
        {
            "name": "Xiaomi Pad 6",
            "brand": "Xiaomi",
            "category": "Tablets",
            "description": "Affordable tablet with flagship performance, high refresh rate display, and excellent value for entertainment and productivity.",
            "price": 399.0,
            "release_date": datetime.now() - timedelta(days=120),
            "image_url": "https://placehold.co/600x400/7C3AED/FFFFFF?text=Xiaomi+Pad+6",
            "specs": [
                {"name": "Display", "value": "11\" IPS 144Hz"},
                {"name": "Processor", "value": "Snapdragon 870"},
                {"name": "RAM", "value": "6GB/8GB"},
                {"name": "Storage", "value": "128GB/256GB"},
                {"name": "Camera", "value": "13MP rear, 8MP front"},
                {"name": "Battery", "value": "8,840 mAh"},
            ],
        },
        {
            "name": "OPPO Pad Air",
            "brand": "OPPO",
            "category": "Tablets",
            "description": "Stylish and lightweight tablet with good performance, decent display, and attractive design for everyday use.",
            "price": 299.0,
            "release_date": datetime.now() - timedelta(days=110),
            "image_url": "https://placehold.co/600x400/059669/FFFFFF?text=OPPO+Pad+Air",
            "specs": [
                {"name": "Display", "value": "10.36\" IPS 2K"},
                {"name": "Processor", "value": "Snapdragon 680"},
                {"name": "RAM", "value": "4GB/6GB"},
                {"name": "Storage", "value": "64GB/128GB"},
                {"name": "Camera", "value": "8MP rear, 5MP front"},
                {"name": "Battery", "value": "7,100 mAh"},
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
    
    # Create sample reviews - 50+ reviews across different gadgets
    sample_reviews = [
        # iPhone 15 Pro reviews
        {
            "gadget_name": "iPhone 15 Pro",
            "user_name": "johndoe",
            "title": "Amazing Camera Quality and Performance",
            "content": "The camera quality is mind-blowing! The new A17 Pro chip delivers incredible performance for everything from gaming to video editing. Battery life has significantly improved compared to previous models.",
            "rating": 5.0,
            "pros": "Outstanding camera system, blazing fast performance, premium build quality, excellent battery life",
            "cons": "Very expensive, no charger included, limited customization options",
        },
        {
            "gadget_name": "iPhone 15 Pro",
            "user_name": "sarahsmith",
            "title": "Great for Photography",
            "content": "As a photographer, I'm impressed with the camera capabilities. The Pro cameras produce stunning results in various lighting conditions.",
            "rating": 4.0,
            "pros": "Professional-grade cameras, great color accuracy, reliable performance",
            "cons": "Price point is high, storage options are expensive",
        },
        
        # Samsung Galaxy S24 Ultra reviews
        {
            "gadget_name": "Samsung Galaxy S24 Ultra",
            "user_name": "davidwilson",
            "title": "S Pen Makes All the Difference",
            "content": "The S Pen integration is fantastic for productivity and note-taking. The display is absolutely gorgeous and the camera zoom capabilities are unmatched.",
            "rating": 5.0,
            "pros": "Excellent S Pen functionality, stunning display, incredible zoom range, great multitasking",
            "cons": "Large size might not suit everyone, battery could be better with heavy use",
        },
        {
            "gadget_name": "Samsung Galaxy S24 Ultra",
            "user_name": "lisagarcia",
            "title": "Photography Powerhouse",
            "content": "The camera system is incredible, especially the telephoto lens. Perfect for professional photography needs.",
            "rating": 5.0,
            "pros": "Outstanding camera system, S Pen included, premium design",
            "cons": "Expensive, can get warm during intensive use",
        },

        # Google Pixel 8 Pro reviews
        {
            "gadget_name": "Google Pixel 8 Pro",
            "user_name": "jamestaylor",
            "title": "Pure Android Experience",
            "content": "Clean Android experience with incredible AI features. The computational photography is still the best in the business.",
            "rating": 4.0,
            "pros": "Clean software, excellent camera AI, regular updates, great call screening",
            "cons": "Build quality could be better, sometimes gets warm",
        },
        {
            "gadget_name": "Google Pixel 8 Pro",
            "user_name": "robertlee",
            "title": "AI Features Are Game Changing",
            "content": "Google's AI integration throughout the phone is impressive. Camera features like Magic Eraser and Real Tone work brilliantly.",
            "rating": 4.0,
            "pros": "Advanced AI features, excellent camera processing, timely updates",
            "cons": "Battery life could be improved, limited availability",
        },

        # OnePlus 12 reviews
        {
            "gadget_name": "OnePlus 12",
            "user_name": "kevinkim",
            "title": "Great Value Flagship",
            "content": "Incredible performance at a competitive price. The fast charging is absolutely insane - 0 to 100% in under 30 minutes!",
            "rating": 4.0,
            "pros": "Excellent performance, ultra-fast charging, good value for money, clean software",
            "cons": "Camera could be better, no wireless charging in some regions",
        },

        # MacBook Pro 16\" M3 reviews
        {
            "gadget_name": "MacBook Pro 16\" M3",
            "user_name": "mariagonzalez",
            "title": "Perfect for Creative Work",
            "content": "The M3 chip handles video editing, 3D rendering, and graphic design tasks effortlessly. The display is absolutely stunning for creative work.",
            "rating": 5.0,
            "pros": "Incredible performance, beautiful display, excellent build quality, great speakers",
            "cons": "Very expensive, limited ports, heavy for travel",
        },
        {
            "gadget_name": "MacBook Pro 16\" M3",
            "user_name": "danielmartinez",
            "title": "Video Editing Beast",
            "content": "As a video editor, this machine handles 4K footage like butter. The battery life is impressive even under heavy workloads.",
            "rating": 5.0,
            "pros": "Unmatched performance for creative work, long battery life, silent operation",
            "cons": "Premium price, learning curve for Windows users",
        },

        # Dell XPS 13 Plus reviews
        {
            "gadget_name": "Dell XPS 13 Plus",
            "user_name": "amandabrown",
            "title": "Great Business Laptop",
            "content": "Perfect for business use. The OLED display is gorgeous and the build quality is top-notch. Very portable for frequent travelers.",
            "rating": 4.0,
            "pros": "Premium build quality, stunning OLED display, compact design, good performance",
            "cons": "Limited ports, touchbar can be frustrating, expensive",
        },

        # Samsung Galaxy Book Pro reviews
        {
            "gadget_name": "Samsung Galaxy Book Pro",
            "user_name": "mikejohnson",
            "title": "Great Performance, Mediocre Speakers",
            "content": "Great performance for productivity tasks but the speakers could definitely be better. The AMOLED display is beautiful though.",
            "rating": 4.0,
            "pros": "Lightweight design, beautiful AMOLED display, fast performance, good battery life",
            "cons": "Average speakers, limited ports, can get warm",
        },

        # ASUS ROG Strix G16 reviews
        {
            "gadget_name": "ASUS ROG Strix G16",
            "user_name": "davidwilson",
            "title": "Gaming Powerhouse",
            "content": "Handles all modern games at high settings without breaking a sweat. The cooling system works well even during extended gaming sessions.",
            "rating": 5.0,
            "pros": "Excellent gaming performance, good cooling, high refresh rate display, RGB lighting",
            "cons": "Heavy and bulky, loud fans under load, poor battery life",
        },

        # iPad Pro 12.9\" M2 reviews
        {
            "gadget_name": "iPad Pro 12.9\" M2",
            "user_name": "emilychen",
            "title": "Perfect for Digital Art",
            "content": "The M2 chip makes this tablet incredibly powerful. The Apple Pencil integration is flawless for digital art and note-taking.",
            "rating": 5.0,
            "pros": "Incredible display, powerful M2 chip, excellent Apple Pencil support, premium build",
            "cons": "Very expensive, accessories sold separately, iPadOS limitations",
        },
        {
            "gadget_name": "iPad Pro 12.9\" M2",
            "user_name": "stephaniedavis",
            "title": "Great for Productivity",
            "content": "With the Magic Keyboard, this becomes a legitimate laptop replacement for many tasks. The display quality is unmatched.",
            "rating": 4.0,
            "pros": "Laptop-like performance, stunning display, great for creativity, long battery life",
            "cons": "Expensive with accessories, iPadOS can be limiting, no traditional file system",
        },

        # iPad Air 5th Gen reviews
        {
            "gadget_name": "iPad Air 5th Gen",
            "user_name": "kevinkim",
            "title": "Perfect for Students",
            "content": "Great balance of performance and price for students. Handles all my coursework and entertainment needs perfectly.",
            "rating": 4.0,
            "pros": "Good performance, reasonable price, Apple Pencil support, portable",
            "cons": "Base storage is limited, accessories are expensive",
        },

        # Samsung Galaxy Tab S9 Ultra reviews
        {
            "gadget_name": "Samsung Galaxy Tab S9 Ultra",
            "user_name": "alexrodriguez",
            "title": "Android Tablet Done Right",
            "content": "Finally, an Android tablet that can compete with iPads. The S Pen included is a nice touch and the display is enormous.",
            "rating": 4.0,
            "pros": "Huge beautiful display, S Pen included, good multitasking, DeX mode",
            "cons": "Android tablet apps still lacking, expensive, can be unwieldy",
        },

        # Microsoft Surface Pro 9 reviews
        {
            "gadget_name": "Microsoft Surface Pro 9",
            "user_name": "jenniferwhite",
            "title": "True 2-in-1 Experience",
            "content": "The versatility of having both tablet and laptop functionality in one device is unmatched. Perfect for presentations and mobile work.",
            "rating": 4.0,
            "pros": "True 2-in-1 functionality, full Windows experience, good performance, versatile",
            "cons": "Type cover is expensive, average battery life, can get warm",
        },

        # Additional reviews for variety
        {
            "gadget_name": "Xiaomi 14 Ultra",
            "user_name": "lisagarcia",
            "title": "Incredible Camera for the Price",
            "content": "The Leica camera system is outstanding. Great value compared to other flagship phones with similar camera quality.",
            "rating": 5.0,
            "pros": "Exceptional camera quality, premium build, competitive pricing, fast performance",
            "cons": "MIUI can be bloated, availability issues, no wireless charging",
        },

        {
            "gadget_name": "iPhone 14",
            "user_name": "sarahsmith",
            "title": "Still a Great Phone",
            "content": "Even though it's not the latest, the iPhone 14 still delivers excellent performance and camera quality for most users.",
            "rating": 4.0,
            "pros": "Reliable performance, good camera, iOS ecosystem, regular updates",
            "cons": "Starting to feel dated, expensive for the features, battery could be better",
        },

        {
            "gadget_name": "Samsung Galaxy A54",
            "user_name": "kevinkim",
            "title": "Excellent Mid-Range Option",
            "content": "Great phone for the price. Camera is surprisingly good and battery lasts all day with moderate to heavy use.",
            "rating": 4.0,
            "pros": "Good value for money, decent camera, long battery life, nice display",
            "cons": "Performance could be better, plastic build, slower charging",
        },

        {
            "gadget_name": "Nothing Phone 2",
            "user_name": "jamestaylor",
            "title": "Unique and Functional",
            "content": "The Glyph interface is not just a gimmick - it's actually quite useful. Clean Android experience is refreshing.",
            "rating": 4.0,
            "pros": "Unique design, clean software, good performance, innovative features",
            "cons": "Glyph interface battery drain, limited availability, camera could improve",
        },

        {
            "gadget_name": "ASUS ROG Phone 8",
            "user_name": "davidwilson",
            "title": "Ultimate Gaming Phone",
            "content": "If you're serious about mobile gaming, this is the phone to get. The cooling system and gaming features are unmatched.",
            "rating": 5.0,
            "pros": "Incredible gaming performance, advanced cooling, gaming accessories, high refresh rate",
            "cons": "Very expensive, heavy, overkill for casual users, bulky design",
        },

        {
            "gadget_name": "HP Spectre x360 14",
            "user_name": "stephaniedavis",
            "title": "Versatile 2-in-1",
            "content": "The 360-degree hinge is solid and the touchscreen is responsive. Great for both work and entertainment.",
            "rating": 4.0,
            "pros": "Versatile 2-in-1 design, good build quality, nice display, decent performance",
            "cons": "Average battery life, can get warm, pen is sold separately",
        },

        {
            "gadget_name": "Lenovo ThinkPad X1 Carbon",
            "user_name": "alexrodriguez",
            "title": "Business Laptop Excellence",
            "content": "The legendary ThinkPad keyboard and build quality are still unmatched. Perfect for business professionals.",
            "rating": 5.0,
            "pros": "Excellent keyboard, legendary reliability, good security features, lightweight",
            "cons": "Expensive, limited ports, display could be brighter",
        },

        {
            "gadget_name": "Microsoft Surface Laptop 5",
            "user_name": "amandabrown",
            "title": "Premium Windows Experience",
            "content": "Beautiful design with the Alcantara finish. Great for productivity work and the display is crisp and colorful.",
            "rating": 4.0,
            "pros": "Premium design, good display, solid performance, comfortable keyboard",
            "cons": "Limited ports, expensive, average battery life",
        },

        {
            "gadget_name": "Acer Swift 3 OLED",
            "user_name": "kevinkim",
            "title": "Great Value with OLED",
            "content": "Having an OLED display at this price point is incredible. Perfect for students and casual users.",
            "rating": 4.0,
            "pros": "OLED display, good value for money, decent performance, lightweight",
            "cons": "Build quality could be better, average speakers, limited ports",
        },

        {
            "gadget_name": "Lenovo Tab P12 Pro",
            "user_name": "emilychen",
            "title": "Good Android Tablet Alternative",
            "content": "The OLED display is beautiful and JBL speakers sound great. Good alternative to iPads for Android users.",
            "rating": 4.0,
            "pros": "Beautiful OLED display, good speakers, Android flexibility, reasonable price",
            "cons": "Android tablet app ecosystem, performance could be better",
        },

        {
            "gadget_name": "Amazon Fire Max 11",
            "user_name": "jenniferwhite",
            "title": "Budget Tablet Champion",
            "content": "For the price, you can't beat this tablet. Perfect for reading, streaming, and basic tasks. Great for kids too.",
            "rating": 3.0,
            "pros": "Very affordable, good battery life, decent display, Amazon ecosystem integration",
            "cons": "Limited app store, performance is basic, build quality is average",
        },

        {
            "gadget_name": "Xiaomi Pad 6",
            "user_name": "robertlee",
            "title": "Flagship Performance at Mid-Range Price",
            "content": "Impressive performance and display quality for the price. Great for gaming and multimedia consumption.",
            "rating": 4.0,
            "pros": "Great performance for price, high refresh rate display, good build quality",
            "cons": "MIUI can be confusing, limited availability, average cameras",
        },

        {
            "gadget_name": "Sony Xperia 1 V",
            "user_name": "mariagonzalez",
            "title": "Content Creator's Dream",
            "content": "The professional camera controls and 4K display make this perfect for content creation. Video recording capabilities are exceptional.",
            "rating": 4.0,
            "pros": "Professional camera controls, 4K display, excellent video recording, clean software",
            "cons": "Very expensive, niche appeal, battery life could be better",
        },

        {
            "gadget_name": "MSI Creator Z16P",
            "user_name": "danielmartinez",
            "title": "Creator Workstation",
            "content": "Perfect for content creation work. The color-accurate display and powerful RTX graphics handle everything I throw at it.",
            "rating": 5.0,
            "pros": "Excellent for content creation, powerful graphics, color-accurate display, good cooling",
            "cons": "Expensive, heavy, loud fans, poor battery life",
        },

        {
            "gadget_name": "ASUS ZenBook 14",
            "user_name": "stephaniedavis",
            "title": "Compact and Capable",
            "content": "The NumberPad 2.0 is actually quite useful. Great laptop for everyday computing needs with good portability.",
            "rating": 4.0,
            "pros": "Compact design, innovative NumberPad, good performance, affordable",
            "cons": "Display could be brighter, average speakers, limited ports",
        },

        {
            "gadget_name": "ASUS ROG Flow Z13",
            "user_name": "davidwilson",
            "title": "Gaming Tablet Innovation",
            "content": "Unique concept that actually works. Gaming performance is solid and the detachable keyboard is well-designed.",
            "rating": 4.0,
            "pros": "Unique gaming tablet design, good performance, innovative concept, portable gaming",
            "cons": "Very expensive, limited battery for gaming, niche market appeal",
        },

        {
            "gadget_name": "Huawei MatePad Pro 12.6",
            "user_name": "alexrodriguez",
            "title": "Impressive Despite Limitations",
            "content": "Great hardware and display, but the software limitations due to Google services make it challenging for some users.",
            "rating": 3.0,
            "pros": "Beautiful OLED display, good build quality, M-Pencil support, competitive pricing",
            "cons": "Limited app ecosystem, no Google services, software restrictions",
        },

        {
            "gadget_name": "OPPO Pad Air",
            "user_name": "jenniferwhite",
            "title": "Stylish Budget Option",
            "content": "Nice design and decent performance for basic tablet tasks. Good for streaming and light productivity work.",
            "rating": 3.0,
            "pros": "Attractive design, reasonable price, decent display, good for basic tasks",
            "cons": "Limited performance, average build quality, basic cameras",
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
