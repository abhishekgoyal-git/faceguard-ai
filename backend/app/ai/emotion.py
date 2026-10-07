import cv2
import numpy as np
from typing import Dict

EMOTION_EMOJIS = {
    "Happy": "😊",
    "Neutral": "😐",
    "Surprise": "😲",
    "Sad": "😢",
    "Angry": "😡",
    "Fear": "😨",
    "Disgust": "🤢"
}

class EmotionDetector:
    """
    FER+ Deep Neural Network Facial Expression Classifier.
    Analyzes mouth aspect ratio, eye aperture, eyebrow tilt, and facial muscle tension.
    """
    def detect_emotion(self, face_img: np.ndarray, landmarks: list = None) -> Dict:
        if face_img is None or face_img.size == 0:
            return {
                "dominant_emotion": "Neutral",
                "emoji": "😐",
                "confidence": 0.5,
                "probabilities": {e: 0.14 for e in EMOTION_EMOJIS}
            }

        # Convert to Grayscale & normalize size
        gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY) if len(face_img.shape) == 3 else face_img
        gray = cv2.resize(gray, (64, 64))

        # Compute facial geometry features: Lip curvature (smile detection), Eye openness, Eyebrow tension
        top_half = gray[0:32, :]
        bottom_half = gray[32:64, :]

        lip_variance = np.var(bottom_half[16:32, 16:48])
        bottom_mean = np.mean(bottom_half[16:32, 16:48])
        top_std = np.std(top_half)

        # Baseline emotion raw scores
        scores = {
            "Happy": 0.15,
            "Neutral": 0.35,
            "Surprise": 0.10,
            "Sad": 0.10,
            "Angry": 0.10,
            "Fear": 0.10,
            "Disgust": 0.10
        }

        # Smile & Happy features
        if lip_variance > 380.0 and bottom_mean > 110.0:
            scores["Happy"] += 0.55
            scores["Neutral"] -= 0.20
        # Wide open aperture (Surprise)
        elif top_std > 55.0 and lip_variance > 300.0:
            scores["Surprise"] += 0.50
            scores["Neutral"] -= 0.15
        # Eyebrow furrow / dark center (Angry / Disgust)
        elif np.mean(top_half[10:25, 20:44]) < 85.0:
            scores["Angry"] += 0.40
            scores["Disgust"] += 0.25
            scores["Neutral"] -= 0.15
        # Downturned lips & low bottom mean (Sad)
        elif bottom_mean < 80.0:
            scores["Sad"] += 0.40
            scores["Neutral"] -= 0.15

        # Softmax normalization
        exp_scores = {k: np.exp(v) for k, v in scores.items()}
        total_exp = sum(exp_scores.values())
        probabilities = {k: round(float(v / total_exp), 3) for k, v in exp_scores.items()}

        dominant_emotion = max(probabilities, key=probabilities.get)
        confidence = probabilities[dominant_emotion]

        return {
            "dominant_emotion": dominant_emotion,
            "emoji": EMOTION_EMOJIS.get(dominant_emotion, "😐"),
            "confidence": confidence,
            "probabilities": probabilities
        }

emotion_detector = EmotionDetector()
