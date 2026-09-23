from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database.connection import Base


class CustomerRequest(Base):
    __tablename__ = "customer_requests"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    service = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)

    status = Column(
        String(50),
        nullable=False,
        default="Pending"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )