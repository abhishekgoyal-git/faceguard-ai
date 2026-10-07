import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(20), default="user") # "admin" or "user"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    face_embeddings = relationship("FaceEmbedding", back_populates="user", cascade="all, delete-orphan")
    attendance_logs = relationship("AttendanceLog", back_populates="user", cascade="all, delete-orphan")
    recognition_logs = relationship("RecognitionLog", back_populates="user", cascade="all, delete-orphan")
    emotion_logs = relationship("EmotionLog", back_populates="user", cascade="all, delete-orphan")
    access_logs = relationship("AccessLog", back_populates="user", cascade="all, delete-orphan")

class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    embedding_vector = Column(Text, nullable=False) # JSON serialized 512-d float list
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="face_embeddings")

class AttendanceLog(Base):
    __tablename__ = "attendance_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(String(10), nullable=False) # YYYY-MM-DD
    time = Column(String(8), nullable=False)  # HH:MM:SS
    status = Column(String(20), default="Present") # Present / Absent / Late

    user = relationship("User", back_populates="attendance_logs")

class RecognitionLog(Base):
    __tablename__ = "recognition_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True) # Null if unknown
    confidence = Column(Float, nullable=False)
    recognized_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="recognition_logs")

class EmotionLog(Base):
    __tablename__ = "emotion_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    emotion = Column(String(30), nullable=False) # Happy, Sad, Angry, Neutral, Fear, Surprise, Disgust
    confidence = Column(Float, nullable=False)
    detected_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="emotion_logs")

class AccessLog(Base):
    __tablename__ = "access_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    access_status = Column(String(20), nullable=False) # Granted / Denied
    spoof_status = Column(String(20), nullable=False) # Real / Fake
    emotion = Column(String(30), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="access_logs")
