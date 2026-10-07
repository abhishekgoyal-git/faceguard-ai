import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, security
from app.ai import detector, recognizer

router = APIRouter(prefix="/face", tags=["Face Enrollment"])

def sync_faiss_with_db(db: Session):
    all_embeddings = db.query(models.FaceEmbedding).all()
    user_map = {u.id: u.name for u in db.query(models.User).all()}
    
    users_data = []
    for emb in all_embeddings:
        try:
            vec = json.loads(emb.embedding_vector)
            users_data.append({
                "user_id": emb.user_id,
                "user_name": user_map.get(emb.user_id, "Unknown"),
                "embedding": vec
            })
        except Exception:
            continue
    
    recognizer.sync_registered_embeddings(users_data)

@router.post("/enroll")
def enroll_face(
    enroll_input: schemas.FaceEnrollmentInput,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    if not enroll_input.image_base64_list:
        raise HTTPException(status_code=400, detail="No face images provided for enrollment")

    saved_count = 0
    for base64_str in enroll_input.image_base64_list:
        img = detector.base64_to_image(base64_str)
        det_result = detector.detect_face(img)
        
        if not det_result["detected"]:
            continue

        aligned_crop = detector.align_face(img, det_result["box"], det_result["landmarks"])
        embedding = recognizer.extract_embedding(aligned_crop)

        # Serialize 512-d numpy vector to JSON string
        embedding_str = json.dumps(embedding.tolist())

        db_emb = models.FaceEmbedding(
            user_id=current_user.id,
            embedding_vector=embedding_str
        )
        db.add(db_emb)
        saved_count += 1

    if saved_count == 0:
        raise HTTPException(
            status_code=400,
            detail="No valid faces detected in the provided images. Please retake photo."
        )

    db.commit()

    # Re-sync FAISS Index in background memory
    sync_faiss_with_db(db)

    return {
        "message": f"Successfully enrolled {saved_count} face embeddings for user {current_user.name}",
        "user_id": current_user.id,
        "enrolled_count": saved_count
    }

@router.get("/status")
def get_enrollment_status(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    count = db.query(models.FaceEmbedding).filter(models.FaceEmbedding.user_id == current_user.id).count()
    return {
        "user_id": current_user.id,
        "has_face_enrolled": count > 0,
        "embedding_count": count
    }
