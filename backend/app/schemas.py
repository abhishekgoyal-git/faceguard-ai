from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str
    email: str
    role: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None
    role: Optional[str] = None

# User Response Schemas
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    created_at: datetime
    has_face_enrolled: bool = False

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None

# AI Analysis Input / Output Schemas
class ImageFrameInput(BaseModel):
    image_base64: str

class BoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int

class LandmarkPoint(BaseModel):
    x: int
    y: int

class DetectionResult(BaseModel):
    face_detected: bool
    bounding_box: Optional[BoundingBox] = None
    landmarks: Optional[List[LandmarkPoint]] = None

class FaceEnrollmentInput(BaseModel):
    image_base64_list: List[str]

class RecognitionResult(BaseModel):
    face_detected: bool
    user_id: Optional[int] = None
    user_name: Optional[str] = None
    similarity_score: float
    confidence: float
    status: str # Recognized / Unknown
    bounding_box: Optional[BoundingBox] = None

class LivenessResult(BaseModel):
    face_detected: bool
    is_real: bool
    spoof_status: str # Real Face / Fake Face / Printed Photo / Mobile Replay
    spoof_probability: float
    confidence: float

class EmotionResult(BaseModel):
    face_detected: bool
    dominant_emotion: str # Happy, Sad, Angry, Neutral, Fear, Surprise, Disgust
    emoji: str
    confidence: float
    probabilities: dict

class FullAccessControlInput(BaseModel):
    image_base64: str

class FullAccessControlResult(BaseModel):
    access_status: str # Granted / Denied
    reason: str
    face_detected: bool
    user_id: Optional[int] = None
    user_name: str
    similarity_score: float
    spoof_status: str
    spoof_probability: float
    emotion: str
    bounding_box: Optional[BoundingBox] = None

# Log Schemas
class AttendanceLogResponse(BaseModel):
    id: int
    user_id: int
    user_name: str
    date: str
    time: str
    status: str

    class Config:
        from_attributes = True

class AccessLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    user_name: Optional[str] = "Unknown"
    access_status: str
    spoof_status: str
    emotion: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class RecognitionLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    user_name: Optional[str] = "Unknown"
    confidence: float
    recognized_at: datetime

    class Config:
        from_attributes = True

class EmotionLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    user_name: Optional[str] = "Unknown"
    emotion: str
    confidence: float
    detected_at: datetime

    class Config:
        from_attributes = True

class DashboardSummary(BaseModel):
    total_users: int
    total_recognitions: int
    today_attendance: int
    access_events_today: int
    granted_count: int
    denied_count: int
    real_faces_count: int
    spoof_attempts_count: int
