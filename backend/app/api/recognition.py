from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.ai import detector, recognizer
from app.api.face import sync_faiss_with_db

router = APIRouter(prefix="/recognition", tags=["Face Recognition"])

@router.post("/verify", response_model=schemas.RecognitionResult)
def verify_face_stream(input_frame: schemas.ImageFrameInput, db: Session = Depends(get_db)):
    # Ensure FAISS is synced with DB embeddings
    if not recognizer.registered_users:
        sync_faiss_with_db(db)

    img = detector.base64_to_image(input_frame.image_base64)
    det_res = detector.detect_face(img)

    if not det_res["detected"]:
        return {
            "face_detected": False,
            "user_id": None,
            "user_name": "No Face Detected",
            "similarity_score": 0.0,
            "confidence": 0.0,
            "status": "Unknown User",
            "bounding_box": None
        }

    box = det_res["box"]
    aligned_crop = detector.align_face(img, box, det_res["landmarks"])
    query_vec = recognizer.extract_embedding(aligned_crop)

    user_id, user_name, similarity = recognizer.search_face(query_vec)

    status_str = "Recognized" if user_id is not None else "Unknown User"

    # Log recognition event
    rec_log = models.RecognitionLog(
        user_id=user_id,
        confidence=round(float(similarity), 3)
    )
    db.add(rec_log)
    db.commit()

    return {
        "face_detected": True,
        "user_id": user_id,
        "user_name": user_name,
        "similarity_score": round(float(similarity), 3),
        "confidence": round(float(similarity), 3),
        "status": status_str,
        "bounding_box": box
    }
