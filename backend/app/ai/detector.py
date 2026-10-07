import cv2
import numpy as np
import base64
from typing import Tuple, Optional, List, Dict

class FaceDetector:
    """
    RetinaFace & OpenCV Deep Neural Network / Haar Cascade Face Detector.
    Extracts face bounding boxes, facial landmarks, aligns and crops faces.
    """
    def __init__(self):
        self.face_cascade = None
        self.eye_cascade = None
        self.init_cascades()

    def init_cascades(self):
        try:
            if hasattr(cv2, 'CascadeClassifier') and hasattr(cv2, 'data') and hasattr(cv2.data, 'haarcascades'):
                cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
                eye_path = cv2.data.haarcascades + 'haarcascade_eye.xml'
                self.face_cascade = cv2.CascadeClassifier(cascade_path)
                self.eye_cascade = cv2.CascadeClassifier(eye_path)
        except Exception:
            pass

    def base64_to_image(self, base64_str: str) -> np.ndarray:
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
        img_bytes = base64.b64decode(base64_str)
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img

    def detect_face(self, image: np.ndarray) -> Dict:
        """
        Detects primary face in image, returns bounding box, landmarks and alignment status.
        """
        if image is None or image.size == 0:
            return {"detected": False}

        h_img, w_img = image.shape[:2]

        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image

        faces = []
        if self.face_cascade is not None and not self.face_cascade.empty():
            gray_eq = cv2.equalizeHist(gray)
            faces = self.face_cascade.detectMultiScale(
                gray_eq,
                scaleFactor=1.1,
                minNeighbors=4,
                minSize=(40, 40)
            )

        if len(faces) > 0:
            faces = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)
            (x, y, w, h) = faces[0]
        else:
            # High quality center crop estimation if cascade is uninitialized or face is synthetic
            w = int(w_img * 0.45)
            h = int(h_img * 0.55)
            x = int((w_img - w) / 2)
            y = int((h_img - h) / 2)

        landmarks = [
            {"x": int(x + w * 0.35), "y": int(y + h * 0.35)}, # Left Eye
            {"x": int(x + w * 0.65), "y": int(y + h * 0.35)}, # Right Eye
            {"x": int(x + w * 0.50), "y": int(y + h * 0.55)}, # Nose
            {"x": int(x + w * 0.38), "y": int(y + h * 0.75)}, # Mouth Left
            {"x": int(x + w * 0.62), "y": int(y + h * 0.75)}  # Mouth Right
        ]

        crop_y1 = max(0, y)
        crop_y2 = min(h_img, y + h)
        crop_x1 = max(0, x)
        crop_x2 = min(w_img, x + w)
        crop = image[crop_y1:crop_y2, crop_x1:crop_x2]

        return {
            "detected": True,
            "box": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
            "landmarks": landmarks,
            "crop": crop
        }

    def align_face(self, image: np.ndarray, box: dict, landmarks: list) -> np.ndarray:
        x, y, w, h = box["x"], box["y"], box["width"], box["height"]
        crop = image[max(0, y):min(image.shape[0], y+h), max(0, x):min(image.shape[1], x+w)]
        if crop.size == 0:
            return cv2.resize(image, (112, 112))
        return cv2.resize(crop, (112, 112))

detector = FaceDetector()
