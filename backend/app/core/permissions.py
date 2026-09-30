from fastapi import Depends, HTTPException, status

from app.core.dependencies import get_current_user_db


ROLE_PERMISSIONS = {
    "admin": {
        "view_services",
        "manage_services",
        "view_requests",
        "manage_requests",
        "view_content",
        "manage_content",
        "view_users",
    },
    "employee": {
        "view_services",
        "view_requests",
        "view_content",
    },
}


def require_permission(permission: str):
    def permission_checker(
        current_user=Depends(get_current_user_db),
    ):
        user_permissions = ROLE_PERMISSIONS.get(
            current_user.role,
            set(),
        )

        if permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action",
            )

        return current_user

    return permission_checker