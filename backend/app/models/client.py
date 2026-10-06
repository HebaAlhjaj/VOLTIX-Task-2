from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from app.database.connection import Base


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(150), nullable=False)

    company = Column(String(150), nullable=True)

    email = Column(String(150), nullable=True)

    phone = Column(String(50), nullable=True)

    description = Column(Text, nullable=True)

    created_at = Column(DateTime, server_default=func.now())