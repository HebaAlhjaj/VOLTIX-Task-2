from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.content import ContentItem
from app.schemas.content import (
    ContentCreate,
    ContentResponse,
    ContentUpdate,
)
from app.core.permissions import require_permission


router = APIRouter(
    prefix="/api/content",
    tags=["Content"],
)


# GET - Get all content items
# Requires view_content permission
@router.get("/", response_model=list[ContentResponse])
def get_content_items(
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("view_content")),
):
    return (
        db.query(ContentItem)
        .order_by(ContentItem.created_at.desc())
        .all()
    )


# GET - Get one content item
# Requires view_content permission
@router.get("/{content_id}", response_model=ContentResponse)
def get_content_item(
    content_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("view_content")),
):
    item = (
        db.query(ContentItem)
        .filter(ContentItem.id == content_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content item not found",
        )

    return item


# POST - Create content item
# Requires manage_content permission
@router.post(
    "/",
    response_model=ContentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_content_item(
    content: ContentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("manage_content")),
):
    new_item = ContentItem(
        title=content.title,
        description=content.description,
        category=content.category,
        image_url=content.image_url,
        status=content.status,
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


# PUT - Update content item
# Requires manage_content permission
@router.put(
    "/{content_id}",
    response_model=ContentResponse,
)
def update_content_item(
    content_id: int,
    content: ContentUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("manage_content")),
):
    item = (
        db.query(ContentItem)
        .filter(ContentItem.id == content_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content item not found",
        )

    item.title = content.title
    item.description = content.description
    item.category = content.category
    item.image_url = content.image_url
    item.status = content.status

    db.commit()
    db.refresh(item)

    return item


# DELETE - Delete content item
# Requires manage_content permission
@router.delete("/{content_id}")
def delete_content_item(
    content_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("manage_content")),
):
    item = (
        db.query(ContentItem)
        .filter(ContentItem.id == content_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content item not found",
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Content item deleted successfully"
    }