from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from dependencies import get_current_user
from services.cache import get_cached_dashboard, set_cached_dashboard
from tasks import generate_weekly_report

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/", response_model=List[schemas.DashboardDataResponse])
def get_dashboard_data(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Try fetching from Redis Cache first
    cached_data = get_cached_dashboard(current_user.id)
    if cached_data:
        # We attach a special header or just return it (middleware will track it)
        return cached_data

    # Fallback to PostgreSQL Database
    records = db.query(models.DashboardData).filter(models.DashboardData.owner_id == current_user.id).all()
    
    # Serialize for cache
    serialized_records = [
        schemas.DashboardDataResponse.model_validate(r).model_dump(mode='json') for r in records
    ]
    
    # Write to Redis Cache
    set_cached_dashboard(current_user.id, serialized_records)

    return records

@router.post("/report/generate")
def trigger_report_generation(
    current_user: models.User = Depends(get_current_user)
):
    # Trigger the Celery background task
    task = generate_weekly_report.delay(current_user.id)
    return {"message": "Report generation started in the background", "task_id": task.id}
