import uuid
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File as UploadFileType,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user_db
from app.database.connection import get_db
from app.models.file import File as FileModel
from app.schemas.file import FileResponse


router = APIRouter(
    prefix="/api/files",
    tags=["Files"],
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


ALLOWED_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".png",
    ".jpg",
    ".jpeg",
}


MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


# Upload a file
# Requires authentication
@router.post(
    "/upload",
    response_model=FileResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_file(
    file: UploadFile = UploadFileType(...),
    current_user=Depends(get_current_user_db),
    db: Session = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file was selected",
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File type is not allowed",
        )

    file_content = await file.read()

    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size must not exceed 5 MB",
        )

    stored_filename = f"{uuid.uuid4().hex}{extension}"
    file_path = UPLOAD_DIR / stored_filename

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    new_file = FileModel(
        user_id=current_user.id,
        original_filename=file.filename,
        stored_filename=stored_filename,
        file_path=str(file_path),
        content_type=file.content_type or "application/octet-stream",
        file_size=len(file_content),
    )

    db.add(new_file)
    db.commit()
    db.refresh(new_file)

    return new_file


# Get current user's files
# Requires authentication
@router.get(
    "",
    response_model=list[FileResponse],
)
def get_my_files(
    current_user=Depends(get_current_user_db),
    db: Session = Depends(get_db),
):
    files = (
        db.query(FileModel)
        .filter(FileModel.user_id == current_user.id)
        .order_by(FileModel.created_at.desc())
        .all()
    )

    return files


# Delete current user's file
# Requires authentication
@router.delete("/{file_id}")
def delete_file(
    file_id: int,
    current_user=Depends(get_current_user_db),
    db: Session = Depends(get_db),
):
    file = (
        db.query(FileModel)
        .filter(
            FileModel.id == file_id,
            FileModel.user_id == current_user.id,
        )
        .first()
    )

    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    file_path = Path(file.file_path)

    if file_path.exists():
        file_path.unlink()

    db.delete(file)
    db.commit()

    return {
        "message": "File deleted successfully"
    }