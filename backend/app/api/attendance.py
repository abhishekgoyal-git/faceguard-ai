import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas, security

router = APIRouter(prefix="/attendance", tags=["Attendance Logs"])

@router.get("/today", response_model=List[schemas.AttendanceLogResponse])
def get_today_attendance(db: Session = Depends(get_db)):
    today_str = datetime.datetime.now().strftime("%Y-%m-%d")
    logs = db.query(models.AttendanceLog).filter(models.AttendanceLog.date == today_str).all()
    user_map = {u.id: u.name for u in db.query(models.User).all()}

    res = []
    for log in logs:
        res.append({
            "id": log.id,
            "user_id": log.user_id,
            "user_name": user_map.get(log.user_id, "User"),
            "date": log.date,
            "time": log.time,
            "status": log.status
        })
    return res

@router.get("/summary")
def get_attendance_summary(db: Session = Depends(get_db)):
    today_str = datetime.datetime.now().strftime("%Y-%m-%d")
    total_users = db.query(models.User).count()
    present_today = db.query(models.AttendanceLog).filter(models.AttendanceLog.date == today_str).count()
    absent_today = max(0, total_users - present_today)

    # 7-day trend
    past_7_days = []
    for i in range(6, -1, -1):
        day = datetime.datetime.now() - datetime.timedelta(days=i)
        day_str = day.strftime("%Y-%m-%d")
        day_name = day.strftime("%a")
        cnt = db.query(models.AttendanceLog).filter(models.AttendanceLog.date == day_str).count()
        past_7_days.append({"date": day_str, "day": day_name, "count": cnt})

    return {
        "total_users": total_users,
        "present_today": present_today,
        "absent_today": absent_today,
        "attendance_rate": round(float(present_today / max(1, total_users)) * 100, 1),
        "weekly_trend": past_7_days
    }
