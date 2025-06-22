"""
CRUD operations for review model.
"""

from typing import List, Optional

from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewUpdate


class CRUDReview(CRUDBase[Review, ReviewCreate, ReviewUpdate]):
    """
    CRUD operations for review model.
    """

    def get_reviews_by_gadget(
        self, db: Session, *, gadget_id: int, skip: int = 0, limit: int = 100
    ) -> List[Review]:
        """
        Get reviews by gadget ID.
        """
        return (
            db.query(Review)
            .filter(Review.gadget_id == gadget_id)
            .order_by(desc(Review.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_reviews_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Review]:
        """
        Get reviews by user ID.
        """
        return (
            db.query(Review)
            .filter(Review.user_id == user_id)
            .order_by(desc(Review.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_recent_reviews(
        self, db: Session, *, limit: int = 10
    ) -> List[Review]:
        """
        Get recent reviews with user and gadget information.
        """
        from sqlalchemy.orm import joinedload
        return (
            db.query(Review)
            .options(joinedload(Review.user), joinedload(Review.gadget))
            .order_by(desc(Review.created_at))
            .limit(limit)
            .all()
        )
        
    def create_user_review(
        self, db: Session, *, obj_in: ReviewCreate, user_id: int
    ) -> Review:
        """
        Create a review for a user.
        """
        db_obj = Review(
            user_id=user_id,
            gadget_id=obj_in.gadget_id,
            title=obj_in.title,
            content=obj_in.content,
            rating=obj_in.rating,
            pros=obj_in.pros,
            cons=obj_in.cons
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


review = CRUDReview(Review)
