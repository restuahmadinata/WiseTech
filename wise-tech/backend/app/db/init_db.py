""" Script to initialize database with sample data. """
import logging
import sys
from datetime import datetime, timedelta
from pathlib import Path
from sqlalchemy.orm import Session

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
            "email": "john.digital@example.com",
            "username": "johndigital",
            "password": "password123",
            "full_name": "Johnathan Digital",
            "bio": "Avid tech reviewer focusing on mobile innovations.",
        },
        {
            "email": "sarah.t@example.com",
            "username": "sarah_techie",
            "password": "password123",
            "full_name": "Sarah Thompson",
            "bio": "Exploring the latest in smart home tech and gadgets.",
        },
        {
            "email": "michael.g@example.com",
            "username": "mike_gadgets",
            "password": "password123",
            "full_name": "Michael G. Johnson",
            "bio": "Dedicated to testing and reviewing high-performance computing devices.",
        },
        {
            "email": "emily.r@example.com",
            "username": "emily_reviews",
            "password": "password123",
            "full_name": "Emily R. Chen",
            "bio": "Sharing insights on portable devices and productivity tools.",
        },
        {
            "email": "david.guru@example.com",
            "username": "dave_techguru",
            "password": "password123",
            "full_name": "David W. Wilson",
            "bio": "A true tech enthusiast, deep-diving into new innovations.",
        },
        {
            "email": "lisa.g@example.com",
            "username": "lisag_tech",
            "password": "password123",
            "full_name": "Elisabeth Garcia",
            "bio": "Analyst specializing in consumer electronics and user experience.",
        },
        {
            "email": "james.d@example.com",
            "username": "jamie_dev",
            "password": "password123",
            "full_name": "James P. Taylor",
            "bio": "Software developer with a keen eye for hardware integration.",
        },
        {
            "email": "amanda.b@example.com",
            "username": "amanda_biztech",
            "password": "password123",
            "full_name": "Amanda L. Brown",
            "bio": "Business strategist leveraging technology for efficiency.",
        },
        {
            "email": "robert.l@example.com",
            "username": "robert_techanalyst",
            "password": "password123",
            "full_name": "Robert S. Lee",
            "bio": "Chronicling the evolution of personal tech and its impact.",
        },
        {
            "email": "maria.c@example.com",
            "username": "mariacreates",
            "password": "password123",
            "full_name": "Maria C. Gonzalez",
            "bio": "Visual artist and digital content creator.",
        },
        {
            "email": "kevin.k@example.com",
            "username": "kevinktech",
            "password": "password123",
            "full_name": "Kevin J. Kim",
            "bio": "Exploring budget-friendly tech solutions for everyday users.",
        },
        {
            "email": "stephanie.u@example.com",
            "username": "steph_ux",
            "password": "password123",
            "full_name": "Stephanie A. Davis",
            "bio": "Focusing on the design and usability of new technologies.",
        },
        {
            "email": "alex.i@example.com",
            "username": "alex_itpro",
            "password": "password123",
            "full_name": "Alexander Rodriguez",
            "bio": "IT professional evaluating enterprise-grade gadgets.",
        },
        {
            "email": "jennifer.s@example.com",
            "username": "jen_socialtech",
            "password": "password123",
            "full_name": "Jennifer M. White",
            "bio": "Social media expert reviewing devices for connectivity and content.",
        },
        {
            "email": "daniel.e@example.com",
            "username": "dan_editspro",
            "password": "password123",
            "full_name": "Daniel M. Martinez",
            "bio": "Video and audio production specialist, reviewing media gadgets.",
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

    # Buat sample gadgets - 30 gadgets total
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

        # Mengecek apakah gadget sudah ada
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
            "user_name": "johndigital",
            "title": "Camera and Chipset: A Leap Forward!",
            "content": "The new A17 Pro chip makes this phone incredibly fast for all tasks, and the camera system captures details I've never seen before on a smartphone. Battery life is also a significant upgrade, easily lasting me a full day.",
            "rating": 5.0,
            "pros": "Revolutionary camera, unparalleled performance, premium feel, extended battery life",
            "cons": "High entry price, proprietary charging port, accessories are expensive",
        },
        {
            "gadget_name": "iPhone 15 Pro",
            "user_name": "sarah_techie",
            "title": "Beyond Photography, It's an Experience",
            "content": "Every photo I take looks professional, even in low light. The iOS ecosystem remains seamless, and the display is just stunning. It truly redefines mobile photography.",
            "rating": 4.5,
            "pros": "Exceptional photo quality, smooth user interface, robust build, vibrant display",
            "cons": "Still no true customization, feels a bit heavy",
        },
        # Samsung Galaxy S24 Ultra reviews
        {
            "gadget_name": "Samsung Galaxy S24 Ultra",
            "user_name": "dave_techguru",
            "title": "S Pen Integration is a Game Changer for Productivity",
            "content": "The S Pen is unbelievably useful for both work and casual drawing. The screen is vibrant and huge, making multitasking a breeze. The zoom camera is truly impressive!",
            "rating": 5.0,
            "pros": "Integrated S Pen, gorgeous AMOLED display, powerful zoom camera, excellent for multitasking",
            "cons": "Very large form factor, premium price tag, slightly less intuitive than iOS",
        },
        {
            "gadget_name": "Samsung Galaxy S24 Ultra",
            "user_name": "lisag_tech",
            "title": "A True Powerhouse for Creators",
            "content": "From detailed photo editing to quick sketches, this phone handles everything. The large display and S Pen make it perfect for creative professionals on the go. Battery life is decent.",
            "rating": 4.5,
            "pros": "Versatile S Pen, stunning display, robust performance, superb camera array",
            "cons": "Can feel bulky in small hands, fast charging could be faster",
        },
        # Google Pixel 8 Pro reviews
        {
            "gadget_name": "Google Pixel 8 Pro",
            "user_name": "jamie_dev",
            "title": "Smartest Camera on an Android",
            "content": "The AI features are incredibly clever, especially for photo enhancements. Stock Android is a breath of fresh air. It's not the fastest phone, but the software experience is top-notch.",
            "rating": 4.0,
            "pros": "Best-in-class computational photography, clean Android, smart AI features, timely updates",
            "cons": "Battery life is just average, performance isn't flagship-level, design is a bit bland",
        },
        {
            "gadget_name": "Google Pixel 8 Pro",
            "user_name": "robert_techanalyst",
            "title": "AI Magic for Everyday Use",
            "content": "The integration of AI into daily tasks, from call screening to photo editing, is seamless and genuinely useful. Google's software polish really shines through.",
            "rating": 4.0,
            "pros": "Innovative AI functions, superior photo processing, smooth software experience, solid privacy features",
            "cons": "Tensor chip can run warm, screen brightness could be higher outdoors",
        },
        # OnePlus 12 reviews
        {
            "gadget_name": "OnePlus 12",
            "user_name": "kevinktech",
            "title": "Speed Demon with Unbelievable Charging",
            "content": "This phone charges ridiculously fast, making battery anxiety a thing of the past. Performance is snappy for gaming and daily use, offering great value for money.",
            "rating": 4.0,
            "pros": "Blazing fast charging, fluid display, top-tier performance, sleek design",
            "cons": "Camera is good but not great, OxygenOS has lost some of its charm, no official IP rating",
        },
        # MacBook Pro 16\" M3 reviews
        {
            "gadget_name": "MacBook Pro 16\" M3",
            "user_name": "mariacreates",
            "title": "The Ultimate Creative Workstation",
            "content": "As a digital artist, this machine is a dream. The M3 chip handles massive files and complex rendering effortlessly, and the Liquid Retina XDR display is phenomenal for color accuracy.",
            "rating": 5.0,
            "pros": "Unmatched processing power, gorgeous display, long battery life, quiet operation under load",
            "cons": "Extremely expensive, limited port selection without adapters, heavy for portability",
        },
        {
            "gadget_name": "MacBook Pro 16\" M3",
            "user_name": "dan_editspro",
            "title": "Effortless Video Editing and Rendering",
            "content": "I've cut 8K footage on this without a hitch. The battery just keeps going, even with intense video exports. It's an investment, but one that truly pays off for professionals.",
            "rating": 5.0,
            "pros": "Exceptional performance for heavy tasks, superb battery, crisp audio, solid build",
            "cons": "Price is prohibitive for many, limited repairability",
        },
        # Dell XPS 13 Plus reviews
        {
            "gadget_name": "Dell XPS 13 Plus",
            "user_name": "amanda_biztech",
            "title": "Sleek Design, Powerful Performance for Professionals",
            "content": "This laptop is stunning to look at and incredibly portable. The OLED screen is fantastic for presentations, and it handles all my business applications with ease. The haptic touchpad takes some getting used to.",
            "rating": 4.5,
            "pros": "Stunning design, vibrant OLED display, excellent portability, strong performance for its size",
            "cons": "Lack of traditional function row, limited port selection (only USB-C), can get warm under load",
        },
        # Samsung Galaxy Book Pro reviews
        {
            "gadget_name": "Samsung Galaxy Book Pro",
            "user_name": "mike_gadgets",
            "title": "Featherlight with a Brilliant Display",
            "content": "The AMOLED screen is a visual treat, and the laptop is incredibly light, making it perfect for travel. Performance is solid for everyday tasks, but the speakers are definitely a weak point.",
            "rating": 4.0,
            "pros": "Extremely lightweight, beautiful AMOLED display, decent battery life, thin profile",
            "cons": "Underwhelming speakers, build feels a bit flimsy, performance bottlenecks under heavy load",
        },
        # ASUS ROG Strix G16 reviews
        {
            "gadget_name": "ASUS ROG Strix G16",
            "user_name": "dave_techguru",
            "title": "Unleash the Gaming Beast!",
            "content": "This machine devours any game I throw at it, maintaining high frame rates. The cooling system is surprisingly effective, preventing throttling even during marathon sessions.",
            "rating": 5.0,
            "pros": "Exceptional gaming performance, effective cooling, high refresh rate display, customizable RGB",
            "cons": "Very bulky and heavy, fan noise can be significant, battery life is poor when gaming",
        },
        # iPad Pro 12.9\" M2 reviews
        {
            "gadget_name": "iPad Pro 12.9\" M2",
            "user_name": "emily_reviews",
            "title": "A Canvas for Digital Creation",
            "content": "The M2 chip makes this iPad fly, and the large Liquid Retina XDR screen is perfect for my digital art. The Apple Pencil responsiveness is unmatched. It's almost a laptop replacement for me.",
            "rating": 5.0,
            "pros": "Incredible display, powerful M2 chip, flawless Apple Pencil integration, sleek design",
            "cons": "Expensive, accessories are pricey, iPadOS still has some limitations compared to desktop OS",
        },
        {
            "gadget_name": "iPad Pro 12.9\" M2",
            "user_name": "steph_ux",
            "title": "Productivity Powerhouse with Stunning Visuals",
            "content": "This iPad paired with the Magic Keyboard is a fantastic setup for design work and presentations. The display quality is simply breathtaking. It's expensive, but worth it for the performance and portability.",
            "rating": 4.5,
            "pros": "Brilliant display, robust performance, highly portable, great for professional apps",
            "cons": "Cost of entry plus accessories is high, file management can be cumbersome",
        },
        # iPad Air 5th Gen reviews
        {
            "gadget_name": "iPad Air 5th Gen",
            "user_name": "kevinktech",
            "title": "Best Value iPad for Most Users",
            "content": "The M1 chip is overkill for casual use, but it makes this iPad incredibly future-proof. It's the perfect size for reading, streaming, and light work, offering great balance between price and performance.",
            "rating": 4.0,
            "pros": "Excellent performance for the price, vibrant display, lightweight, good battery",
            "cons": "Base storage can be limiting, no Face ID, still relies on expensive accessories",
        },
        # Samsung Galaxy Tab S9 Ultra reviews
        {
            "gadget_name": "Samsung Galaxy Tab S9 Ultra",
            "user_name": "alex_itpro",
            "title": "Desktop-Class Android Tablet",
            "content": "The screen is truly massive, great for multitasking with DeX mode. The S Pen is a welcome addition. While it's powerful, Android tablet apps sometimes struggle to utilize the full screen real estate.",
            "rating": 4.0,
            "pros": "Enormous and beautiful AMOLED display, included S Pen, great for DeX multitasking, powerful performance",
            "cons": "Very large and somewhat awkward to hold, Android app optimization isn't always perfect, high price",
        },
        # Microsoft Surface Pro 9 reviews
        {
            "gadget_name": "Microsoft Surface Pro 9",
            "user_name": "jen_socialtech",
            "title": "The Ultimate Hybrid Device",
            "content": "Being able to switch between a tablet and a full Windows laptop seamlessly is incredibly convenient. Perfect for my diverse workflow, from content creation to presentations. Battery life is decent but not stellar.",
            "rating": 4.0,
            "pros": "True 2-in-1 versatility, full Windows OS, excellent build quality, responsive touchscreen",
            "cons": "Keyboard and Pen sold separately (expensive!), battery life could be longer, gets warm sometimes",
        },
        {
            "gadget_name": "Xiaomi 14 Ultra",
            "user_name": "lisag_tech",
            "title": "Leica Camera Partnership Delivers!",
            "content": "The camera on this phone is truly exceptional, rivaling dedicated cameras. Xiaomi has really stepped up their game with premium materials and flagship performance at a competitive price.",
            "rating": 5.0,
            "pros": "Stunning Leica-tuned cameras, premium design and materials, powerful performance, fast charging",
            "cons": "MIUI can be heavy with bloatware, availability outside China can be tricky",
        },
        {
            "gadget_name": "iPhone 14",
            "user_name": "sarah_techie",
            "title": "Reliable Performer for Everyday",
            "content": "Though not the newest, the iPhone 14 is still a fantastic daily driver. The camera is solid, performance is smooth, and it integrates perfectly with my other Apple devices.",
            "rating": 4.0,
            "pros": "Consistent performance, good camera for photos/videos, excellent integration with Apple ecosystem, durable build",
            "cons": "Design is getting old, battery life is just okay for heavy users, high price for older tech",
        },
        {
            "gadget_name": "Samsung Galaxy A54",
            "user_name": "kevinktech",
            "title": "Mid-Range Gem with Premium Features",
            "content": "For its price, this phone punches above its weight. The AMOLED display is vibrant, the camera takes surprisingly good shots, and the battery easily gets me through the day.",
            "rating": 4.0,
            "pros": "Great value, vibrant display, solid camera performance, excellent battery life",
            "cons": "Plastic back feels less premium, processor can be sluggish with demanding apps, bezels are a bit thick",
        },
        {
            "gadget_name": "Nothing Phone 2",
            "user_name": "jamie_dev",
            "title": "A Refreshingly Unique Android Experience",
            "content": "The Glyph interface isn't just a novelty; it adds a unique layer of interaction. The phone runs very smoothly, and the clean Android experience is a definite plus. A truly distinct device.",
            "rating": 4.0,
            "pros": "Innovative Glyph interface, clean software, good performance, eye-catching design",
            "cons": "Camera is decent but not flagship-tier, Glyph can drain battery if overused, limited market presence",
        },
        {
            "gadget_name": "ASUS ROG Phone 8",
            "user_name": "dave_techguru",
            "title": "Mobile Gaming Redefined",
            "content": "This phone is a beast for gaming. The cooling system keeps everything running at peak performance, and the display is incredibly fluid. AirTriggers are a game-changer for competitive play.",
            "rating": 5.0,
            "pros": "Unrivaled gaming performance, advanced cooling, ultra-responsive display, customizable controls",
            "cons": "Large and heavy, aggressive gaming aesthetic isn't for everyone, battery life can dip fast during intense gaming",
        },
        {
            "gadget_name": "HP Spectre x360 14",
            "user_name": "steph_ux",
            "title": "Elegance Meets Versatility",
            "content": "The convertible design is incredibly useful for both design work and presentations. The OLED touch display is absolutely gorgeous, making colors pop. A very well-rounded premium laptop.",
            "rating": 4.5,
            "pros": "Stunning OLED touchscreen, flexible 2-in-1 design, premium build materials, comfortable keyboard",
            "cons": "Battery life could be better for a premium ultrabook, trackpad sometimes overly sensitive, expensive",
        },
        {
            "gadget_name": "Lenovo ThinkPad X1 Carbon",
            "user_name": "alex_itpro",
            "title": "The Benchmark for Business Laptops",
            "content": "The ThinkPad keyboard is still the best in the business, and its legendary durability means it can handle anything I throw at it. Perfect for IT professionals needing reliability and strong security.",
            "rating": 5.0,
            "pros": "Industry-leading keyboard, exceptional build quality and durability, strong security features, lightweight",
            "cons": "Design can feel a bit dated, display could be brighter, speakers are average",
        },
        {
            "gadget_name": "Microsoft Surface Laptop 5",
            "user_name": "amanda_biztech",
            "title": "A Refined Windows Experience",
            "content": "The Alcantara finish feels luxurious, and the display is incredibly sharp. It's a fantastic laptop for productivity, offering a clean and polished Windows experience. Battery life is decent for a full workday.",
            "rating": 4.0,
            "pros": "Premium design and materials, excellent display, comfortable keyboard, seamless Windows integration",
            "cons": "Limited port selection, price is on the higher side, average battery life compared to competitors",
        },
        {
            "gadget_name": "Acer Swift 3 OLED",
            "user_name": "kevinktech",
            "title": "OLED at an Unbeatable Price",
            "content": "Getting an OLED display at this price point is a steal! The colors are incredibly vibrant, making it great for media consumption. Performance is solid for everyday tasks, making it a great value.",
            "rating": 4.0,
            "pros": "Stunning OLED display, very good value for money, lightweight and portable, decent performance",
            "cons": "Build quality feels a bit plastic-y, trackpad can be inconsistent, average battery life",
        },
        {
            "gadget_name": "Lenovo Tab P12 Pro",
            "user_name": "emily_reviews",
            "title": "Android's Premium Tablet Contender",
            "content": "The OLED screen is absolutely gorgeous for streaming movies, and the JBL speakers deliver fantastic audio. It's a strong competitor to other premium tablets, especially with its optional accessories.",
            "rating": 4.0,
            "pros": "Brilliant OLED display, excellent audio quality, good battery life, versatile for entertainment",
            "cons": "Android tablet app ecosystem still lags behind iPadOS, processor could be more powerful for the price",
        },
        {
            "gadget_name": "Amazon Fire Max 11",
            "user_name": "jen_socialtech",
            "title": "Budget-Friendly Entertainment Hub",
            "content": "For the price, this tablet is unbeatable for casual use like reading, Browse, and streaming. It's sturdy enough for kids and integrates perfectly with Amazon's services. Don't expect top-tier performance.",
            "rating": 3.5,
            "pros": "Extremely affordable, long battery life, good for media consumption, sturdy build",
            "cons": "Limited Appstore, performance can be sluggish, basic camera quality, lots of Amazon ads",
        },
        {
            "gadget_name": "Xiaomi Pad 6",
            "user_name": "robert_techanalyst",
            "title": "Unmatched Performance for the Price",
            "content": "This tablet offers flagship-level performance and a high refresh rate display at a mid-range price. It's excellent for gaming and everyday productivity, providing incredible bang for your buck.",
            "rating": 4.5,
            "pros": "Exceptional performance for its price, smooth 144Hz display, solid build quality, good battery life",
            "cons": "MIUI can be somewhat intrusive, camera is only adequate, no expandable storage",
        },
        {
            "gadget_name": "Sony Xperia 1 V",
            "user_name": "mariacreates",
            "title": "Filmmaker's Dream Phone",
            "content": "The 4K OLED display and manual camera controls are a content creator's paradise. I can shoot and edit high-quality video directly on my phone. It's a niche product, but outstanding for its purpose.",
            "rating": 4.5,
            "pros": "Pro-grade camera and video features, stunning 4K display, headphone jack, clean Android experience",
            "cons": "Very expensive, not for general users, battery life can drain quickly with 4K recording",
        },
        {
            "gadget_name": "MSI Creator Z16P",
            "user_name": "dan_editspro",
            "title": "Portable Studio Powerhouse",
            "content": "This laptop handles heavy video rendering and complex graphic design projects with ease. The color-accurate display is essential for my work, and the RTX GPU makes a huge difference. Fans can get loud under load.",
            "rating": 5.0,
            "pros": "Exceptional performance for creative tasks, highly color-accurate display, powerful GPU, good cooling",
            "cons": "Very expensive, heavy and not very portable, fan noise can be distracting, average battery life",
        },
        {
            "gadget_name": "ASUS ZenBook 14",
            "user_name": "steph_ux",
            "title": "Compact, Stylish, and Surprisingly Capable",
            "content": "The ZenBook 14 is a beautiful and highly portable laptop. The NumberPad is a neat feature that actually comes in handy, and it performs well for everyday tasks. Great for students and light professionals.",
            "rating": 4.0,
            "pros": "Sleek and portable design, innovative NumberPad, good keyboard, decent performance for its class",
            "cons": "Display could be brighter, speakers are average, battery life is decent but not class-leading",
        },
        {
            "gadget_name": "ASUS ROG Flow Z13",
            "user_name": "johndigital",
            "title": "The Tablet That Games!",
            "content": "This is a truly innovative device. The concept of a gaming tablet works surprisingly well, and it can handle modern titles thanks to the powerful internals. It's a niche product, but a very cool one.",
            "rating": 4.0,
            "pros": "Unique gaming tablet concept, surprisingly good performance for its size, very portable, good display",
            "cons": "Expensive, battery life is limited when gaming, design might be too 'gamer' for some",
        },
        {
            "gadget_name": "Huawei MatePad Pro 12.6",
            "user_name": "alex_itpro",
            "title": "Impressive Hardware, Software Holds It Back",
            "content": "The OLED display is stunning, and the hardware is truly premium. However, the lack of Google Mobile Services is a significant hurdle for Western users. HarmonyOS is capable, but the app gap is real.",
            "rating": 3.0,
            "pros": "Gorgeous OLED display, premium build quality, M-Pencil support, good performance",
            "cons": "No Google services (major drawback), app ecosystem is limited, HarmonyOS still developing",
        },
        {
            "gadget_name": "OPPO Pad Air",
            "user_name": "jen_socialtech",
            "title": "Stylish and Affordable for Casual Use",
            "content": "This tablet looks great and is super lightweight, making it easy to carry around. It's perfect for media consumption and light Browse. Don't expect blazing performance for heavy tasks, but it's great value.",
            "rating": 3.5,
            "pros": "Attractive design, very lightweight, decent display for the price, good for media",
            "cons": "Performance is average, cameras are basic, not ideal for demanding applications",
        },
    ]

    for review_data in sample_reviews:
        gadget_name = review_data.pop("gadget_name")
        user_name = review_data.pop("user_name")

        gadget = None
        for g in created_gadgets:
            if g.name == gadget_name:
                gadget = g
                break

        if not gadget:
            continue

        user = crud.user.get_by_username(db, username=user_name)
        if not user:
            continue

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

    # Buat tabel database
    Base.metadata.create_all(bind=engine)

    # Buat session
    db = SessionLocal()

    # Inisialisasi database dengan data awal
    init_db(db)

    logger.info("Initial data created")


if __name__ == "__main__":
    main()