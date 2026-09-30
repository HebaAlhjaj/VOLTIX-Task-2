from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.schemas.auth import UserResponse, UserUpdate
from app.core.dependencies import get_current_user_db
from app.core.permissions import require_permission


router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
)


# Get current user's profile
# Requires login
@router.get(
    "/me",
    response_model=UserResponse,
)
def get_my_profile(
    current_user: User = Depends(get_current_user_db),
):
    return current_user


# Update current user's profile
# Requires login
@router.put(
    "/me",
    response_model=UserResponse,
)
def update_my_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user_db),
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(
            User.email == user_data.email,
            User.id != current_user.id,
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )

    current_user.name = user_data.name
    current_user.email = user_data.email

    db.commit()
    db.refresh(current_user)

    return current_user


# Get all users
# Requires view_users permission
@router.get(
    "",
    response_model=list[UserResponse],
)
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("view_users")),
):
    return (
        db.query(User)
        .order_by(User.id.asc())
        .all()
    )