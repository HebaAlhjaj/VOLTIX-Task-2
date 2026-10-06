from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.dependencies import require_admin
from app.models.user import User


router = APIRouter(
    prefix="/api/team-members",
    tags=["Team Members"],
)


@router.get("")
def get_team_members(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    users = (
        db.query(User)
        .filter(
            User.is_admin == False,
            User.role != "admin",
        )
        .order_by(User.name.asc())
        .all()
    )

    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "is_admin": user.is_admin,
        }
        for user in users
    ]