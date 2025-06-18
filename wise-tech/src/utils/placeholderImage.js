/**
 * Utility untuk menghasilkan placeholder gambar lokal untuk menghindari ketergantungan pada layanan eksternal
 * 
 * Fungsi ini menghasilkan string data URL SVG yang dapat digunakan sebagai placeholder image
 * tanpa memerlukan koneksi jaringan ke layanan eksternal seperti placehold.co
 * 
 * @param {string} text - Teks yang akan ditampilkan di gambar placeholder
 * @param {string} bgColor - Warna latar belakang (hex code tanpa #)
 * @param {string} textColor - Warna teks (hex code tanpa #)
 * @param {number} width - Lebar gambar dalam piksel
 * @param {number} height - Tinggi gambar dalam piksel
 * @returns {string} Data URL SVG yang dapat digunakan sebagai src untuk tag <img>
 */
export const generatePlaceholder = (text, bgColor = '4F46E5', textColor = 'FFFFFF', width = 300, height = 200) => {
  // Encode text for SVG
  const encodedText = text.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  // Create SVG
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
            fill="#${textColor}" text-anchor="middle" dominant-baseline="middle">${encodedText}</text>
    </svg>
  `;

  // Convert to base64 data URL
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Menghasilkan gambar placeholder yang konsisten untuk produk berdasarkan id
 * 
 * @param {string} productName - Nama produk untuk ditampilkan di placeholder
 * @param {number} id - ID produk (digunakan untuk memvariasikan warna)
 * @returns {string} URL gambar placeholder
 */
export const getProductPlaceholder = (productName, id) => {
  // Array of background colors to cycle through based on ID
  const bgColors = ['4F46E5', '7C3AED', 'EC4899', 'F59E0B', '10B981', '3B82F6'];
  const bgColor = bgColors[id % bgColors.length];
  
  return generatePlaceholder(productName, bgColor, 'FFFFFF');
};
