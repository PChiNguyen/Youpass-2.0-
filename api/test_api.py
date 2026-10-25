# api/test.py
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from db.session import get_db
from db.models.user import User
from db.models.test import SkillType
from schemas.test_schemas import TestCreate, TestUpdate, TestResponse
from services.test_service import TestService
from api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=TestResponse, status_code=status.HTTP_201_CREATED)
def create_test(
    test_in: TestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Tạo mới một bài kiểm tra IELTS."""
    service = TestService(db)
    return service.create_test(test_in)

@router.get("/", response_model=List[TestResponse])
def get_all_tests(
    skill_type: Optional[SkillType] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Lấy danh sách tất cả các bài kiểm tra, có thể lọc theo kỹ năng (Reading, Listening...)."""
    service = TestService(db)
    return service.get_all_tests(skill_type=skill_type, skip=skip, limit=limit)

@router.get("/{test_id}", response_model=TestResponse)
def get_test_by_id(
    test_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """Lấy chi tiết một bài kiểm tra dựa vào ID."""
    service = TestService(db)
    return service.get_test_by_id(test_id)

@router.patch("/{test_id}", response_model=TestResponse)
def update_test(
    test_id: uuid.UUID,
    test_in: TestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cập nhật thông tin bài kiểm tra."""
    service = TestService(db)
    return service.update_test(test_id, test_in)

@router.delete("/{test_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_test(
    test_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Xóa một bài kiểm tra theo ID."""
    service = TestService(db)
    service.delete_test(test_id)
    return None