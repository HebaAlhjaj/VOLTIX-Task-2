from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.core.permissions import require_permission
from app.models.user import User
from app.models.customer_request import CustomerRequest
from app.schemas.customer_request import (
    CustomerRequestCreate,
    CustomerRequestResponse,
    CustomerRequestStatusUpdate,
)


router = APIRouter(
    prefix="/api/requests",
    tags=["Customer Requests"],
)


# --------------------------------------------------
# Customer - Create Request
# --------------------------------------------------

@router.post(
    "",
    response_model=CustomerRequestResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_request(
    request_data: CustomerRequestCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user_id = int(current_user["sub"])

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    new_request = CustomerRequest(
        user_id=user.id,
        service=request_data.service,
        subject=request_data.subject,
        description=request_data.description,
        status="Pending",
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return new_request


# --------------------------------------------------
# Customer - Get My Requests
# --------------------------------------------------

@router.get(
    "/my",
    response_model=list[CustomerRequestResponse],
)
def get_my_requests(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user_id = int(current_user["sub"])

    requests = (
        db.query(CustomerRequest)
        .filter(CustomerRequest.user_id == user_id)
        .order_by(CustomerRequest.created_at.desc())
        .all()
    )

    return requests


# --------------------------------------------------
# Company/Admin - Get All Requests
# Search + Filtering
# --------------------------------------------------

@router.get(
    "",
    response_model=list[CustomerRequestResponse],
)
def get_all_requests(
    search: str | None = Query(
        default=None,
        description="Search by subject, description, or service",
    ),
    status_filter: str | None = Query(
        default=None,
        alias="status",
        description="Filter by request status",
    ),
    service: str | None = Query(
        default=None,
        description="Filter by service",
    ),
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("view_requests")),
):
    # ----------------------------------------------
    # Start query
    # ----------------------------------------------

    query = db.query(CustomerRequest)

    # ----------------------------------------------
    # Search
    # Searches:
    # - Subject
    # - Description
    # - Service
    # ----------------------------------------------

    if search and search.strip():
        search_value = f"%{search.strip()}%"

        query = query.filter(
            or_(
                CustomerRequest.subject.ilike(search_value),
                CustomerRequest.description.ilike(search_value),
                CustomerRequest.service.ilike(search_value),
            )
        )

    # ----------------------------------------------
    # Status Filter
    # ----------------------------------------------

    if status_filter and status_filter.strip():
        query = query.filter(
            CustomerRequest.status == status_filter.strip()
        )

    # ----------------------------------------------
    # Service Filter
    # ----------------------------------------------

    if service and service.strip():
        query = query.filter(
            CustomerRequest.service == service.strip()
        )

    # ----------------------------------------------
    # Order results
    # ----------------------------------------------

    requests = (
        query
        .order_by(CustomerRequest.created_at.desc())
        .all()
    )

    return requests


# --------------------------------------------------
# Company/Admin - Get Request Details
# --------------------------------------------------

@router.get(
    "/{request_id}",
    response_model=CustomerRequestResponse,
)
def get_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user_id = int(current_user["sub"])

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    request = (
        db.query(CustomerRequest)
        .filter(CustomerRequest.id == request_id)
        .first()
    )

    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found",
        )

    # Admin can see any request
    if user.is_admin:
        return request

    # Customer can only see their own request
    if request.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own requests",
        )

    return request


# --------------------------------------------------
# Company/Admin - Update Request Status
# --------------------------------------------------

@router.put(
    "/{request_id}/status",
    response_model=CustomerRequestResponse,
)
def update_request_status(
    request_id: int,
    status_data: CustomerRequestStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("manage_requests")),
):
    allowed_statuses = [
        "Pending",
        "In Progress",
        "Completed",
        "Rejected",
    ]

    if status_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request status",
        )

    request = (
        db.query(CustomerRequest)
        .filter(CustomerRequest.id == request_id)
        .first()
    )

    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found",
        )

    request.status = status_data.status

    db.commit()
    db.refresh(request)

    return request

