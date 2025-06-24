"""
Seeder untuk menambahkan data gadget dan review sample
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app import crud, schemas
from app.models.user import User
from app.models.gadget import Gadget
from app.models.review import Review
import random
import logging

logger = logging.getLogger(__name__)

def seed_gadgets_and_reviews(db: Session) -> None:
    """
    Seed database with 30 gadgets and sample reviews
    """
    
    # Sample gadgets data - 30 items
    sample_gadgets = [
        # Smartphones (12 items)
        {
            "name": "iPhone 15 Pro Max",
            "brand": "Apple",
            "category": "Smartphones",
            "description": "The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system with 5x telephoto zoom.",
            "price": 1199.0,
            "release_date": datetime.now() - timedelta(days=90),
            "image_url": "https://www.apple.com/newsroom/images/2023/09/apple-offers-more-ways-to-order-the-new-lineups/article/Apple-iPhone-15-Pro-lineup-natural-titanium_inline.jpg.large.jpg",
            "specs": [
                {"name": "Display", "value": "6.7\" Super Retina XDR"},
                {"name": "Processor", "value": "A17 Pro chip"},
                {"name": "RAM", "value": "8GB"},
                {"name": "Storage", "value": "256GB/512GB/1TB"},
                {"name": "Camera", "value": "Triple 48MP system with 5x zoom"},
                {"name": "Battery", "value": "4,441 mAh"},
            ],
        },
        {
            "name": "Samsung Galaxy S24 Ultra",
            "brand": "Samsung",
            "category": "Smartphones",
            "description": "Premium Android flagship with built-in S Pen, 200MP camera, and AI-powered features for ultimate productivity.",
            "price": 1299.0,
            "release_date": datetime.now() - timedelta(days=60),
            "image_url": "https://cdn.movertix.com/media/catalog/product/s/a/samsung-galaxy-s24-ultra-5g-titanium-grey-256gb-and-12gb-ram-sm-s928b.jpg",
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
            "description": "AI-first smartphone with Magic Eraser, Best Take, and pure Android experience. Perfect for photography enthusiasts.",
            "price": 999.0,
            "release_date": datetime.now() - timedelta(days=120),
            "image_url": "https://m.media-amazon.com/images/I/713eEl39eLL._AC_SL1500_.jpg",
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
            "description": "Flagship performance with 100W fast charging, Hasselblad cameras, and OxygenOS for smooth user experience.",
            "price": 799.0,
            "release_date": datetime.now() - timedelta(days=80),
            "image_url": "https://static1.pocketlintimages.com/wordpress/wp-content/uploads/2024/01/oneplus-12-square.jpg",
            "specs": [
                {"name": "Display", "value": "6.82\" LTPO AMOLED"},
                {"name": "Processor", "value": "Snapdragon 8 Gen 3"},
                {"name": "RAM", "value": "12GB/16GB"},
                {"name": "Storage", "value": "256GB/512GB"},
                {"name": "Camera", "value": "Triple 50MP Hasselblad system"},
                {"name": "Battery", "value": "5,400 mAh"},
            ],
        },
        {
            "name": "Xiaomi 14 Ultra",
            "brand": "Xiaomi",
            "category": "Smartphones",
            "description": "Photography flagship with Leica quad-camera system, premium design, and flagship performance at competitive price.",
            "price": 1099.0,
            "release_date": datetime.now() - timedelta(days=100),
            "image_url": "https://spectronic.com.au/wp-content/uploads/2024/03/Xiaomi-14-Ultra-Global-Version-Black-600x600.png",
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
            "name": "iPhone 14 Pro",
            "brand": "Apple",
            "category": "Smartphones",
            "description": "Previous generation Pro iPhone with Dynamic Island, A16 Bionic chip, and Pro camera system.",
            "price": 899.0,
            "release_date": datetime.now() - timedelta(days=400),
            "image_url": "https://cdn.dxomark.com/wp-content/uploads/medias/post-125428/Apple-iPhone-14-Pro-Max_FINAL_featured-image-packshot-review-1.jpg",
            "specs": [
                {"name": "Display", "value": "6.1\" Super Retina XDR"},
                {"name": "Processor", "value": "A16 Bionic chip"},
                {"name": "RAM", "value": "6GB"},
                {"name": "Storage", "value": "128GB/256GB/512GB/1TB"},
                {"name": "Camera", "value": "Triple 48MP system"},
                {"name": "Battery", "value": "3,200 mAh"},
            ],
        },
        {
            "name": "Samsung Galaxy A54",
            "brand": "Samsung",
            "category": "Smartphones",
            "description": "Mid-range smartphone with premium features, great camera, and excellent battery life at affordable price.",
            "price": 449.0,
            "release_date": datetime.now() - timedelta(days=200),
            "image_url": "https://m.media-amazon.com/images/I/71d36o5kqEL._SL1500_.jpg",
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
            "description": "Unique transparent design with Glyph interface, clean Android experience, and innovative lighting system.",
            "price": 599.0,
            "release_date": datetime.now() - timedelta(days=180),
            "image_url": "https://www.lowyat.net/wp-content/uploads/2023/07/Nothing-Phone-2-now-official-3.jpg",
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
            "description": "Ultimate gaming smartphone with advanced cooling, 165Hz display, and gaming-specific accessories.",
            "price": 1199.0,
            "release_date": datetime.now() - timedelta(days=50),
            "image_url": "https://cdn-files.kimovil.com/default/0009/71/thumb_870499_default_big.jpg",
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
            "name": "Sony Xperia 1 VI",
            "brand": "Sony",
            "category": "Smartphones",
            "description": "Professional photography smartphone with 4K display, Alpha camera technology, and content creation focus.",
            "price": 1399.0,
            "release_date": datetime.now() - timedelta(days=160),
            "image_url": "https://store.sony.com.tw/resource/file/product_files/XQ-EC72-R2/10.jpg",
            "specs": [
                {"name": "Display", "value": "6.5\" 4K OLED"},
                {"name": "Processor", "value": "Snapdragon 8 Gen 3"},
                {"name": "RAM", "value": "12GB"},
                {"name": "Storage", "value": "256GB/512GB"},
                {"name": "Camera", "value": "Triple 48MP Alpha system"},
                {"name": "Battery", "value": "5,000 mAh"},
            ],
        },
        {
            "name": "Motorola Edge 50 Pro",
            "brand": "Motorola",
            "category": "Smartphones",
            "description": "Premium mid-range smartphone with curved display, fast charging, and near-stock Android experience.",
            "price": 699.0,
            "release_date": datetime.now() - timedelta(days=140),
            "image_url": "https://dakauf.eu/wp-content/uploads/2024/05/Motorola-Edge-50-Pro-Black-hd.png",
            "specs": [
                {"name": "Display", "value": "6.7\" pOLED Curved"},
                {"name": "Processor", "value": "Snapdragon 7 Gen 3"},
                {"name": "RAM", "value": "12GB"},
                {"name": "Storage", "value": "256GB/512GB"},
                {"name": "Camera", "value": "Triple 50MP system"},
                {"name": "Battery", "value": "4,500 mAh"},
            ],
        },
        {
            "name": "Oppo Find X7 Ultra",
            "brand": "Oppo",
            "category": "Smartphones",
            "description": "Camera-focused flagship with Hasselblad partnership, periscope zoom, and premium build quality.",
            "price": 1199.0,
            "release_date": datetime.now() - timedelta(days=110),
            "image_url": "https://cdn.dxomark.com/wp-content/uploads/medias/post-168145/Oppo-Find-X7-Ultra_featured-image-packshot-review.jpg",
            "specs": [
                {"name": "Display", "value": "6.82\" LTPO AMOLED"},
                {"name": "Processor", "value": "Snapdragon 8 Gen 3"},
                {"name": "RAM", "value": "16GB"},
                {"name": "Storage", "value": "512GB"},
                {"name": "Camera", "value": "Quad 50MP Hasselblad system"},
                {"name": "Battery", "value": "5,400 mAh"},
            ],
        },
        
        # Laptops (10 items)
        {
            "name": "MacBook Pro 16\" M3 Max",
            "brand": "Apple",
            "category": "Laptops",
            "description": "Most powerful MacBook with M3 Max chip, 16-inch Liquid Retina XDR display, and professional-grade performance.",
            "price": 3999.0,
            "release_date": datetime.now() - timedelta(days=70),
            "image_url": "https://inbox.ph/wp-content/uploads/2023/12/MacBook-Air-Pro-16-space-black.jpg",
            "specs": [
                {"name": "Display", "value": "16.2\" Liquid Retina XDR"},
                {"name": "Processor", "value": "Apple M3 Max"},
                {"name": "RAM", "value": "36GB/128GB"},
                {"name": "Storage", "value": "1TB/2TB/4TB/8TB SSD"},
                {"name": "Graphics", "value": "40-core GPU"},
                {"name": "Battery", "value": "100Wh"},
            ],
        },
        {
            "name": "Dell XPS 15 OLED",
            "brand": "Dell",
            "category": "Laptops",
            "description": "Premium 15-inch laptop with OLED display, powerful performance, and sleek design for creative professionals.",
            "price": 2299.0,
            "release_date": datetime.now() - timedelta(days=150),
            "image_url": "https://www.softcom.co.id/wp-content/uploads/2023/04/xp1.jpg",
            "specs": [
                {"name": "Display", "value": "15.6\" OLED 4K Touch"},
                {"name": "Processor", "value": "Intel Core i7-13700H"},
                {"name": "RAM", "value": "32GB DDR5"},
                {"name": "Storage", "value": "1TB SSD"},
                {"name": "Graphics", "value": "RTX 4060 8GB"},
                {"name": "Battery", "value": "86Wh"},
            ],
        },
        {
            "name": "ASUS ROG Strix Scar 18",
            "brand": "ASUS",
            "category": "Laptops",
            "description": "Ultimate gaming laptop with 18-inch display, RTX 4090, and advanced cooling for maximum performance.",
            "price": 4299.0,
            "release_date": datetime.now() - timedelta(days=90),
            "image_url": "https://cdn.mos.cms.futurecdn.net/AEYvg9hJbdXFmWL4XKPiHk.jpg",
            "specs": [
                {"name": "Display", "value": "18\" QHD+ 240Hz"},
                {"name": "Processor", "value": "Intel Core i9-13980HX"},
                {"name": "RAM", "value": "32GB DDR5"},
                {"name": "Storage", "value": "2TB SSD"},
                {"name": "Graphics", "value": "RTX 4090 16GB"},
                {"name": "Battery", "value": "90Wh"},
            ],
        },
        {
            "name": "Lenovo ThinkPad X1 Carbon Gen 11",
            "brand": "Lenovo",
            "category": "Laptops",
            "description": "Business ultrabook with legendary ThinkPad reliability, excellent keyboard, and military-grade durability.",
            "price": 1899.0,
            "release_date": datetime.now() - timedelta(days=130),
            "image_url": "https://www.tuexperto.com/wp-content/uploads/2022/12/lenovo-thinkpad-x1-carbon-gen-11-un-portatil-potente-resistente-y-con-pantalla-oled-1.jpg",
            "specs": [
                {"name": "Display", "value": "14\" WUXGA IPS"},
                {"name": "Processor", "value": "Intel Core i7-1355U"},
                {"name": "RAM", "value": "32GB"},
                {"name": "Storage", "value": "1TB SSD"},
                {"name": "Graphics", "value": "Intel Iris Xe"},
                {"name": "Battery", "value": "57Wh"},
            ],
        },
        {
            "name": "HP Spectre x360 16",
            "brand": "HP",
            "category": "Laptops",
            "description": "Convertible 2-in-1 laptop with 16-inch OLED display, premium design, and versatile functionality.",
            "price": 1999.0,
            "release_date": datetime.now() - timedelta(days=110),
            "image_url": "https://www.techspot.com/images/products/2022/laptops/org/2022-02-15-product-5.jpg",
            "specs": [
                {"name": "Display", "value": "16\" OLED 4K Touch"},
                {"name": "Processor", "value": "Intel Core i7-13700H"},
                {"name": "RAM", "value": "32GB"},
                {"name": "Storage", "value": "1TB SSD"},
                {"name": "Graphics", "value": "Intel Arc A370M"},
                {"name": "Battery", "value": "83Wh"},
            ],
        },
        {
            "name": "Microsoft Surface Laptop Studio 2",
            "brand": "Microsoft",
            "category": "Laptops",
            "description": "Innovative laptop with unique hinge design, touch screen, and Surface Pen support for creative work.",
            "price": 2399.0,
            "release_date": datetime.now() - timedelta(days=200),
            "image_url": "https://static1.pocketlintimages.com/wordpress/wp-content/uploads/2024/01/microsoft-surface-laptop-studio-2.jpg",
            "specs": [
                {"name": "Display", "value": "14.4\" PixelSense Flow Touch"},
                {"name": "Processor", "value": "Intel Core i7-13700H"},
                {"name": "RAM", "value": "32GB"},
                {"name": "Storage", "value": "1TB SSD"},
                {"name": "Graphics", "value": "RTX 4060 8GB"},
                {"name": "Battery", "value": "58Wh"},
            ],
        },
        {
            "name": "Acer Predator Helios 16",
            "brand": "Acer",
            "category": "Laptops",
            "description": "Gaming laptop with mini-LED display, powerful RTX graphics, and advanced cooling for intense gaming.",
            "price": 2799.0,
            "release_date": datetime.now() - timedelta(days=180),
            "image_url": "https://m.media-amazon.com/images/I/71gqlzTfZzL.jpg",
            "specs": [
                {"name": "Display", "value": "16\" Mini-LED QHD 165Hz"},
                {"name": "Processor", "value": "Intel Core i7-13700HX"},
                {"name": "RAM", "value": "32GB DDR5"},
                {"name": "Storage", "value": "1TB SSD"},
                {"name": "Graphics", "value": "RTX 4070 12GB"},
                {"name": "Battery", "value": "90Wh"},
            ],
        },
        {
            "name": "Razer Blade 16",
            "brand": "Razer",
            "category": "Laptops",
            "description": "Premium gaming laptop with dual-mode display, sleek design, and top-tier performance for gaming and work.",
            "price": 3299.0,
            "release_date": datetime.now() - timedelta(days=140),
            "image_url": "https://www.techspot.com/images/products/2023/laptops/org/2023-02-09-product.jpg",
            "specs": [
                {"name": "Display", "value": "16\" Dual-Mode QHD+/FHD+ 240Hz"},
                {"name": "Processor", "value": "Intel Core i9-13950HX"},
                {"name": "RAM", "value": "32GB DDR5"},
                {"name": "Storage", "value": "1TB SSD"},
                {"name": "Graphics", "value": "RTX 4080 12GB"},
                {"name": "Battery", "value": "95.2Wh"},
            ],
        },
        {
            "name": "LG Gram 17",
            "brand": "LG",
            "category": "Laptops",
            "description": "Ultra-lightweight 17-inch laptop with incredible portability, long battery life, and large display.",
            "price": 1599.0,
            "release_date": datetime.now() - timedelta(days=160),
            "image_url": "https://www.lg.com/us/images/laptops/md07500001/gallery/zoom-01.jpg",
            "specs": [
                {"name": "Display", "value": "17\" WQXGA IPS"},
                {"name": "Processor", "value": "Intel Core i7-1360P"},
                {"name": "RAM", "value": "32GB"},
                {"name": "Storage", "value": "1TB SSD"},
                {"name": "Graphics", "value": "Intel Iris Xe"},
                {"name": "Battery", "value": "80Wh"},
            ],
        },
        {
            "name": "Framework Laptop 16",
            "brand": "Framework",
            "category": "Laptops",
            "description": "Modular laptop with upgradeable and repairable components, sustainable design, and customizable ports.",
            "price": 1999.0,
            "release_date": datetime.now() - timedelta(days=120),
            "image_url": "https://cms.dailysocial.id/wp-content/uploads/2021/02/5f7b856dd262ada3ff51ea4353cdf864_Framework-8.jpg",
            "specs": [
                {"name": "Display", "value": "16\" QHD+ IPS"},
                {"name": "Processor", "value": "AMD Ryzen 7 7840HS"},
                {"name": "RAM", "value": "32GB DDR5"},
                {"name": "Storage", "value": "1TB SSD"},
                {"name": "Graphics", "value": "Radeon 780M / RTX 7700S"},
                {"name": "Battery", "value": "85Wh"},
            ],
        },
        
        # Tablets (8 items)
        {
            "name": "iPad Pro 12.9\" M2 2TB",
            "brand": "Apple",
            "category": "Tablets",
            "description": "Ultimate iPad with M2 chip, Liquid Retina XDR display, and professional performance for creative work.",
            "price": 1899.0,
            "release_date": datetime.now() - timedelta(days=180),
            "image_url": "https://product.hstatic.net/200000571041/product/upload_bcbf72a0d6964a08bbe43ae874ae7ce2.jpg",
            "specs": [
                {"name": "Display", "value": "12.9\" Liquid Retina XDR"},
                {"name": "Processor", "value": "Apple M2"},
                {"name": "RAM", "value": "16GB"},
                {"name": "Storage", "value": "2TB"},
                {"name": "Camera", "value": "12MP + LiDAR"},
                {"name": "Battery", "value": "40.88Wh"},
            ],
        },
        {
            "name": "Samsung Galaxy Tab S9 Ultra",
            "brand": "Samsung",
            "category": "Tablets",
            "description": "Massive 14.6-inch Android tablet with S Pen, flagship performance, and desktop-class productivity features.",
            "price": 1399.0,
            "release_date": datetime.now() - timedelta(days=100),
            "image_url": "https://cdn.comparez-malin.fr/img/samsung/2023/34581/samsung-galaxy-tab-s9-ultra-creme-1.jpg",
            "specs": [
                {"name": "Display", "value": "14.6\" Dynamic AMOLED 2X"},
                {"name": "Processor", "value": "Snapdragon 8 Gen 2"},
                {"name": "RAM", "value": "16GB"},
                {"name": "Storage", "value": "512GB/1TB"},
                {"name": "Camera", "value": "Dual 13MP + 6MP"},
                {"name": "Battery", "value": "11,200 mAh"},
            ],
        },
        {
            "name": "Microsoft Surface Pro 9 5G",
            "brand": "Microsoft",
            "category": "Tablets",
            "description": "2-in-1 tablet with 5G connectivity, laptop-grade performance, and full Windows experience.",
            "price": 1299.0,
            "release_date": datetime.now() - timedelta(days=220),
            "image_url": "https://www.pcguide.com/wp-content/uploads/2022/10/Surface-Pro-9.jpg",
            "specs": [
                {"name": "Display", "value": "13\" PixelSense Flow"},
                {"name": "Processor", "value": "Microsoft SQ3"},
                {"name": "RAM", "value": "16GB"},
                {"name": "Storage", "value": "512GB SSD"},
                {"name": "Camera", "value": "10MP rear, 5MP front"},
                {"name": "Battery", "value": "47.36Wh"},
            ],
        },
        {
            "name": "iPad Air 5th Gen 256GB",
            "brand": "Apple",
            "category": "Tablets",
            "description": "Versatile iPad with M1 chip, 10.9-inch Liquid Retina display, and excellent value for productivity and creativity.",
            "price": 749.0,
            "release_date": datetime.now() - timedelta(days=150),
            "image_url": "https://m.media-amazon.com/images/I/61k05QwLuML.jpg",
            "specs": [
                {"name": "Display", "value": "10.9\" Liquid Retina"},
                {"name": "Processor", "value": "Apple M1"},
                {"name": "RAM", "value": "8GB"},
                {"name": "Storage", "value": "256GB"},
                {"name": "Camera", "value": "12MP Wide + 12MP Ultra Wide"},
                {"name": "Battery", "value": "28.6Wh"},
            ],
        },
        {
            "name": "Lenovo Tab P12 Pro",
            "brand": "Lenovo",
            "category": "Tablets",
            "description": "Premium Android tablet with 12.6-inch OLED display, JBL speakers, and optional productivity pack.",
            "price": 799.0,
            "release_date": datetime.now() - timedelta(days=160),
            "image_url": "https://techstoriesindia.in/wp-content/uploads/2022/06/Lenovo-Tab-P12-Pro-AMOLED-1024x1024.jpg",
            "specs": [
                {"name": "Display", "value": "12.6\" OLED 2.5K"},
                {"name": "Processor", "value": "MediaTek Dimensity 7050"},
                {"name": "RAM", "value": "12GB"},
                {"name": "Storage", "value": "256GB"},
                {"name": "Camera", "value": "13MP + 5MP + ToF"},
                {"name": "Battery", "value": "10,200 mAh"},
            ],
        },
        {
            "name": "Xiaomi Pad 6 Pro",
            "brand": "Xiaomi",
            "category": "Tablets",
            "description": "High-performance Android tablet with 144Hz display, flagship chipset, and competitive pricing.",
            "price": 499.0,
            "release_date": datetime.now() - timedelta(days=120),
            "image_url": "https://www.iphone-droid.net/spec/wp-content/uploads/2023/04/Xiaomi-Pad-6-Pro-Black.jpg",
            "specs": [
                {"name": "Display", "value": "11\" IPS 144Hz 2.8K"},
                {"name": "Processor", "value": "Snapdragon 8+ Gen 1"},
                {"name": "RAM", "value": "12GB"},
                {"name": "Storage", "value": "256GB/512GB"},
                {"name": "Camera", "value": "50MP rear, 32MP front"},
                {"name": "Battery", "value": "8,600 mAh"},
            ],
        },
        {
            "name": "Huawei MatePad 11.5",
            "brand": "Huawei",
            "category": "Tablets",
            "description": "Elegant tablet with HarmonyOS, excellent display, and M-Pencil support for note-taking and drawing.",
            "price": 399.0,
            "release_date": datetime.now() - timedelta(days=170),
            "image_url": "https://mxmemoxpress.com/wp-content/uploads/2023/09/Matepad-11.5inch-1-product-image.png",
            "specs": [
                {"name": "Display", "value": "11.5\" IPS 2.2K"},
                {"name": "Processor", "value": "Snapdragon 7 Gen 1"},
                {"name": "RAM", "value": "8GB"},
                {"name": "Storage", "value": "128GB/256GB"},
                {"name": "Camera", "value": "13MP rear, 8MP front"},
                {"name": "Battery", "value": "7,700 mAh"},
            ],
        },
        {
            "name": "Amazon Fire Max 11 2024",
            "brand": "Amazon",
            "category": "Tablets",
            "description": "Budget-friendly tablet with large 11-inch display, Alexa integration, and excellent battery life for entertainment.",
            "price": 279.0,
            "release_date": datetime.now() - timedelta(days=140),
            "image_url": "https://pcbuildcomparison.com/wp-content/uploads/2023/05/Amazon-Fire-Max-11-Review-1.jpg",
            "specs": [
                {"name": "Display", "value": "11\" IPS 2K"},
                {"name": "Processor", "value": "MediaTek MT8188J"},
                {"name": "RAM", "value": "4GB"},
                {"name": "Storage", "value": "64GB/128GB"},
                {"name": "Camera", "value": "8MP rear, 8MP front"},
                {"name": "Battery", "value": "14+ hours"},
            ],
        },
    ]
    
    logger.info(f"Starting to seed {len(sample_gadgets)} gadgets...")
    
    # Create gadgets
    created_gadgets = []
    for gadget_data in sample_gadgets:
        # Check if gadget already exists
        existing_gadget = db.query(Gadget).filter(Gadget.name == gadget_data["name"]).first()
        if existing_gadget:
            logger.info(f"Gadget '{gadget_data['name']}' already exists, skipping...")
            created_gadgets.append(existing_gadget)
            continue
            
        # Extract specs from gadget_data
        specs = gadget_data.pop("specs", [])
        
        # Create gadget
        gadget_in = schemas.GadgetCreate(**gadget_data)
        gadget = crud.gadget.create_with_specs(db, gadget_in=gadget_in, specs=specs)
        created_gadgets.append(gadget)
        logger.info(f"Created gadget: {gadget.name}")
    
    logger.info(f"Created {len(created_gadgets)} gadgets")
    
    # Get all users for creating reviews
    users = db.query(User).filter(User.is_admin == False).all()
    if not users:
        logger.warning("No regular users found, skipping review creation")
        return
    
    logger.info(f"Found {len(users)} users for creating reviews")
      # Sample review content templates
    review_templates = {
        "positive": [
            "Excellent performance and build quality. Highly recommended!",
            "Amazing device with outstanding features. Worth every penny!",
            "Incredible performance, sleek design, and great value for money.",
            "Outstanding product with excellent camera quality and smooth performance.",
            "Fantastic device! Exceeds expectations in every way.",
            "Superb build quality and amazing performance. Love it!",
            "Best purchase I've made this year. Highly recommend!",
            "Exceptional device with premium features at great price.",
            "Absolutely love this device. Perfect for my needs!",
            "Outstanding performance and beautiful design. 5 stars!"
        ],
        "neutral": [
            "Good device overall, but has some minor issues.",
            "Decent performance for the price point. Could be better.",
            "Solid device with good features. Nothing exceptional.",
            "Average performance, meets basic expectations.",
            "Good value for money, but not outstanding.",
            "Decent build quality, performance is okay.",
            "Satisfactory device with some room for improvement.",
            "Good device overall, some features could be better.",
            "Acceptable performance, but competition is strong.",
            "Fair device for the price, has pros and cons."
        ],
        "negative": [
            "Disappointing performance, not worth the price.",
            "Poor build quality and frequent issues.",
            "Below expectations, many problems since day one.",
            "Overpriced for what it offers. Not recommended.",
            "Quality issues and poor customer service.",
            "Many bugs and performance problems.",
            "Not as advertised, several features don't work properly.",
            "Poor value for money, better alternatives available.",
            "Frequent crashes and poor battery life.",
            "Disappointed with overall experience and quality."
        ]
    }
    
    pros_templates = [
        "Great battery life", "Excellent camera quality", "Fast performance", 
        "Beautiful design", "Good value for money", "Smooth user interface",
        "Premium build quality", "Fast charging", "Great display quality",
        "Excellent audio quality", "Lightweight design", "Good connectivity options"
    ]
    
    cons_templates = [
        "Expensive price", "Average battery life", "Limited storage options",
        "No headphone jack", "Heavy weight", "Slow charging speed",
        "Poor low-light camera", "Limited software updates", "Fragile build",
        "Poor speaker quality", "Limited color options", "No wireless charging"
    ]
    
    # Create reviews for each gadget
    review_count = 0
    for gadget in created_gadgets:
        # Create 3-8 reviews per gadget
        num_reviews = random.randint(3, 8)
        
        for _ in range(num_reviews):
            # Select random user
            user = random.choice(users)
            
            # Check if user already reviewed this gadget
            existing_review = db.query(Review).filter(
                Review.user_id == user.id,
                Review.gadget_id == gadget.id
            ).first()
            
            if existing_review:
                continue
            
            # Generate random rating (bias towards higher ratings)
            rating = random.choices([1, 2, 3, 4, 5], weights=[5, 10, 15, 35, 35])[0]
            
            # Select review content based on rating
            if rating >= 4:
                content = random.choice(review_templates["positive"])
            elif rating == 3:
                content = random.choice(review_templates["neutral"])
            else:
                content = random.choice(review_templates["negative"])
            
            # Generate title
            title = f"Review of {gadget.name}"
            
            # Add pros and cons (randomly)
            pros = random.choice(pros_templates) if random.random() > 0.4 else None
            cons = random.choice(cons_templates) if random.random() > 0.6 else None
              # Create review
            review_data = {
                "gadget_id": gadget.id,
                "title": title,
                "content": content,
                "rating": rating,
                "pros": pros,
                "cons": cons
            }
            
            try:
                review_in = schemas.ReviewCreate(**review_data)
                review = crud.review.create_user_review(db, obj_in=review_in, user_id=user.id)
                review_count += 1
                
                # Random created_at (within last 6 months)
                days_ago = random.randint(1, 180)
                review.created_at = datetime.now() - timedelta(days=days_ago)
                db.commit()
                
            except Exception as e:
                logger.error(f"Error creating review: {e}")
                db.rollback()
                continue
                db.rollback()
                continue
    
    logger.info(f"Created {review_count} reviews")
    logger.info("Gadget and review seeding completed successfully!")


def clear_existing_data(db: Session) -> None:
    """
    Clear existing gadgets and reviews
    """
    logger.info("Clearing existing gadgets and reviews...")
    
    # Delete reviews first (foreign key constraint)
    db.query(Review).delete()
    
    # Delete gadgets
    db.query(Gadget).delete()
    
    db.commit()
    logger.info("Existing data cleared successfully!")
