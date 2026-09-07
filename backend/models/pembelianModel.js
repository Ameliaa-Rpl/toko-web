// backend/models/pembelianModel.js
const db = require("../config/db");

/**
 * Ambil semua pembelian dengan detail user dan produk (untuk admin)
 * @returns {Promise<Array>} - List pembelian dengan detail
 */
const findAllPembelianWithDetail = async () => {
    const [rows] = await db.query(
        `SELECT p.*, 
         u.nama_d AS user_nama, u.email AS user_email, u.phone AS user_phone,
         pr.nama_produk, pr.harga AS produk_harga, pr.gambar AS produk_gambar
         FROM pembelian p
         LEFT JOIN users u ON p.id_pembeli = u.id
         LEFT JOIN produk pr ON p.id_produk = pr.id_produk
         ORDER BY p.created_at DESC`
    );
    return rows;
};

/**
 * Cari pembelian berdasarkan ID dengan detail
 * @param {number} id - ID pembelian
 * @returns {Promise<Object|null>} - Data pembelian atau null
 */
const findPembelianById = async (id) => {
    const [rows] = await db.query(
        `SELECT p.*, 
         u.nama_d AS user_nama, u.email AS user_email, u.phone AS user_phone,
         pr.nama_produk, pr.harga AS produk_harga, pr.gambar AS produk_gambar
         FROM pembelian p
         LEFT JOIN users u ON p.id_pembeli = u.id
         LEFT JOIN produk pr ON p.id_produk = pr.id_produk
         WHERE p.id = ?`,
        [id]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Update pembelian
 * @param {number} id - ID pembelian
 * @param {Object} data - Data yang diupdate
 * @returns {Promise<Object>} - Hasil update
 */
const updatePembelian = async (id, data) => {
    const { metode_pembayaran, pembayaran, pengiriman, status, catatan, foto_bukti } = data;
    const [result] = await db.query(
        `UPDATE pembelian 
         SET metode_pembayaran = ?, pembayaran = ?, pengiriman = ?, 
             status = ?, catatan = ?, foto_bukti = ?
         WHERE id = ?`,
        [metode_pembayaran, pembayaran, pengiriman, status, catatan, foto_bukti, id]
    );
    return result;
};

/**
 * Hapus pembelian
 * @param {number} id - ID pembelian
 * @returns {Promise<Object>} - Hasil delete
 */
const deletePembelian = async (id) => {
    const [result] = await db.query(
        `DELETE FROM pembelian WHERE id = ?`,
        [id]
    );
    return result;
};

/**
 * Tambah pembelian baru
 * @param {Object} data - Data pembelian
 * @returns {Promise<Object>} - Hasil insert
 */
const insertPembelian = async (data) => {
    const { 
        id_pembeli, id_produk, nama_pembeli, alamat_pembeli, phone_pembeli,
        metode_pembayaran, pembayaran, pengiriman, status, catatan, foto_bukti 
    } = data;
    const [result] = await db.query(
        `INSERT INTO pembelian 
         (id_pembeli, id_produk, nama_pembeli, alamat_pembeli, phone_pembeli,
          metode_pembayaran, pembayaran, pengiriman, status, catatan, foto_bukti) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_pembeli, id_produk, nama_pembeli, alamat_pembeli, phone_pembeli,
         metode_pembayaran, pembayaran, pengiriman, status, catatan, foto_bukti]
    );
    return result;
};

/**
 * Ambil pembelian berdasarkan ID pembeli dengan detail
 * @param {number} pembeliId - ID pembeli
 * @returns {Promise<Array>} - List pembelian
 */
const findPembelianByPembeliIdWithDetail = async (pembeliId) => {
    const [rows] = await db.query(
        `SELECT p.*, pr.nama_produk, pr.harga AS produk_harga, pr.gambar AS produk_gambar
         FROM pembelian p
         LEFT JOIN produk pr ON p.id_produk = pr.id_produk
         WHERE p.id_pembeli = ?
         ORDER BY p.created_at DESC`,
        [pembeliId]
    );
    return rows;
};

/**
 * Cari pembelian berdasarkan ID dan ID pembeli (untuk verifikasi kepemilikan)
 * @param {number} id - ID pembelian
 * @param {number} pembeliId - ID pembeli
 * @returns {Promise<Object|null>} - Data pembelian atau null
 */
const findPembelianByIdAndPembeliId = async (id, pembeliId) => {
    const [rows] = await db.query(
        `SELECT * FROM pembelian WHERE id = ? AND id_pembeli = ?`,
        [id, pembeliId]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Statistik pembelian per pembeli
 * @param {number} pembeliId - ID pembeli
 * @returns {Promise<Object>} - Statistik pembelian
 */
const getStatsByPembeliId = async (pembeliId) => {
    const [rows] = await db.query(
        `SELECT 
         COUNT(*) AS total_pesanan,
         SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) AS selesai,
         SUM(CASE WHEN status = 'Diterima' THEN 1 ELSE 0 END) AS diterima,
         SUM(CASE WHEN status = 'Dikirim' THEN 1 ELSE 0 END) AS dikirim,
         SUM(CASE WHEN status = 'Dikemas' THEN 1 ELSE 0 END) AS dikemas,
         SUM(CASE WHEN status = 'Tertunda' THEN 1 ELSE 0 END) AS tertunda
         FROM pembelian
         WHERE id_pembeli = ?`,
        [pembeliId]
    );
    return rows[0] || { total_pesanan: 0, selesai: 0, diterima: 0, dikirim: 0, dikemas: 0, tertunda: 0 };
};

/**
 * Statistik admin (semua pembelian)
 * @returns {Promise<Object>} - Statistik semua pembelian
 */
const getAdminStats = async () => {
    const [rows] = await db.query(
        `SELECT 
         COUNT(*) AS total_pesanan,
         SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) AS selesai,
         SUM(CASE WHEN status = 'Diterima' THEN 1 ELSE 0 END) AS diterima,
         SUM(CASE WHEN status = 'Dikirim' THEN 1 ELSE 0 END) AS dikirim,
         SUM(CASE WHEN status = 'Dikemas' THEN 1 ELSE 0 END) AS dikemas,
         SUM(CASE WHEN status = 'Tertunda' THEN 1 ELSE 0 END) AS tertunda,
         SUM(CASE WHEN pembayaran = 'Belum' THEN 1 ELSE 0 END) AS belum_bayar,
         SUM(CASE WHEN pembayaran = 'Dibayar' THEN 1 ELSE 0 END) AS sudah_bayar,
         SUM(CASE WHEN p.pembayaran = 'Dibayar' THEN pr.harga ELSE 0 END) AS total_pendapatan
         FROM pembelian p
         LEFT JOIN produk pr ON p.id_produk = pr.id_produk`
    );
    return rows[0] || { 
        total_pesanan: 0, selesai: 0, diterima: 0, dikirim: 0, 
        dikemas: 0, tertunda: 0, belum_bayar: 0, sudah_bayar: 0, 
        total_pendapatan: 0 
    };
};

/**
 * Ambil pembelian terbaru (untuk dashboard)
 * @param {number} limit - Jumlah data yang diambil
 * @returns {Promise<Array>} - List pembelian terbaru
 */
const getRecentPembelian = async (limit = 5) => {
    const [rows] = await db.query(
        `SELECT p.*, u.nama_d AS user_nama, pr.nama_produk, pr.harga AS produk_harga
         FROM pembelian p
         LEFT JOIN users u ON p.id_pembeli = u.id
         LEFT JOIN produk pr ON p.id_produk = pr.id_produk
         ORDER BY p.created_at DESC
         LIMIT ?`,
        [limit]
    );
    return rows;
};

/**
 * Hitung total produk terjual (dari semua pesanan)
 * @returns {Promise<number>} - Total produk terjual
 */
const getTotalTerjual = async () => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total FROM pembelian`
    );
    return rows[0].total || 0;
};

module.exports = {
    findAllPembelianWithDetail,
    findPembelianById,
    updatePembelian,
    deletePembelian,
    insertPembelian,
    findPembelianByPembeliIdWithDetail,
    findPembelianByIdAndPembeliId,
    getStatsByPembeliId,
    getAdminStats,
    getRecentPembelian,
    getTotalTerjual
};