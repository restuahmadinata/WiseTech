# Cara Menjalankan Backend WiseTech

## Pendekatan Backend

Kami menyediakan dua implementasi backend:

1. **Implementasi FastAPI (Lengkap)** - Backend dengan arsitektur lengkap menggunakan FastAPI, SQLAlchemy, dan Pydantic
2. **Implementasi Flask (Sederhana)** - Backend sederhana menggunakan Flask dan SQLite langsung

## Cara Menjalankan

### Implementasi Flask (Sederhana, Direkomendasikan)

Untuk menjalankan versi sederhana:

```bash
cd backend
./run_simple.sh
```

Server akan berjalan di http://localhost:8000

### Implementasi FastAPI (Lengkap)

1. **Buat dan aktifkan virtual environment**

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Untuk Linux/Mac
   # atau
   venv\Scripts\activate  # Untuk Windows
   ```

2. **Instal dependensi**

   ```bash
   pip install -r requirements.txt
   ```

3. **Inisialisasi database dan jalankan server**

   ```bash
   # Jalankan script untuk inisialisasi database dan menjalankan server
   ./run_api.sh
   ```

   Atau, jika Anda ingin menjalankan langkah-langkahnya secara manual:

   ```bash
   # Inisialisasi database dengan data sampel
   python -m app.db.init_db
   
   # Jalankan server FastAPI
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Akses Swagger UI**

   Buka browser dan kunjungi:
   ```
   http://localhost:8000/docs
   ```
   
   Anda sekarang dapat melihat dan menguji semua endpoint API.

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

## Endpoint API

### Autentikasi
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Mendapatkan data user yang sedang login

### Gadget
- `GET /api/gadgets` - Mendapatkan daftar gadget dengan filter
- `GET /api/gadgets/search` - Mencari gadget
- `GET /api/gadgets/featured` - Mendapatkan gadget unggulan
- `GET /api/gadgets/{id}` - Mendapatkan detail gadget
- `GET /api/gadgets/{id}/reviews` - Mendapatkan ulasan untuk gadget
- `POST /api/gadgets` - Menambahkan gadget baru (admin only)
- `PUT /api/gadgets/{id}` - Memperbarui gadget (admin only)
- `DELETE /api/gadgets/{id}` - Menghapus gadget (admin only)

### Ulasan
- `GET /api/reviews/recent` - Mendapatkan ulasan terbaru
- `POST /api/reviews` - Menambahkan ulasan baru
- `PUT /api/reviews/{id}` - Memperbarui ulasan
- `DELETE /api/reviews/{id}` - Menghapus ulasan

### User
- `GET /api/users/profile` - Mendapatkan profil user
- `PUT /api/users/profile` - Memperbarui profil user
- `GET /api/users/{id}/activity` - Mendapatkan aktivitas user

### Admin
- `GET /api/admin/users` - Mendapatkan daftar semua user (admin only)
- `PUT /api/admin/users/{id}/activate` - Mengaktifkan user (admin only)
- `PUT /api/admin/users/{id}/deactivate` - Menonaktifkan user (admin only)
- `PUT /api/admin/reviews/{id}/approve` - Menyetujui ulasan (admin only)
- `PUT /api/admin/reviews/{id}/reject` - Menolak ulasan (admin only)
