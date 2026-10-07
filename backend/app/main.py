import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import settings
from app.database import engine, Base, SessionLocal
from app import models, security
from app.api import auth, users, face, recognition, liveness, emotion, access, attendance, admin
from app.api.face import sync_faiss_with_db

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(face.router, prefix=settings.API_V1_STR)
app.include_router(recognition.router, prefix=settings.API_V1_STR)
app.include_router(liveness.router, prefix=settings.API_V1_STR)
app.include_router(emotion.router, prefix=settings.API_V1_STR)
app.include_router(access.router, prefix=settings.API_V1_STR)
app.include_router(attendance.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

def seed_demo_data():
    """Seeds initial admin user and sample log records if DB is empty"""
    db: Session = SessionLocal()
    try:
        if db.query(models.User).count() == 0:
            admin_user = models.User(
                name="Admin User",
                email="admin@faceguard.ai",
                password_hash=security.get_password_hash("admin123"),
                phone="+1-555-0199",
                role="admin"
            )
            demo_user = models.User(
                name="Alex Vance",
                email="alex@faceguard.ai",
                password_hash=security.get_password_hash("user123"),
                phone="+1-555-0142",
                role="user"
            )
            db.add(admin_user)
            db.add(demo_user)
            db.commit()
            db.refresh(admin_user)
            db.refresh(demo_user)

            # Seed sample logs for instant dashboard visual aesthetics
            today_str = datetime.datetime.now().strftime("%Y-%m-%d")
            time_str = datetime.datetime.now().strftime("%H:%M:%S")

            db.add(models.AttendanceLog(user_id=admin_user.id, date=today_str, time=time_str, status="Present"))
            db.add(models.AttendanceLog(user_id=demo_user.id, date=today_str, time=time_str, status="Present"))
            
            db.add(models.AccessLog(user_id=admin_user.id, access_status="Granted", spoof_status="Real Face", emotion="Happy"))
            db.add(models.AccessLog(user_id=demo_user.id, access_status="Granted", spoof_status="Real Face", emotion="Neutral"))
            db.add(models.AccessLog(user_id=None, access_status="Denied", spoof_status="Mobile Replay Attack", emotion="Neutral"))
            
            db.add(models.EmotionLog(user_id=admin_user.id, emotion="Happy", confidence=0.92))
            db.add(models.EmotionLog(user_id=demo_user.id, emotion="Neutral", confidence=0.88))
            
            db.commit()

        # Synchronize FAISS index on startup
        sync_faiss_with_db(db)
    finally:
        db.close()

@app.on_event("startup")
def startup_event():
    seed_demo_data()

@app.get("/")
def root():
    return {
        "status": "active",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs"
    }
