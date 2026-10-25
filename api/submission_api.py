# api/submission.py
import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from db.session import get_db
from db.models.user import User
from schemas.submission_schemas import SubmissionCreate, SubmissionResponse
from services.submission_service import SubmissionService
from api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
def create_submission(
    submission_in: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Nộp bài làm của học viên, hệ thống tự động chấm điểm và lưu kết quả."""
    service = SubmissionService(db)
    # Tự động lấy user_id từ token đăng nhập hiện tại thay vì truyền thủ công
    return service.create_submission(user_id=current_user.id, submission_info=submission_in)

@router.get("/me", response_model=List[SubmissionResponse])
def get_my_submissions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lấy danh sách tất cả các bài nộp của người dùng đang đăng nhập."""
    service = SubmissionService(db)
    return service.get_user_submissions(user_id=current_user.id, skip=skip, limit=limit)

@router.get("/{submission_id}", response_model=SubmissionResponse)
def get_submission_by_id(
    submission_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lấy chi tiết một bài nộp cụ thể theo ID."""
    service = SubmissionService(db)
    return service.get_submission_by_id(submission_id)

@router.delete("/{submission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_submission(
    submission_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Xóa một bài nộp theo ID."""
    service = SubmissionService(db)
    service.delete_submission(submission_id)
    return None