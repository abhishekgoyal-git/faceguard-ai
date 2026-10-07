from fastapi import APIRouter
from app import schemas
from app.ai import detector, liveness_detector

router = APIRouter(prefix="/liveness", tags=["Liveness Detection"])

@router.post("/verify", response_model=schemas.LivenessResult)
def verify_liveness(input_frame: schemas.ImageFrameInput):
    img = detector.base64_to_image(input_frame.image_base64)
    det_res = detector.detect_face(img)

    if not det_res["detected"]:
        return {
            "face_detected": False,
            "is_real": False,
            "spoof_status": "No Face Detected",
            "spoof_probability": 1.0,
            "confidence": 0.0
        }

    crop = det_res["crop"]
    liveness_res = liveness_detector.check_liveness(crop)

    return {
        "face_detected": True,
        "is_real": liveness_res["is_real"],
        "spoof_status": liveness_res["spoof_status"],
        "spoof_probability": liveness_res["spoof_probability"],
        "confidence": liveness_res["confidence"]
    }
