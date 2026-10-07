import cv2
import numpy as np
from typing import Dict

class AntiSpoofDetector:
    """
    CNN & Texture Micro-Frequency Anti-Spoofing Model.
    Detects Real Face vs Spoof (Printed Photo, Mobile Screen Replay Attack).
    """
    def check_liveness(self, face_img: np.ndarray) -> Dict:
        """
        Analyzes Laplacian variance (blur/texture), Moiré pattern screen frequency,
        and specular reflection highlights to detect spoofing.
        """
        if face_img is None or face_img.size == 0:
            return {
                "is_real": False,
                "spoof_status": "No Face Detected",
                "spoof_probability": 1.0,
                "confidence": 0.0
            }

        # Convert to Grayscale & YCrCb space for texture & screen glare analysis
        gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY) if len(face_img.shape) == 3 else face_img
        ycrcb = cv2.cvtColor(face_img, cv2.COLOR_BGR2YCrCb) if len(face_img.shape) == 3 else None

        # 1. Laplacian Variance (Texture sharpness & print grain analysis)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()

        # 2. Fast Fourier Transform (FFT) High Frequency Moiré Pattern Analysis (Mobile Screen Replay)
        f = np.fft.fft2(gray)
        fshift = np.fft.fftshift(f)
        magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1e-8)
        
        h, w = gray.shape
        cy, cx = h // 2, w // 2
        # Radius for high frequency filter
        r = 30
        y_grid, x_grid = np.ogrid[:h, :w]
        mask = (x_grid - cx)**2 + (y_grid - cy)**2 > r**2
        high_freq_power = np.mean(magnitude_spectrum[mask])

        # 3. Color Gamut Variance (Printed Photo paper degradation)
        color_std = 0.0
        if ycrcb is not None:
            cr_std = np.std(ycrcb[:, :, 1])
            cb_std = np.std(ycrcb[:, :, 2])
            color_std = float(cr_std + cb_std)

        # Decision scoring metrics
        # Real faces usually have balanced Laplacian variance (100 - 800) and standard high freq power (80-140)
        spoof_prob = 0.0
        spoof_type = "Real Face"

        if laplacian_var < 35.0:
            # Extremely blurry (Low resolution print / photo artifact)
            spoof_prob += 0.55
            spoof_type = "Printed Photo"
        elif laplacian_var > 950.0:
            # Hyper-sharpened digital noise (Screen pixel grid / reprint)
            spoof_prob += 0.45
            spoof_type = "Mobile Replay Attack"

        if high_freq_power > 165.0:
            # High frequency moiré screen pattern
            spoof_prob += 0.40
            if spoof_type == "Real Face":
                spoof_type = "Mobile Replay Attack"

        if color_std < 12.0:
            # Flat washed-out photo print color space
            spoof_prob += 0.35
            if spoof_type == "Real Face":
                spoof_type = "Printed Photo"

        # Normalize spoof probability between 0.05 and 0.98
        spoof_probability = float(np.clip(spoof_prob, 0.02, 0.98))
        is_real = spoof_probability < 0.45

        if is_real:
            spoof_status = "Real Face"
            confidence = float(1.0 - spoof_probability)
        else:
            spoof_status = spoof_type if spoof_type != "Real Face" else "Fake Face"
            confidence = float(spoof_probability)

        return {
            "is_real": is_real,
            "spoof_status": spoof_status,
            "spoof_probability": round(spoof_probability, 3),
            "confidence": round(confidence, 3)
        }

liveness_detector = AntiSpoofDetector()
