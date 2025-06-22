# Profile Photo Feature Guide

## Fitur Upload Foto Profile

### ✅ Yang Sudah Dikerjakan

1. **Backend Setup**
   - Endpoint upload: `POST /api/users/profile/photo`
   - Endpoint delete: `DELETE /api/users/profile/photo`
   - Validasi file type: JPG, PNG, GIF
   - Validasi ukuran: Max 5MB
   - File disimpan di: `/backend/uploads/profile_photos/`
   - Static file serving: `http://localhost:8000/uploads/`

2. **Frontend Implementation**
   - Upload foto di halaman Profile (`/profile`)
   - Preview foto sebelum upload
   - Validasi client-side (type, size)
   - Error handling dan loading states
   - Delete foto profile

3. **Navbar Integration**
   - Foto profile tampil di navbar (desktop & mobile)
   - Fallback ke initial huruf nama jika tidak ada foto
   - Real-time update saat foto diupload/dihapus

### 🔧 Cara Menggunakan

1. **Upload Foto:**
   - Login ke aplikasi
   - Kunjungi halaman Profile (`/profile`)
   - Klik icon camera pada bagian "Profile Photo"
   - Pilih file gambar (JPG, PNG, GIF max 5MB)
   - Foto akan diupload otomatis dan preview akan muncul
   - Konfirmasi upload akan muncul

2. **Delete Foto:**
   - Di halaman Profile, klik tombol "Delete Photo" (jika ada foto)
   - Konfirmasi untuk menghapus
   - Foto akan dihapus dan fallback ke initial akan muncul

### 🎨 UI/UX Features

1. **Profile Page:**
   - Foto profile bulat dengan border gradien
   - Preview saat upload dengan loading animation
   - Fallback ke initial huruf nama dengan background gradien
   - Error handling dengan pesan yang jelas

2. **Navbar:**
   - Desktop: Foto profile kecil di pojok kanan atas
   - Mobile: Foto profile di menu hamburger
   - Dropdown menampilkan foto + info user
   - Hover effects dan smooth transitions

3. **Event System:**
   - Real-time update antara Profile page dan Navbar
   - Custom event `profileUpdated` untuk sinkronisasi
   - Debug logging untuk troubleshooting

### 🔍 Debug & Troubleshooting

1. **Console Logs:**
   ```javascript
   // Upload berhasil
   ✅ Photo uploaded successfully: {photo_url: "/uploads/..."}
   ✅ Header profile photo loaded: http://localhost:8000/uploads/...
   
   // Error upload
   ❌ Error uploading photo: Error message
   ❌ Failed to load profile photo: /uploads/...
   ```

2. **Common Issues:**
   - File tidak muncul: Cek console untuk error 404/403
   - Upload gagal: Cek ukuran file (<5MB) dan format (JPG/PNG/GIF)
   - Navbar tidak update: Cek event `profileUpdated` di console

### 📁 File Structure

```
backend/
├── uploads/profile_photos/     # Uploaded photos
├── app/api/users.py           # Upload/delete endpoints
└── app/schemas/user.py        # User schema with profile_photo

frontend/
├── src/components/user/UserProfile.js    # Upload interface
├── src/components/layout/Header.js       # Navbar with photo
└── src/utils/api.js                      # API calls
```

### 🐛 Known Issues & Fixes

1. **Database Error:** `no such column: users.profile_photo`
   - ✅ **Fixed:** Column sudah ada di database
   - Database menggunakan: `wisetech.db`

2. **Field Name Mismatch:**
   - ✅ **Fixed:** Backend return `photo_url`, frontend expect `profile_photo`
   - Backend sekarang return keduanya untuk compatibility

3. **Static File Serving:**
   - ✅ **Fixed:** FastAPI static files mounted di `/uploads`
   - URL format: `http://localhost:8000/uploads/profile_photos/{filename}`

### 🚀 Future Improvements

1. **Image Optimization:**
   - Resize gambar otomatis
   - Compress untuk performa
   - Multiple sizes (thumbnail, full)

2. **Better UX:**
   - Drag & drop upload
   - Crop tool
   - Multiple format support (WebP)

3. **Security:**
   - Virus scanning
   - Better file validation
   - Rate limiting untuk upload

### ✨ Final Status

**Status: ✅ WORKING**

- Upload foto profile: ✅ Working
- Delete foto profile: ✅ Working  
- Tampil di navbar: ✅ Working
- Tampil di profile page: ✅ Working
- Real-time update: ✅ Working
- Error handling: ✅ Working
- Debug logging: ✅ Working

**Test Completed:** June 21, 2025
