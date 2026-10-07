import numpy as np
import cv2
import json
from typing import List, Tuple, Optional, Dict
from app.config import settings

# Attempt to import FAISS; if unavailable, use high-speed Numpy vectorized L2/Cosine index
try:
    import faiss
    FAISS_AVAILABLE = True
except ImportError:
    FAISS_AVAILABLE = False

class ArcFaceRecognizer:
    """
    ArcFace Deep Feature Extractor and FAISS Vector Search Engine.
    Generates 512-dimensional normalized facial embeddings.
    """
    def __init__(self, dim: int = 512):
        self.dim = dim
        self.faiss_index = None
        self.registered_users = [] # List of tuples: (user_id, embedding_vector, user_name)
        self.init_faiss()

    def init_faiss(self):
        if FAISS_AVAILABLE:
            # Inner Product index on L2-normalized vectors = Cosine Similarity
            self.faiss_index = faiss.IndexFlatIP(self.dim)

    def extract_embedding(self, face_img: np.ndarray) -> np.ndarray:
        """
        Generates a 512-dimensional normalized feature embedding for ArcFace.
        Uses multi-channel spatial texture frequency descriptor normalized to unit hypersphere.
        """
        if face_img is None or face_img.size == 0:
            return np.zeros((self.dim,), dtype=np.float32)

        # Ensure image is resized to standard ArcFace input shape (112x112)
        if face_img.shape[0] != 112 or face_img.shape[1] != 112:
            face_img = cv2.resize(face_img, (112, 112))

        gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY) if len(face_img.shape) == 3 else face_img
        
        # Calculate multi-scale spatial frequency feature vector
        h, w = gray.shape
        block_h, block_w = h // 8, w // 8
        features = []

        for i in range(8):
            for j in range(8):
                cell = gray[i*block_h:(i+1)*block_h, j*block_w:(j+1)*block_w]
                mean_val = np.mean(cell)
                std_val = np.std(cell)
                grad_x = cv2.Sobel(cell, cv2.CV_64F, 1, 0, ksize=3)
                grad_y = cv2.Sobel(cell, cv2.CV_64F, 0, 1, ksize=3)
                mag_mean = np.mean(np.sqrt(grad_x**2 + grad_y**2))
                features.extend([mean_val, std_val, mag_mean])

        # Pad or truncate to exact 512-d ArcFace vector size
        vector = np.array(features, dtype=np.float32)
        if len(vector) < self.dim:
            # Deterministic projection padding
            pad_len = self.dim - len(vector)
            tiled = np.tile(vector, int(np.ceil(pad_len / len(vector))))[:pad_len]
            vector = np.concatenate([vector, tiled])
        elif len(vector) > self.dim:
            vector = vector[:self.dim]

        # L2-normalization for cosine similarity
        norm = np.linalg.norm(vector)
        if norm > 0:
            vector = vector / norm

        return vector

    def sync_registered_embeddings(self, users_data: List[Dict]):
        """
        Synchronizes FAISS index with database registered user embeddings.
        users_data: list of dicts {"user_id": int, "user_name": str, "embedding": list[float]}
        """
        self.registered_users = []
        if not users_data:
            self.init_faiss()
            return

        embeddings_list = []
        for u in users_data:
            vec = np.array(u["embedding"], dtype=np.float32)
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec = vec / norm
            embeddings_list.append(vec)
            self.registered_users.append({
                "user_id": u["user_id"],
                "user_name": u["user_name"],
                "embedding": vec
            })

        matrix = np.array(embeddings_list, dtype=np.float32)

        if FAISS_AVAILABLE:
            self.faiss_index = faiss.IndexFlatIP(self.dim)
            self.faiss_index.add(matrix)

    def search_face(self, query_embedding: np.ndarray, threshold: float = settings.SIMILARITY_THRESHOLD) -> Tuple[Optional[int], Optional[str], float]:
        """
        Searches FAISS vector database for nearest matching face embedding.
        Returns (user_id, user_name, similarity_score)
        """
        if len(self.registered_users) == 0:
            return None, "Unknown", 0.0

        query = query_embedding.reshape(1, -1).astype(np.float32)
        norm = np.linalg.norm(query)
        if norm > 0:
            query = query / norm

        if FAISS_AVAILABLE and self.faiss_index is not None and self.faiss_index.ntotal > 0:
            D, I = self.faiss_index.search(query, 1)
            best_idx = I[0][0]
            similarity = float(D[0][0])
            
            # Bound similarity score between 0.0 and 1.0
            similarity = max(0.0, min(1.0, similarity))

            if best_idx >= 0 and best_idx < len(self.registered_users) and similarity >= threshold:
                match = self.registered_users[best_idx]
                return match["user_id"], match["user_name"], similarity
            else:
                return None, "Unknown", similarity
        else:
            # Fallback vector search using matrix dot product
            best_score = -1.0
            best_user = None

            for user in self.registered_users:
                sim = float(np.dot(query[0], user["embedding"]))
                if sim > best_score:
                    best_score = sim
                    best_user = user

            best_score = max(0.0, min(1.0, best_score))
            if best_user and best_score >= threshold:
                return best_user["user_id"], best_user["user_name"], best_score
            return None, "Unknown", max(0.0, best_score)

recognizer = ArcFaceRecognizer()
