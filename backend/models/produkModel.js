// backend/models/produkModel.js
const db = require("../config/db");

/**
 * Ambil semua produk
 * @returns {Promise<Array>} - List produk
 */
const findAllProduk = async () => {
    const [rows] = await db.query(
        `SELECT * FROM produk ORDER BY created_at DESC`
    );
    return rows;
};

/**
 * Cari produk berdasarkan ID
 * @param {number} id - ID produk
 * @returns {Promise<Object|null>} - Data produk atau null
 */
const findProdukById = async (id) => {
    const [rows] = await db.query(
        `SELECT * FROM produk WHERE id_produk = ?`,
        [id]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Tambah produk baru
 * @param {Object} produkData - Data produk
 * @returns {Promise<Object>} - Hasil insert
 */
const insertProduk = async (produkData) => {
    const { nama_produk, deskripsi, harga, gambar, kategori } = produkData;
    const [result] = await db.query(
        `INSERT INTO produk (nama_produk, deskripsi, harga, gambar, kategori) 
         VALUES (?, ?, ?, ?, ?)`,
        [nama_produk, deskripsi, harga, gambar || null, kategori || 'Baju Rajut']
    );
    return result;
};

/**
 * Update produk
 * @param {number} id - ID produk
 * @param {Object} produkData - Data yang diupdate
 * @returns {Promise<Object>} - Hasil update
 */
const updateProduk = async (id, produkData) => {
    const { nama_produk, deskripsi, harga, gambar, kategori } = produkData;
    const [result] = await db.query(
        `UPDATE produk 
         SET nama_produk = ?, deskripsi = ?, harga = ?, gambar = ?, kategori = ?
         WHERE id_produk = ?`,
        [nama_produk, deskripsi, harga, gambar || null, kategori, id]
    );
    return result;
};

/**
 * Hapus produk
 * @param {number} id - ID produk
 * @returns {Promise<Object>} - Hasil delete
 */
const deleteProduk = async (id) => {
    const [result] = await db.query(
        `DELETE FROM produk WHERE id_produk = ?`,
        [id]
    );
    return result;
};

module.exports = {
    findAllProduk,
    findProdukById,
    insertProduk,
    updateProduk,
    deleteProduk
};