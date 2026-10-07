from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.ai import detector, emotion_detector

router = APIRouter(prefix="/emotion", tags=["Emotion Detection"])

@router.post("/analyze", response_model=schemas.EmotionResult)
def analyze_emotion(input_frame: schemas.ImageFrameInput, db: Session = Depends(get_db)):
    img = detector.base64_to_image(input_frame.image_base64)
    det_res = detector.detect_face(img)

    if not det_res["detected"]:
        return {
            "face_detected": False,
            "dominant_emotion": "Neutral",
            "emoji": "😐",
            "confidence": 0.0,
            "probabilities": {e: 0.14 for e in ["Happy", "Neutral", "Surprise", "Sad", "Angry", "Fear", "Disgust"]}
        }

    crop = det_res["crop"]
    em_res = emotion_detector.detect_emotion(crop, det_res.get("landmarks"))

    # Log emotion entry
    emo_log = models.EmotionLog(
        user_id=None, # Will be attached if logged during recognition workflow
        emotion=em_res["dominant_emotion"],
        confidence=em_res["confidence"]
    )
    db.add(emo_log)
    db.commit()

    return {
        "face_detected": True,
        "dominant_emotion": em_res["dominant_emotion"],
        "emoji": em_res["emoji"],
        "confidence": em_res["confidence"],
        "probabilities": em_res["probabilities"]
    }
