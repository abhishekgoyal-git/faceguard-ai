import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FaceGuard AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = "super-secret-key-faceguard-ai-2026-production-grad-key-xyz987"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Dual database support: default to SQLite for instant local execution, PostgreSQL supported
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./faceguard.db")
    
    # FAISS and Model Parameters
    EMBEDDING_DIM: int = 512
    SIMILARITY_THRESHOLD: float = 0.60
    SPOOF_THRESHOLD: float = 0.50

    class Config:
        case_sensitive = True

settings = Settings()
