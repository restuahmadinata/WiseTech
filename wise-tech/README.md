# WiseTech - Platform Ulasan Gadget

## Deskripsi Proyek

WiseTech adalah platform ulasan gadget modern yang memungkinkan pengguna untuk menjelajahi, mencari, dan memberikan ulasan tentang berbagai gadget seperti smartphone, laptop, dan tablet. Aplikasi ini menyediakan antarmuka pengguna yang menarik dan intuitif dengan desain modern dan berwarna.

## Cara Menjalankan Proyek

### Menggunakan Docker Compose (Direkomendasikan)

1. Pastikan Docker dan Docker Compose terinstal di komputer Anda.
2. Clone repositori ini.
3. Jalankan aplikasi dengan Docker Compose:

```bash
docker-compose up
```

4. Akses:
   - Frontend: http://localhost:3000
   - API: http://localhost:8000
   - Swagger UI: http://localhost:8000/docs

### Menjalankan Secara Manual

#### Frontend (React)

1. Masuk ke direktori root proyek:

```bash
cd /path/to/WiseTech
```

2. Instal dependensi:

```bash
npm install
```

3. Jalankan aplikasi:

```bash
npm start
```

4. Akses frontend di http://localhost:3000

#### Backend (FastAPI)

1. Masuk ke direktori backend:

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
