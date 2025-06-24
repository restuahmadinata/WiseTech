#!/usr/bin/env python3
"""
Script to seed the database with gadget and review data
"""

import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.db.seed_gadgets import seed_gadgets_and_reviews, clear_existing_data
from app.db.init_db import init_db
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """
    Main function to run the seeder
    """
    db = SessionLocal()
    try:
        # Initialize basic data (admin user, etc.)
        logger.info("Initializing basic database data...")
        init_db(db)
        
        # Ask user if they want to clear existing data
        response = input("Do you want to clear existing gadgets and reviews? (y/N): ")
        if response.lower() in ['y', 'yes']:
            clear_existing_data(db)
        
        # Seed gadgets and reviews
        logger.info("Starting gadget and review seeding...")
        seed_gadgets_and_reviews(db)
        
        logger.info("Database seeding completed successfully!")
        
    except Exception as e:
        logger.error(f"Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()
