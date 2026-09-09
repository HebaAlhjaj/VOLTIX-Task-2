from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.inquiry import Inquiry
from app.schemas.inquiry import InquiryCreate

router = APIRouter(
    prefix="/api/contact",
    tags=["Contact"],
)


@router.post("")
def create_inquiry(
    inquiry: InquiryCreate,
    db: Session = Depends(get_db),
):
    new_inquiry = Inquiry(
        name=inquiry.name,
        email=inquiry.email,
        subject=inquiry.subject,
        message=inquiry.message,
    )

    db.add(new_inquiry)
    db.commit()
    db.refresh(new_inquiry)

    return {
        "message": "Inquiry submitted successfully",
        "id": new_inquiry.id,
    }