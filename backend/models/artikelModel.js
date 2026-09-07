// backend/models/artikelModel.js
const db = require("../config/db");

/**
 * Ambil semua artikel
 * @returns {Promise<Array>} - List artikel
 */
const findAllArtikel = async () => {
    const [rows] = await db.query(
        `SELECT * FROM artikel ORDER BY created_at DESC`
    );
    return rows;
};

/**
 * Cari artikel berdasarkan ID
 * @param {number} id - ID artikel
 * @returns {Promise<Object|null>} - Data artikel atau null
 */
const findArtikelById = async (id) => {
    const [rows] = await db.query(
        `SELECT * FROM artikel WHERE id = ?`,
        [id]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Tambah artikel baru
 * @param {Object} artikelData - Data artikel
 * @returns {Promise<Object>} - Hasil insert
 */
const insertArtikel = async (artikelData) => {
    const { judul, ringkasan, isi, gambar } = artikelData;
    const [result] = await db.query(
        `INSERT INTO artikel (judul, ringkasan, isi, gambar) 
         VALUES (?, ?, ?, ?)`,
        [judul, ringkasan, isi, gambar]
    );
    return result;
};

/**
 * Update artikel
 * @param {number} id - ID artikel
 * @param {Object} artikelData - Data yang diupdate
 * @returns {Promise<Object>} - Hasil update
 */
const updateArtikel = async (id, artikelData) => {
    const { judul, ringkasan, isi, gambar } = artikelData;
    const [result] = await db.query(
        `UPDATE artikel 
         SET judul = ?, ringkasan = ?, isi = ?, gambar = ?
         WHERE id = ?`,
        [judul, ringkasan, isi, gambar, id]
    );
    return result;
};

/**
 * Hapus artikel
 * @param {number} id - ID artikel
 * @returns {Promise<Object>} - Hasil delete
 */
const deleteArtikel = async (id) => {
    const [result] = await db.query(
        `DELETE FROM artikel WHERE id = ?`,
        [id]
    );
    return result;
};

module.exports = {
    findAllArtikel,
    findArtikelById,
    insertArtikel,
    updateArtikel,
    deleteArtikel
};