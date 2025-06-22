# 🚀 Panduan Lengkap Menjalankan WiseTech

WiseTech adalah platform ulasan gadget dengan backend FastAPI dan frontend React.

## 📋 Persyaratan Sistem

### Backend
- Python 3.8+
- MySQL Server 8.0+
- pip (Python package manager)

### Frontend  
- Node.js 16+
- npm atau yarn

## 🛠️ Setup Backend (FastAPI)

### 1. Install MySQL (jika belum ada)

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Windows:**
Download dan install dari [MySQL Official Site](https://dev.mysql.com/downloads/installer/)

### 2. Setup Database

```bash
cd backend
./setup_mysql.sh
```

Script ini akan:
- Membuat database `wisetech_db`
- Membuat file `.env` dari template

### 3. Konfigurasi Environment

Edit file `.env` dengan kredensial MySQL Anda:
```env
MYSQL_SERVER=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DB=wisetech_db
MYSQL_PORT=3306
```

### 4. Install Dependencies dan Jalankan Server

```bash
./run_api.sh
```

Script ini akan:
- Membuat virtual environment
- Install semua dependencies
- Inisialisasi database dengan data sample
- Menjalankan server di http://localhost:8000

### 5. Akses Swagger UI

Buka browser dan kunjungi:
```
http://localhost:8000/docs
```

## 🎨 Setup Frontend (React)

### 1. Install Dependencies

```bash
cd ../  # kembali ke root project
npm install
```

### 2. Jalankan Development Server

```bash
npm start
```

Frontend akan berjalan di:
```
http://localhost:3000
```

## 🌐 Akses Website

### 1. Backend API
- **Base URL:** http://localhost:8000
- **Swagger UI:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000

### 2. Frontend Website
- **Main Website:** http://localhost:3000

### 3. Demo Accounts

Setelah menjalankan backend, akun berikut tersedia:

**Admin:**
- Email: admin@wisetech.com
- Password: admin123

**Regular Users:**
- Email: john.doe@example.com, Password: password123
- Email: sarah.smith@example.com, Password: password123
- Email: michael.johnson@example.com, Password: password123

## 📱 Fitur Website

### Untuk Pengguna Umum:
1. **Beranda** - Lihat gadget unggulan dan ulasan terbaru
2. **Kategori** - Jelajahi smartphone, laptop, dan tablet
3. **Pencarian** - Cari gadget berdasarkan nama, brand, atau deskripsi
4. **Detail Gadget** - Lihat spesifikasi lengkap dan ulasan
5. **Login/Register** - Buat akun untuk memberikan ulasan
6. **Profil** - Kelola profil dan lihat aktivitas ulasan

### Untuk Admin:
1. **Dashboard Admin** - Kelola pengguna, gadget, dan ulasan
2. **Manajemen Gadget** - Tambah, edit, atau hapus gadget
3. **Moderasi Ulasan** - Setujui atau tolak ulasan
4. **Manajemen Pengguna** - Aktifkan atau nonaktifkan akun

## 🔧 Troubleshooting

### Backend Issues

**Error: ModuleNotFoundError**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Error: Database connection failed**
- Pastikan MySQL berjalan: `sudo systemctl status mysql`
- Periksa kredensial di file `.env`
- Pastikan database `wisetech_db` sudah dibuat

**Error: python-jose installation**
```bash
pip install 'python-jose[cryptography]'
```

### Frontend Issues

**Error: npm command not found**
- Install Node.js dari [nodejs.org](https://nodejs.org/)

**Error: Port 3000 already in use**
```bash
# Gunakan port lain
PORT=3001 npm start
```

**Error: API connection failed**
- Pastikan backend berjalan di http://localhost:8000
- Periksa CORS settings di backend

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user

### Gadgets
- `GET /api/gadgets` - List gadgets with filters
- `GET /api/gadgets/featured` - Featured gadgets
- `GET /api/gadgets/search` - Search gadgets
- `GET /api/gadgets/{id}` - Gadget details
- `GET /api/gadgets/{id}/reviews` - Gadget reviews

### Reviews
- `GET /api/reviews/recent` - Recent reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/{id}` - Update review
- `DELETE /api/reviews/{id}` - Delete review

### Users
- `GET /api/users/profile` - User profile
- `PUT /api/users/profile` - Update profile

### Admin
- `GET /api/admin/users` - List all users
- Various admin endpoints for management

## 🚀 Production Deployment

### Backend
```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend
```bash
# Build for production
npm run build

# Serve with nginx or any static file server
```

## 📞 Support

Jika mengalami masalah, periksa:
1. Log di terminal backend dan frontend
2. Browser console untuk error JavaScript
3. Network tab untuk gagal API calls
4. MySQL logs: `sudo tail -f /var/log/mysql/error.log`
