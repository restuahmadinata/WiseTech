"""
WiseTech Backend - Platform Ulasan Gadget API

API untuk mendukung aplikasi platform ulasan gadget WiseTech yang memungkinkan pengguna
menjelajahi, mencari, dan memberikan ulasan tentang berbagai gadget.

Endpoints:
- Auth: Login, register, dan validasi token
- Users: Manajemen profil pengguna
- Gadgets: Pencarian dan pengelolaan gadget berdasarkan kategori
- Reviews: Manajemen ulasan gadget
- Admin: Endpoint khusus admin untuk pengelolaan platform

Dibuat: Juni 2025
"""

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.api import auth, gadgets, users, reviews, admin
from app.core.config import settings
from app.db.session import engine, SessionLocal
from app.db.base_class import Base

# Buat tabel database jika belum ada
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="WiseTech API",
    description="API untuk platform ulasan gadget WiseTech",
    version="1.0.0"
)

# Konfigurasi CORS untuk komunikasi dengan frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Alamat frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency untuk mendapatkan database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint untuk health check
@app.get("/")
def health_check():
    return {"status": "API is running", "version": "1.0.0"}

# Tambahkan semua router API
app.include_router(auth.router, prefix="/api", tags=["authentication"])
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(gadgets.router, prefix="/api", tags=["gadgets"])
app.include_router(reviews.router, prefix="/api", tags=["reviews"])
app.include_router(admin.router, prefix="/api", tags=["admin"])

# Serve static files (uploaded images)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
