# Kredensial Login WiseTech

## Admin Credentials
- **Email**: `admin@wisetech.com`
- **Password**: `admin123`
- **Role**: Administrator (akses ke dashboard admin)

## Test User Credentials  
Anda dapat membuat user biasa melalui halaman Register, atau menggunakan sample users yang tersedia di database.

## Cara Login sebagai Admin:
1. Buka http://localhost:3000/login
2. Masukkan email: `admin@wisetech.com`
3. Masukkan password: `admin123`
4. Klik "Sign in"
5. Anda akan otomatis diarahkan ke dashboard admin di `/admin`

## Troubleshooting:
- Pastikan backend berjalan di port 8000
- Pastikan frontend berjalan di port 3000
- Periksa console browser untuk debug info
- Database harus sudah diinisialisasi dengan user admin

## Debug Info:
Login sebagai admin akan menampilkan console log berikut:
```
✅ Login successful: {user_data}
🔍 userInfo.is_admin: true
🔍 typeof userInfo.is_admin: boolean
🔧 Admin user detected, redirecting to admin dashboard
```
