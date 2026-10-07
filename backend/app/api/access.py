import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.ai import detector, recognizer, liveness_detector, emotion_detector
from app.api.face import sync_faiss_with_db

router = APIRouter(prefix="/access", tags=["Access Control"])

@router.post("/verify", response_model=schemas.FullAccessControlResult)
def verify_access_control(input_frame: schemas.FullAccessControlInput, db: Session = Depends(get_db)):
    if not recognizer.registered_users:
        sync_faiss_with_db(db)

    img = detector.base64_to_image(input_frame.image_base64)
    det_res = detector.detect_face(img)

    if not det_res["detected"]:
        # Log denied attempt due to missing face
        access_log = models.AccessLog(
            user_id=None,
            access_status="Denied",
            spoof_status="No Face",
            emotion="None"
        )
        db.add(access_log)
        db.commit()

        return {
            "access_status": "Denied",
            "reason": "No face detected in camera view",
            "face_detected": False,
            "user_id": None,
            "user_name": "Unknown",
            "similarity_score": 0.0,
            "spoof_status": "No Face Detected",
            "spoof_probability": 1.0,
            "emotion": "Unknown",
            "bounding_box": None
        }

    box = det_res["box"]
    aligned_crop = detector.align_face(img, box, det_res["landmarks"])
    query_vec = recognizer.extract_embedding(aligned_crop)

    # 1. FAISS Vector Search
    user_id, user_name, similarity = recognizer.search_face(query_vec)

    # 2. Anti-Spoofing Liveness Check
    liveness_res = liveness_detector.check_liveness(det_res["crop"])

    # 3. Emotion Detection
    em_res = emotion_detector.detect_emotion(det_res["crop"], det_res.get("landmarks"))

    # Decision Logic:
    # IF Face Recognized AND Liveness = Real THEN Access = Granted ELSE Access = Denied
    face_is_recognized = (user_id is not None) and (similarity >= 0.55)
    is_real_liveness = liveness_res["is_real"]

    if face_is_recognized and is_real_liveness:
        access_status = "Granted"
        reason = f"Access Granted to {user_name} (Similarity: {int(similarity*100)}%)"
    elif not face_is_recognized and is_real_liveness:
        access_status = "Denied"
        reason = "Access Denied: Unregistered User face"
    elif face_is_recognized and not is_real_liveness:
        access_status = "Denied"
        reason = f"Access Denied: Anti-Spoofing alert ({liveness_res['spoof_status']})"
    else:
        access_status = "Denied"
        reason = "Access Denied: Unknown User & Spoof attempt detected"

    now = datetime.datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%H:%M:%S")

    # Store Logs
    # 1. Access Log
    access_log = models.AccessLog(
        user_id=user_id,
        access_status=access_status,
        spoof_status=liveness_res["spoof_status"],
        emotion=em_res["dominant_emotion"]
    )
    db.add(access_log)

    # 2. Recognition Log
    rec_log = models.RecognitionLog(
        user_id=user_id,
        confidence=round(float(similarity), 3)
    )
    db.add(rec_log)

    # 3. Emotion Log
    emo_log = models.EmotionLog(
        user_id=user_id,
        emotion=em_res["dominant_emotion"],
        confidence=em_res["confidence"]
    )
    db.add(emo_log)

    # 4. If Granted and registered user, log Attendance for today if not already logged
    if access_status == "Granted" and user_id is not None:
        existing_att = db.query(models.AttendanceLog).filter(
            models.AttendanceLog.user_id == user_id,
            models.AttendanceLog.date == date_str
        ).first()

        if not existing_att:
            att_log = models.AttendanceLog(
                user_id=user_id,
                date=date_str,
                time=time_str,
                status="Present"
            )
            db.add(att_log)

    db.commit()

    return {
        "access_status": access_status,
        "reason": reason,
        "face_detected": True,
        "user_id": user_id,
        "user_name": user_name,
        "similarity_score": round(float(similarity), 3),
        "spoof_status": liveness_res["spoof_status"],
        "spoof_probability": liveness_res["spoof_probability"],
        "emotion": em_res["dominant_emotion"],
        "bounding_box": box
    }

@router.get("/logs", response_model=List[schemas.AccessLogResponse])
def get_access_logs(db: Session = Depends(get_db)):
    logs = db.query(models.AccessLog).order_by(models.AccessLog.timestamp.desc()).limit(100).all()
    user_map = {u.id: u.name for u in db.query(models.User).all()}

    result = []
    for log in logs:
        result.append({
            "id": log.id,
            "user_id": log.user_id,
            "user_name": user_map.get(log.user_id, "Unknown"),
            "access_status": log.access_status,
            "spoof_status": log.spoof_status,
            "emotion": log.emotion,
            "timestamp": log.timestamp
        })
    return result
