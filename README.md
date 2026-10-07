# FaceGuard AI: AI-Powered Biometric Access Control System

![FaceGuard AI Banner](https://img.shields.io/badge/FaceGuard-AI--Powered%20Biometrics-06b6d4?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![ArcFace](https://img.shields.io/badge/ArcFace-512--d%20Vectors-8b5cf6?style=for-the-badge)
![FAISS](https://img.shields.io/badge/FAISS-Vector%20Search-10b981?style=for-the-badge)

**FaceGuard AI** is a production-grade facial recognition, anti-spoofing liveness detection, emotion tracking, and biometric access control system.

---

## 🌟 Key Features

1. **RetinaFace Face Detection & Alignment**: Landmark extraction & face alignment.
2. **ArcFace 512-d Embedding Generation**: Extracts normalized spatial vectors.
3. **FAISS Fast Vector Search**: Microsecond nearest-neighbor cosine similarity matching.
4. **Anti-Spoofing Liveness Detection**: Deep texture & FFT frequency spectrum analysis guarding against **Printed Photos** and **Mobile Replay Attacks**.
5. **FER+ Facial Emotion Detection**: Real-time expression classifier tracking 7 core human emotion states (Happy, Neutral, Surprise, Sad, Angry, Fear, Disgust).
6. **Zero-Trust Access Gateway (9-Step Decision Engine)**:
   - **IF** Face Recognized **AND** Liveness = Real Face **THEN** Access = Granted **ELSE** Access = Denied.
7. **Attendance & Admin Dashboards**: Real-time logs, user CRUD management, attendance turnout trends, and customizable model thresholds.

---

## 🏗️ Architecture & Technology Stack

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Tailwind CSS (Custom Dark AI Cyber glassmorphism design system)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios with JWT Token Interceptors

### Backend
- **Framework**: Python FastAPI
- **Computer Vision**: OpenCV
- **Deep Learning Embeddings**: ArcFace 512-dimensional vector format
- **Detector**: RetinaFace / OpenCV DNN
- **Vector Search Engine**: FAISS (IndexFlatIP)
- **Database ORM**: SQLAlchemy (PostgreSQL / SQLite compatible out-of-the-box)
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt password hashing

---

## 📁 Project Folder Structure

```
faceguard-ai/
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── detector.py      # RetinaFace / OpenCV face detection & alignment
│   │   │   ├── recognizer.py    # ArcFace 512-d feature extraction & FAISS matcher
│   │   │   ├── liveness.py      # Anti-spoofing (Real / Printed Photo / Mobile Replay)
│   │   │   └── emotion.py       # FER+ 7 facial expressions classifier
│   │   ├── api/
│   │   │   ├── auth.py          # Register, Login, Refresh JWT API
│   │   │   ├── users.py         # User management CRUD API
│   │   │   ├── face.py          # Face Enrollment & FAISS index sync API
│   │   │   ├── recognition.py   # Live Recognition stream API
│   │   │   ├── liveness.py      # Liveness verification API
│   │   │   ├── emotion.py       # Emotion analysis API
│   │   │   ├── access.py       # Access Control Decision Pipeline API
│   │   │   ├── attendance.py    # Attendance analytics & today's log API
│   │   │   └── admin.py         # Admin dashboard summary & audit logs API
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py            # SQLAlchemy PostgreSQL models
│   │   ├── schemas.py           # Pydantic request/response schemas
│   │   ├── security.py          # Password hash & JWT token logic
│   │   └── main.py              # FastAPI application entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, Sidebar, WebcamFeed, StatCard, ProtectedRoute
│   │   ├── context/             # AuthContext
│   │   ├── pages/               # 10 Full Application Pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── FaceEnrollmentPage.jsx
│   │   │   ├── LiveRecognitionPage.jsx
│   │   │   ├── LivenessDetectionPage.jsx
│   │   │   ├── EmotionDetectionPage.jsx
│   │   │   ├── AttendanceDashboard.jsx
│   │   │   ├── AccessControlDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/            # Axios API Service bindings
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── DEPLOYMENT.md
└── README.md
```

---

## ⚡ Quick Start Guide (Local Development)

### 1. Run Backend (FastAPI)
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- API Documentation available at: `http://localhost:8000/docs`

### 2. Run Frontend (React Vite)
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Login Credentials
- **Admin**: `admin@faceguard.ai` | Password: `admin123`
- **User**: `alex@faceguard.ai` | Password: `user123`

---

## 🐳 Docker Deployment
```bash
docker-compose up --build -d
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`
