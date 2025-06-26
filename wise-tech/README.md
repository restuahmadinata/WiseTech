# 🔥 WiseTech - Platform Review Gadget Modern

![WiseTech Banner](https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=WiseTech+-+Review+Gadget+Platform)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-repo/wisetech)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)](https://postgresql.org/)

## 🚀 Tentang WiseTech

WiseTech adalah platform web full-stack modern untuk review dan eksplorasi gadget teknologi. Dibangun dengan teknologi terdepan dan menerapkan best practices dalam security, performance, dan user experience.

### ✨ Fitur Utama

- 🔐 **Autentikasi Secure** - JWT authentication dengan role-based access
- 📱 **Catalog Gadget** - Browse smartphones, laptops, tablets, dan lainnya
- ⭐ **System Review** - Rating dan review dengan validasi ketat
- 👤 **User Management** - Profile management dengan upload foto
- 🛡️ **Admin Panel** - Dashboard lengkap untuk admin
- 🔍 **Advanced Search** - Pencarian dan filter multi-kriteria
- 📱 **Responsive Design** - UI modern dengan Tailwind CSS
- 🐳 **Docker Ready** - Containerized deployment

### 🛠️ Tech Stack

- **Frontend**: React 18 + Tailwind CSS + Axios
- **Backend**: FastAPI + SQLAlchemy + Pydantic
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Auth**: JWT Tokens + Bcrypt
- **Deployment**: Docker + Docker Compose
- **Testing**: pytest + Jest

---

## 📚 Dokumentasi Lengkap

**🔗 [BACA DOKUMENTASI LENGKAP](./docs/README_DOKUMENTASI.md)**

Dokumentasi WiseTech dibagi menjadi beberapa bagian untuk kemudahan navigasi:

| 📖 Dokumentasi                                                   | 📝 Deskripsi                              |
| ---------------------------------------------------------------- | ----------------------------------------- |
| **[📚 Overview Lengkap](./docs/README_DOKUMENTASI.md)**          | Panduan utama dan index semua dokumentasi |
| **[🏗️ Struktur API](./docs/STRUKTUR_API.md)**                    | Dokumentasi endpoint dan arsitektur API   |
| **[🗄️ Database & Models](./docs/DATABASE_MODELS.md)**            | Struktur database dan model data          |
| **[⚛️ Frontend Architecture](./docs/FRONTEND_ARCHITECTURE.md)**  | Arsitektur React dan component design     |
| **[🛡️ Validasi & Keamanan](./docs/VALIDASI_KEAMANAN.md)**        | Sistem security dan validasi              |
| **[🚀 Deployment & DevOps](./docs/DEPLOYMENT_DEVOPS.md)**        | Panduan deployment dan CI/CD              |
| **[🗺️ Code Location Map](./docs/CODE_LOCATION_MAP_DETAILED.md)** | Peta lokasi fitur dalam kode              |
| **[👤 User Guide](./docs/USER_GUIDE.md)**                        | Panduan penggunaan untuk end-user         |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ dan npm
- **Python** 3.10+
- **Docker** dan Docker Compose (recommended)

### 🐳 Menjalankan dengan Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/wisetech.git
cd wisetech

# Jalankan dengan Docker Compose
docker-compose up -d

# Access aplikasi
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### 🔧 Development Setup Manual

#### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Setup database dan seed data
python -c "from app.db.init_db import init_db; from app.db.session import SessionLocal; db = SessionLocal(); init_db(db); db.close()"
python seed_database.py

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend  # Kembali ke root, lalu masuk frontend

# Install dependencies
npm install

# Start development server
npm start

# Access: http://localhost:3000
```

### 🔑 Default Admin Account

```
Email: admin@wisetech.com
Password: AdminPass123
```

---

## 🧪 Testing

### Backend Testing

```bash
cd backend
python -m pytest tests/ -v
```

### Frontend Testing

```bash
cd frontend
npm test
```

---

## 📊 Features Overview

### 👤 User Features

- ✅ Registrasi dan login dengan validasi ketat
- ✅ Profile management dengan upload foto
- ✅ Browse gadget berdasarkan kategori
- ✅ Search dan filter advanced
- ✅ Review gadget dengan rating 1-5
- ✅ Edit/delete review milik sendiri
- ✅ Responsive design untuk mobile

### 🛡️ Admin Features

- ✅ Dashboard dengan statistik lengkap
- ✅ User management (view, delete)
- ✅ Gadget management (CRUD)
- ✅ Review moderation
- ✅ Advanced filtering dan search

### 🔒 Security Features

- ✅ JWT authentication dengan refresh
- ✅ Role-based authorization (user/admin)
- ✅ Input validation di frontend dan backend
- ✅ File upload security (type, size validation)
- ✅ Password hashing dengan bcrypt
- ✅ CORS protection
- ✅ Rate limiting ready

---

## 🏗️ Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React SPA     │────▶│   FastAPI       │────▶│   PostgreSQL    │
│   (Frontend)    │     │   (Backend)     │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
   Tailwind CSS            SQLAlchemy ORM           Indexed Tables
   Component-based         Pydantic Schemas         Optimized Queries
   State Management        JWT Authentication       Connection Pooling
```

---

## 📱 Screenshots

### Homepage

![Homepage](https://via.placeholder.com/600x400/F3F4F6/1F2937?text=WiseTech+Homepage)

### Gadget Detail & Reviews

![Gadget Detail](https://via.placeholder.com/600x400/EBF8FF/1E40AF?text=Gadget+Detail+%26+Reviews)

### Admin Dashboard

![Admin Dashboard](https://via.placeholder.com/600x400/F0FDF4/15803D?text=Admin+Dashboard)

---

## 🤝 Contributing

Kami sangat terbuka untuk kontribusi! Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan detail.

### Development Workflow

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 Changelog

### v1.0.0 (Current)

- ✅ Initial release dengan core features
- ✅ Complete user authentication system
- ✅ Gadget catalog dengan search/filter
- ✅ Review system dengan rating
- ✅ Admin panel lengkap
- ✅ File upload dengan security validation
- ✅ Responsive UI dengan Tailwind CSS
- ✅ Docker deployment ready
- ✅ Comprehensive documentation

### 🔮 Roadmap v1.1.0

- 🔄 Email notifications untuk review
- 🔄 Social login (Google, GitHub)
- 🔄 Advanced analytics dashboard
- 🔄 Mobile app (React Native)
- 🔄 Performance optimizations
- 🔄 Multi-language support

---

## 📞 Support & Contact

- 📖 **Documentation**: [docs/README_DOKUMENTASI.md](./docs/README_DOKUMENTASI.md)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/wisetech/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/wisetech/discussions)
- 📧 **Email**: admin@wisetech.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Terima kasih kepada semua teknologi open source yang membuat WiseTech possible:

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://reactjs.org/) - UI library for building interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [SQLAlchemy](https://sqlalchemy.org/) - Python SQL toolkit
- [Docker](https://docker.com/) - Containerization platform

---

**Made with ❤️ by WiseTech Team**

⭐ **Star this repo if you find it helpful!**

```bash
cd /path/to/WiseTech/backend
```

2. Buat dan aktifkan virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # Untuk Linux/Mac
# atau
venv\Scripts\activate  # Untuk Windows
```

3. Instal dependensi:

```bash
pip install -r requirements.txt
```

4. Jalankan aplikasi:

```bash
./run_api.sh
```

5. Akses API di http://localhost:8000 dan Swagger UI di http://localhost:8000/docs

## Akun Demo

Setelah menjalankan script inisialisasi database, akun berikut akan tersedia:

- **Admin**

  - Email: admin@wisetech.com
  - Password: admin123

- **User**
  - Email: john.doe@example.com
  - Password: password123
  - Email: sarah.smith@example.com
  - Password: password123

## Fitur Utama

- **Autentikasi pengguna**: Register, login, dan profil pengguna dengan username dan foto profil
- **Eksplorasi gadget**: Browse dan filter berdasarkan kategori (Smartphones, Laptops, Tablets)
- **Detail gadget**: Informasi lengkap dan spesifikasi
- **Sistem ulasan**: Baca, tulis, edit, dan hapus ulasan gadget
- **Dashboard admin**: Kelola pengguna, gadget, dan ulasan dengan fitur advanced
- **Upload foto profil**: Upload, preview, dan kelola foto profil pengguna
- **Search & filter**: Pencarian global dan filter advanced
- **Real-time updates**: Update dashboard admin secara real-time
- **Export data**: Export data admin ke CSV

## Panduan Pengguna

Untuk panduan lengkap penggunaan aplikasi, lihat [User Guide](docs/USER_GUIDE.md) yang mencakup:

- Cara registrasi dan login
- Navigasi dan pencarian gadget
- Menulis dan mengelola review
- Upload dan mengelola foto profil
- Fitur admin dashboard
- Troubleshooting dan tips

## Dokumentasi Tambahan

- [Profile Photo Guide](docs/PROFILE_PHOTO_GUIDE.md) - Panduan khusus fitur foto profil
- [User Guide](docs/USER_GUIDE.md) - Panduan lengkap pengguna

## Teknologi yang Digunakan

### Frontend

- React.js
- Tailwind CSS
- React Router DOM

### Backend

- FastAPI
- SQLAlchemy (ORM)
- Pydantic (Validasi data)
- JWT (Autentikasi)
- SQLite (Database)
