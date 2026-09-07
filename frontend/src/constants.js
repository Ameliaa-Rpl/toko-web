/**
 * constants.js — info toko (SITE), menu publik, enum form.
 */
export const SITE = {
  logo_toko: '/logo.png',
  nama_toko: 'Benang Senja',
  tentang:
    'Temukan koleksi produk rajut handmade dengan desain unik dan nyaman digunakan. Setiap produk dibuat dengan penuh perhatian untuk melengkapi gaya dan keseharianmu.',
  foto_banner: '/hero.jpg',
  alamat_toko: 'Jl. Merdeka No. 45, Kel. Melati, Kec. Sukamaju, Kab. Ponorogo, Jawa Timur 135246',
  email_toko: 'admin@benangsenja.study',
  tlp_toko: 6281234567,
  nama_bank_a: 'BCA',
  nama_bank_b: 'BRI',
  no_rek_a: 1234567890,
  no_rek_b: 9876543210,
  jam_buka: 8,
  jam_tutup: 20,
  link_wa: 'https://wa.me/08123456789',
  link_ig: 'https://www.instagram.com',
  link_fb: 'https://www.facebook.com',
};

export const PUBLIC_NAV = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/toko', label: 'Toko' },
  { to: '/artikel', label: 'Artikel' },
];

export const KELAMIN = ['Laki-laki', 'Perempuan'];
export const KATEGORI_PRODUK = ['Baju Rajut', 'Tas Rajut', 'Mainan Rajut', 'Aksesoris Rajut'];
export const METODE_BAYAR = ['Bank Transfer', 'COD'];
export const SHIPPING = ['JNT Express', 'JNE'];
export const STATUS_PROSES = ['Tertunda', 'Dikemas', 'Dikirim', 'Diterima', 'Selesai'];
export const STATUS_BAYAR = ['Belum', 'Dibayar'];


export const KATEGORI_DATA = [
  { 
    nama: 'Baju Rajut', 
    gambar: '/kat_baju.jpg'
  },
  { 
    nama: 'Tas Rajut', 
    gambar: '/kat_tas.jpg'
  },
  { 
    nama: 'Mainan Rajut',
    gambar: '/kat_mainan.jpg'
  },
  { 
    nama: 'Aksesoris Rajut',
    gambar: '/kat_aksesoris.jpg'
  },
];