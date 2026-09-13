from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ContentBase(BaseModel):
    title: str
    description: str
    category: str
    image_url: str | None = None
    status: str = "published"


class ContentCreate(ContentBase):
    pass


class ContentUpdate(ContentBase):
    pass


class ContentResponse(ContentBase):
    id: int
    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)