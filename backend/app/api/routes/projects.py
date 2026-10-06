from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.dependencies import (
    get_current_user_db,
    require_admin,
)
from app.models.project import Project
from app.models.project_member import ProjectMember
from app.models.client import Client
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    PROJECT_STATUSES,
)


router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"],
)


def build_project_response(
    project: Project,
    db: Session,
):
    assignments = (
        db.query(ProjectMember)
        .filter(
            ProjectMember.project_id == project.id
        )
        .all()
    )

    members = []

    for assignment in assignments:
        user = (
            db.query(User)
            .filter(User.id == assignment.user_id)
            .first()
        )

        if user:
            members.append(
                {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    "is_admin": user.is_admin,
                }
            )

    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "status": project.status,
        "progress": project.progress,
        "client_id": project.client_id,
        "created_by": project.created_by,
        "created_at": project.created_at,
        "updated_at": project.updated_at,
        "members": members,
    }


def validate_status(project_status: str):
    if project_status not in PROJECT_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid project status. "
                "Allowed values: "
                + ", ".join(PROJECT_STATUSES)
            ),
        )


def validate_progress(progress: int):
    if progress < 0 or progress > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Progress must be between 0 and 100",
        )


def validate_members(
    member_ids: list[int],
    db: Session,
):
    if not member_ids:
        return

    users = (
        db.query(User)
        .filter(User.id.in_(member_ids))
        .all()
    )

    found_ids = {user.id for user in users}

    missing_ids = [
        user_id
        for user_id in member_ids
        if user_id not in found_ids
    ]

    if missing_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User(s) not found: {missing_ids}",
        )


# ---------------------------------------------------------
# GET ALL PROJECTS
# ---------------------------------------------------------

@router.get(
    "",
    response_model=list[ProjectResponse],
)
def get_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_db),
):
    query = db.query(Project)

    # Admin can see all projects
    if current_user.is_admin or current_user.role.lower() == "admin":
        projects = (
            query
            .order_by(Project.id.desc())
            .all()
        )

    # Team Member sees only assigned projects
    else:
        assigned_project_ids = (
            db.query(ProjectMember.project_id)
            .filter(
                ProjectMember.user_id == current_user.id
            )
            .all()
        )

        project_ids = [
            project_id
            for (project_id,) in assigned_project_ids
        ]

        if not project_ids:
            projects = []
        else:
            projects = (
                query
                .filter(Project.id.in_(project_ids))
                .order_by(Project.id.desc())
                .all()
            )

    return [
        build_project_response(project, db)
        for project in projects
    ]


# ---------------------------------------------------------
# GET ONE PROJECT
# ---------------------------------------------------------

@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_db),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    is_admin = (
        current_user.is_admin
        or current_user.role.lower() == "admin"
    )

    if not is_admin:
        assignment = (
            db.query(ProjectMember)
            .filter(
                ProjectMember.project_id == project_id,
                ProjectMember.user_id == current_user.id,
            )
            .first()
        )

        if not assignment:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this project",
            )

    return build_project_response(project, db)


# ---------------------------------------------------------
# CREATE PROJECT - ADMIN ONLY
# ---------------------------------------------------------

@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    # Validate status
    validate_status(project_data.status)

    # Validate progress
    validate_progress(project_data.progress)

    # Check client
    client = (
        db.query(Client)
        .filter(Client.id == project_data.client_id)
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found",
        )

    # Validate assigned users
    validate_members(
        project_data.member_ids,
        db,
    )

    # Create project
    project = Project(
        name=project_data.name,
        description=project_data.description,
        status=project_data.status,
        progress=project_data.progress,
        client_id=project_data.client_id,
        created_by=current_user.id,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    # Assign members
    unique_member_ids = list(
        set(project_data.member_ids)
    )

    for user_id in unique_member_ids:
        assignment = ProjectMember(
            project_id=project.id,
            user_id=user_id,
        )

        db.add(assignment)

    db.commit()
    db.refresh(project)

    return build_project_response(
        project,
        db,
    )


# ---------------------------------------------------------
# UPDATE PROJECT - ADMIN ONLY
# ---------------------------------------------------------

@router.put(
    "/{project_id}",
    response_model=ProjectResponse,
)
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    update_data = project_data.model_dump(
        exclude_unset=True,
        exclude={"member_ids"},
    )

    # Validate status
    if "status" in update_data:
        validate_status(
            update_data["status"]
        )

    # Validate progress
    if "progress" in update_data:
        validate_progress(
            update_data["progress"]
        )

    # Validate client
    if "client_id" in update_data:
        client = (
            db.query(Client)
            .filter(
                Client.id
                == update_data["client_id"]
            )
            .first()
        )

        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client not found",
            )

    # Update project fields
    for field, value in update_data.items():
        setattr(project, field, value)

    # Update members if provided
    if project_data.member_ids is not None:
        validate_members(
            project_data.member_ids,
            db,
        )

        db.query(ProjectMember).filter(
            ProjectMember.project_id == project.id
        ).delete()

        unique_member_ids = list(
            set(project_data.member_ids)
        )

        for user_id in unique_member_ids:
            assignment = ProjectMember(
                project_id=project.id,
                user_id=user_id,
            )

            db.add(assignment)

    db.commit()
    db.refresh(project)

    return build_project_response(
        project,
        db,
    )


# ---------------------------------------------------------
# DELETE PROJECT - ADMIN ONLY
# ---------------------------------------------------------

@router.delete(
    "/{project_id}",
)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    db.delete(project)
    db.commit()

    return {
        "message": "Project deleted successfully"
    }