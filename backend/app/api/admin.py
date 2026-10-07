import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas, security

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/summary", response_model=schemas.DashboardSummary)
def get_admin_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_admin_user)
):
    today_str = datetime.datetime.now().strftime("%Y-%m-%d")
    
    total_users = db.query(models.User).count()
    total_recognitions = db.query(models.RecognitionLog).count()
    today_attendance = db.query(models.AttendanceLog).filter(models.AttendanceLog.date == today_str).count()
    access_events_today = db.query(models.AccessLog).count()

    granted_count = db.query(models.AccessLog).filter(models.AccessLog.access_status == "Granted").count()
    denied_count = db.query(models.AccessLog).filter(models.AccessLog.access_status == "Denied").count()

    real_faces_count = db.query(models.AccessLog).filter(models.AccessLog.spoof_status == "Real Face").count()
    spoof_attempts_count = db.query(models.AccessLog).filter(models.AccessLog.spoof_status != "Real Face").count()

    return {
        "total_users": total_users,
        "total_recognitions": total_recognitions,
        "today_attendance": today_attendance,
        "access_events_today": access_events_today,
        "granted_count": granted_count,
        "denied_count": denied_count,
        "real_faces_count": real_faces_count,
        "spoof_attempts_count": spoof_attempts_count
    }

@router.get("/emotions", response_model=List[schemas.EmotionLogResponse])
def get_emotion_logs(db: Session = Depends(get_db)):
    logs = db.query(models.EmotionLog).order_by(models.EmotionLog.detected_at.desc()).limit(100).all()
    user_map = {u.id: u.name for u in db.query(models.User).all()}

    res = []
    for l in logs:
        res.append({
            "id": l.id,
            "user_id": l.user_id,
            "user_name": user_map.get(l.user_id, "Unknown"),
            "emotion": l.emotion,
            "confidence": l.confidence,
            "detected_at": l.detected_at
        })
    return res

@router.get("/recognitions", response_model=List[schemas.RecognitionLogResponse])
def get_recognition_logs(db: Session = Depends(get_db)):
    logs = db.query(models.RecognitionLog).order_by(models.RecognitionLog.recognized_at.desc()).limit(100).all()
    user_map = {u.id: u.name for u in db.query(models.User).all()}

    res = []
    for l in logs:
        res.append({
            "id": l.id,
            "user_id": l.user_id,
            "user_name": user_map.get(l.user_id, "Unknown"),
            "confidence": l.confidence,
            "recognized_at": l.recognized_at
        })
    return res
