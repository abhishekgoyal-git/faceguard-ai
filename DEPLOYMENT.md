# FaceGuard AI: Production Deployment Guide

This guide details step-by-step instructions for deploying FaceGuard AI in production environments (Ubuntu/Debian Linux, Docker, Nginx, PostgreSQL).

---

## 1. Prerequisites
- Linux Server (Ubuntu 22.04 LTS recommended)
- Docker & Docker Compose installed
- Domain Name configured with DNS A-Record pointing to server IP

---

## 2. Docker Production Deployment

### Step 1: Clone Repository & Configure Environment Variables
```bash
git clone https://github.com/your-org/faceguard-ai.git
cd faceguard-ai/backend
cp .env.example .env
```

Edit `.env` and set strong production keys:
```env
SECRET_KEY="generate-strong-random-64-character-hex-key"
DATABASE_URL="postgresql://faceguard_user:your_secure_db_password@postgres:5432/faceguard_db"
```

### Step 2: Build & Start Container Fleet
```bash
cd ..
docker-compose up --build -d
```

Verify running containers:
```bash
docker ps
```

---

## 3. Nginx Reverse Proxy with SSL (Certbot)

Install Nginx & Certbot on host server:
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

Create `/etc/nginx/sites-available/faceguard`:
```nginx
server {
    server_name faceguard.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable site & obtain SSL Certificate:
```bash
sudo ln -s /etc/nginx/sites-available/faceguard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d faceguard.yourdomain.com
```

---

## 4. Production Database Backups

Cron job for daily PostgreSQL automated backup:
```bash
0 2 * * * docker exec faceguard_db pg_dump -U faceguard_user faceguard_db > /backups/faceguard_$(date +\%Y\%m\%d).sql
```
