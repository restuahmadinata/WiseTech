# WiseTech - Platform Ulasan Gadget

## Deskripsi Proyek

WiseTech adalah platform ulasan gadget modern yang memungkinkan pengguna untuk menjelajahi, mencari, dan memberikan ulasan tentang berbagai gadget seperti smartphone, laptop, dan tablet. Aplikasi ini menyediakan antarmuka pengguna yang menarik dan intuitif dengan desain modern dan berwarna.

## Struktur Proyek Frontend

```
src/
  App.css                 - CSS utama aplikasi
  App.js                  - Routing dan komponen utama 
  index.css               - CSS global
  index.js                - Entry point aplikasi React
  components/
    admin/
      AdminDashboard.js   - Dashboard admin dengan tab dan kartu statistik
    auth/
      Login.js            - Form login dengan animasi dan validasi
      Register.js         - Form registrasi dengan animasi dan validasi
    gadgets/
      GadgetDetail.js     - Halaman detail gadget dengan ulasan
      Laptops.js          - Daftar laptop dengan filter
      Search.js           - Pencarian gadget dengan filter
      Smartphones.js      - Daftar smartphone dengan filter
      Tablets.js          - Daftar tablet dengan filter
    home/
      Home.js             - Halaman beranda dengan gadget unggulan
    layout/
      Footer.js           - Footer dengan tautan dan media sosial
      Header.js           - Header dengan navigasi
      NotFound.js         - Halaman 404 dengan tautan navigasi
    user/
      UserProfile.js      - Profil pengguna dengan pengaturan dan aktivitas
```

## Petunjuk untuk Tim Backend

### Alur Kerja Aplikasi

1. **Otentikasi Pengguna**
   - Login: Pengguna memasukkan kredensial untuk masuk
   - Registrasi: Pengguna baru membuat akun
   - Autentikasi: Implementasikan JWT atau autentikasi berbasis session

2. **Halaman Beranda**
   - Menampilkan gadget unggulan dan ulasan terbaru
   - Endpoint API: GET /api/gadgets/featured dan GET /api/reviews/recent

3. **Kategori Gadget**
   - Smartphone, Laptop, dan Tablet dengan filter dan pencarian
   - Endpoint API: GET /api/gadgets?category=[category]&filters=[filters]

4. **Detail Gadget**
   - Informasi lengkap tentang gadget termasuk spesifikasi dan ulasan
   - Endpoint API: GET /api/gadgets/:id

5. **Ulasan**
   - Melihat dan menambahkan ulasan untuk gadget
   - Endpoint API: GET /api/gadgets/:id/reviews dan POST /api/reviews

6. **Profil Pengguna**
   - Mengelola informasi pengguna dan melihat aktivitas
   - Endpoint API: GET & PUT /api/users/profile

7. **Dashboard Admin**
   - Pengelolaan konten dan pengguna platform
   - Endpoint API: Berbagai endpoint /api/admin/...

### Kebutuhan API

Berikut adalah daftar API yang perlu diimplementasikan:

#### Autentikasi
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout
- GET /api/auth/me

#### Gadget
- GET /api/gadgets (dengan filter: category, brand, price, etc.)
- GET /api/gadgets/:id
- GET /api/gadgets/featured
- POST /api/gadgets (admin only)
- PUT /api/gadgets/:id (admin only)
- DELETE /api/gadgets/:id (admin only)

#### Ulasan
- GET /api/gadgets/:id/reviews
- GET /api/reviews/recent
- POST /api/reviews
- PUT /api/reviews/:id (pemilik atau admin)
- DELETE /api/reviews/:id (pemilik atau admin)

#### Pengguna
- GET /api/users/profile
- PUT /api/users/profile
- GET /api/users/:id/activity

#### Admin
- GET /api/admin/dashboard/stats
- GET /api/admin/users
- PUT /api/admin/users/:id
- GET /api/admin/reviews
- PUT /api/admin/reviews/:id

### Struktur Data

#### Gadget
```json
{
  "id": 1,
  "name": "iPhone 15 Pro",
  "brand": "Apple",
  "category": "Smartphones",
  "price": 999,
  "rating": 4.8,
  "image": "url-to-image",
  "releaseDate": "2023-09-22",
  "description": "The latest iPhone with enhanced camera capabilities and powerful A17 chip.",
  "specs": [
    { "name": "Display", "value": "6.1\" Super Retina XDR" },
    { "name": "Processor", "value": "A17 Pro chip" }
  ],
  "reviews": [
    {
      "id": 1,
      "userId": 123,
      "userName": "John Doe",
      "rating": 5,
      "comment": "This is an amazing device!",
      "date": "2023-10-15"
    }
  ]
}
```

#### User
```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "avatar": "url-to-avatar",
  "role": "user", // atau "admin"
  "joinDate": "2023-01-15",
  "bio": "Tech enthusiast",
  "preferences": {
    "notifications": true,
    "newsletter": true
  }
}
```

## Panduan Instalasi dan Menjalankan

### Prasyarat
- Node.js v16+ dan npm v7+
- Akun GitHub untuk akses repositori

### Instalasi
1. Clone repositori:
   ```
   git clone [url-repositori]
   cd wise-tech
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Jalankan aplikasi dalam mode development:
   ```
   npm start
   ```

4. Aplikasi akan berjalan di http://localhost:3000

### Build untuk Production
```
npm run build
```

## Teknologi yang Digunakan

- React.js - Framework frontend
- React Router - Routing
- Tailwind CSS - Styling
- Mock data saat ini - Akan digantikan dengan API backend

## Tim Pengembang

- Frontend Developer: [Nama Anda]
- Untuk pertanyaan tentang frontend: [email Anda]

## Lisensi

Hak Cipta © 2025 WiseTech. Semua hak dilindungi.

### Fitur Search

Aplikasi ini dilengkapi dengan fitur pencarian yang komprehensif:

1. **Search Bar di Header**
   - Tersedia di tampilan desktop dan mobile
   - Navigasi langsung ke halaman hasil pencarian
   - Integrasi dengan URL query parameter untuk bookmark hasil pencarian

2. **Halaman Search**
   - Filter berdasarkan kategori (Smartphones, Laptops, Tablets)
   - Tampilan hasil pencarian dengan kartu informasi
   - Pencarian di judul, merek, dan deskripsi gadget

3. **Endpoint Search API**
   - GET /api/search?q=[query]&category=[category]
   - Parameter:
     - q: Kata kunci pencarian (string)
     - category: Filter kategori (string: "all", "Smartphones", "Laptops", "Tablets")
   - Response: Array dari objek gadget dengan informasi ringkas

#### Penggunaan Search

1. Pengguna dapat mencari dari header pada tampilan desktop atau mobile
2. Query pencarian dikirim ke halaman Search dengan parameter URL
3. Halaman Search memproses query dan menampilkan hasil yang relevan
4. Pengguna dapat memfilter hasil berdasarkan kategori

```javascript
// Contoh integrasi search di komponen React
const handleSearch = (e) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  }
};
```
