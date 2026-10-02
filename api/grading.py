from services.grading_service import GradingService  
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api.deps import get_db, get_current_teacher 
from schemas.grading_schemas import OverallBandRead 
from typing import List  
from db.models.user import User 
import uuid 
from core.rate_limiter import RateLimiter 
from workers.tasks import calculate_classroom_overall_band_scores_task
from celery.result import AsyncResult
from core.celery_app import celery_app

router = APIRouter() 

@router.get("/classroom/{classroom_id}",
             response_model=List[OverallBandRead],
             dependencies=[Depends(RateLimiter(requests_limit=3, window_seconds=20))])
def read_classroom_overall_band_scores(*,classroom_id: uuid.UUID,db: Session = Depends(get_db), current_user: User = Depends(get_current_teacher)):
    service = GradingService(db)
    scores= service.get_classroom_overall_band_scores(classroom_id) 
    if not scores:
        raise HTTPException(status_code=404, detail="No scores found for this classroom")
    return scores

@router.get("/student/{student_id}",
             response_model=List[OverallBandRead],
             dependencies=[Depends(RateLimiter(requests_limit=3, window_seconds=20))])
def read_student_overall_band_scores(*,classroom_id: uuid.UUID, student_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_teacher)):
    service = GradingService(db)
    score= service.get_student_overall_band_score(classroom_id, student_id)
    if not score:
        raise HTTPException(status_code=404, detail="No scores found for this student")
    return score



## redis shit 
# triggering the celery task to calculate overall band scores for a classroom   
@router.post("/classroom/{classroom_id}/calculate_overall_band_scores", status_code=status.HTTP_202_ACCEPTED, dependencies=[Depends(RateLimiter(requests_limit=3, window_seconds=20))])
def calculate_classroom_overall_band_scores(*, classroom_id: uuid.UUID):
    classroom_id_str = str(classroom_id)     
    task = calculate_classroom_overall_band_scores_task.delay(classroom_id_str)
    return {
        "message": "Classroom overall band calculation job queued successfully.",
        "task_id": task.id,
        "status": "PENDING"
    }


# get the task status and result 
@router.get("/tasks/{task_id}")
def get_task_status(task_id: str):
    """
    Kiểm tra trạng thái và kết quả của tác vụ Celery.
    """
    # 🟢 2. Truyền app=celery_app để Celery đọc đúng Redis Backend
    task_result = AsyncResult(task_id, app=celery_app)

    response = {
        "task_id": task_id,
        "status": task_result.status
    }

    if task_result.ready():
        if task_result.successful():
            response["result"] = task_result.result
        else:
            response["error"] = str(task_result.info)

    return response