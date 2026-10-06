from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.client import Client
from app.schemas.client import (
    ClientCreate,
    ClientResponse,
    ClientUpdate,
)
from app.core.dependencies import (
    get_current_user_db,
    require_admin,
)

router = APIRouter(
    prefix="/api/clients",
    tags=["Clients"],
)


# Get all clients
@router.get(
    "",
    response_model=list[ClientResponse],
)
def get_clients(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_db),
):
    return db.query(Client).order_by(Client.id.desc()).all()


# Get one client
@router.get(
    "/{client_id}",
    response_model=ClientResponse,
)
def get_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_db),
):
    client = (
        db.query(Client)
        .filter(Client.id == client_id)
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found",
        )

    return client


# Create client - Admin only
@router.post(
    "",
    response_model=ClientResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_client(
    client_data: ClientCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    client = Client(
        name=client_data.name,
        company=client_data.company,
        email=client_data.email,
        phone=client_data.phone,
        description=client_data.description,
    )

    db.add(client)
    db.commit()
    db.refresh(client)

    return client


# Update client - Admin only
@router.put(
    "/{client_id}",
    response_model=ClientResponse,
)
def update_client(
    client_id: int,
    client_data: ClientUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    client = (
        db.query(Client)
        .filter(Client.id == client_id)
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found",
        )

    update_data = client_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(client, field, value)

    db.commit()
    db.refresh(client)

    return client


# Delete client - Admin only
@router.delete(
    "/{client_id}",
)
def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    client = (
        db.query(Client)
        .filter(Client.id == client_id)
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found",
        )

    db.delete(client)
    db.commit()

    return {
        "message": "Client deleted successfully"
    }