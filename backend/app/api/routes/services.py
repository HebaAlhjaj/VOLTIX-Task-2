from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.service import Service
from app.schemas.service import (
    ServiceCreate,
    ServiceUpdate,
    ServiceResponse,
)
from app.api.routes.users import get_current_admin


router = APIRouter(
    prefix="/api/services",
    tags=["Services"],
)


# ================================
# GET ALL SERVICES
# Public endpoint
# ================================
@router.get(
    "",
    response_model=list[ServiceResponse],
)
def get_services(
    db: Session = Depends(get_db),
):
    services = (
        db.query(Service)
        .filter(Service.is_active == True)
        .order_by(Service.id.asc())
        .all()
    )

    return services


# ================================
# GET SINGLE SERVICE
# Public endpoint
# ================================
@router.get(
    "/{service_id}",
    response_model=ServiceResponse,
)
def get_service(
    service_id: int,
    db: Session = Depends(get_db),
):
    service = (
        db.query(Service)
        .filter(Service.id == service_id)
        .first()
    )

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    return service


# ================================
# CREATE SERVICE
# Admin only
# ================================
@router.post(
    "",
    response_model=ServiceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_service(
    service_data: ServiceCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    new_service = Service(
        title=service_data.title,
        description=service_data.description,
        icon=service_data.icon,
        is_active=service_data.is_active,
    )

    db.add(new_service)
    db.commit()
    db.refresh(new_service)

    return new_service


# ================================
# UPDATE SERVICE
# Admin only
# ================================
@router.put(
    "/{service_id}",
    response_model=ServiceResponse,
)
def update_service(
    service_id: int,
    service_data: ServiceUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    service = (
        db.query(Service)
        .filter(Service.id == service_id)
        .first()
    )

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    service.title = service_data.title
    service.description = service_data.description
    service.icon = service_data.icon
    service.is_active = service_data.is_active

    db.commit()
    db.refresh(service)

    return service


# ================================
# DELETE SERVICE
# Admin only
# ================================
@router.delete(
    "/{service_id}",
)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    service = (
        db.query(Service)
        .filter(Service.id == service_id)
        .first()
    )

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    db.delete(service)
    db.commit()

    return {
        "message": "Service deleted successfully"
    }