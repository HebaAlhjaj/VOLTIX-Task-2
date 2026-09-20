from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ServiceBase(BaseModel):
    title: str
    description: str
    icon: str | None = None
    is_active: bool = True


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(ServiceBase):
    pass


class ServiceResponse(ServiceBase):
    id: int
    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)