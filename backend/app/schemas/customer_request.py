from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CustomerRequestCreate(BaseModel):
    service: str
    subject: str
    description: str


class CustomerRequestStatusUpdate(BaseModel):
    status: str


class CustomerRequestResponse(BaseModel):
    id: int
    user_id: int
    service: str
    subject: str
    description: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)