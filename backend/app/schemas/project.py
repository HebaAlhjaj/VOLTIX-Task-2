from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


PROJECT_STATUSES = [
    "Not Started",
    "In Progress",
    "Completed",
    "On Hold",
]


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None

    status: str = "Not Started"

    progress: int = Field(
        default=0,
        ge=0,
        le=100,
    )

    client_id: int


class ProjectCreate(ProjectBase):
    member_ids: list[int] = []


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=200,
    )

    description: Optional[str] = None

    status: Optional[str] = None

    progress: Optional[int] = Field(
        default=None,
        ge=0,
        le=100,
    )

    client_id: Optional[int] = None

    member_ids: Optional[list[int]] = None


class ProjectMemberResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    is_admin: bool

    model_config = ConfigDict(
        from_attributes=True
    )


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: str
    progress: int
    client_id: int
    created_by: int

    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    members: list[ProjectMemberResponse] = []

    model_config = ConfigDict(
        from_attributes=True
    )