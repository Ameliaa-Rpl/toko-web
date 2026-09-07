// backend/models/usersModel.js
const db = require("../config/db");

/**
 * Membuat user baru
 * @param {Object} userData - Data user
 * @returns {Promise<Object>} - Hasil insert
 */
const createUser = async (userData) => {
    const { nama_d, nama_b, kelamin, lahir, alamat, phone, email, role, uname, passwd, foto } = userData;
    const [result] = await db.query(
        `INSERT INTO users (nama_d, nama_b, kelamin, lahir, alamat, phone, email, role, uname, passwd, foto) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nama_d, nama_b, kelamin, lahir, alamat, phone, email, role, uname, passwd, foto]
    );
    return result;
};

/**
 * Cari user berdasarkan email
 * @param {string} email - Email user
 * @returns {Promise<Object|null>} - Data user atau null
 */
const findUserByEmail = async (email) => {
    const [rows] = await db.query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Cari user berdasarkan email atau username (untuk login)
 * @param {string} credential - Email atau username
 * @returns {Promise<Object|null>} - Data user atau null
 */
const findUserByCredential = async (credential) => {
    const [rows] = await db.query(
        `SELECT * FROM users WHERE email = ? OR uname = ?`,
        [credential, credential]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Cari user berdasarkan ID (tanpa password)
 * @param {number} id - ID user
 * @returns {Promise<Object|null>} - Data user atau null
 */
const findUserById = async (id) => {
    const [rows] = await db.query(
        `SELECT id, nama_d, nama_b, kelamin, lahir, alamat, phone, email, role, uname, foto, created_at, updated_at 
         FROM users WHERE id = ?`,
        [id]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Ambil hash password berdasarkan ID
 * @param {number} id - ID user
 * @returns {Promise<string|null>} - Hash password atau null
 */
const findPasswdHashById = async (id) => {
    const [rows] = await db.query(
        `SELECT passwd FROM users WHERE id = ?`,
        [id]
    );
    return rows.length > 0 ? rows[0].passwd : null;
};

/**
 * Update profil user
 * @param {number} id - ID user
 * @param {Object} userData - Data yang akan diupdate
 * @returns {Promise<Object>} - Hasil update
 */
const updateUserProfile = async (id, userData) => {
    const { nama_d, nama_b, kelamin, lahir, alamat, phone, email, foto } = userData;
    const [result] = await db.query(
        `UPDATE users 
         SET nama_d = ?, nama_b = ?, kelamin = ?, lahir = ?, alamat = ?, phone = ?, email = ?, foto = ?
         WHERE id = ?`,
        [nama_d, nama_b, kelamin, lahir, alamat, phone, email, foto, id]
    );
    return result;
};

/**
 * Cari user berdasarkan ID (dengan password)
 * @param {number} id - ID user
 * @returns {Promise<Object|null>} - Data user atau null
 */
const findUserByIdWithPasswd = async (id) => {
    const [rows] = await db.query(
        `SELECT * FROM users WHERE id = ?`,
        [id]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Hitung total pembeli (role = pembeli)
 * @returns {Promise<number>} - Total pembeli
 */
const countPembeli = async () => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total FROM users WHERE role = 'pembeli'`
    );
    return rows[0].total;
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserByCredential,
    findUserById,
    findUserByIdWithPasswd,
    findPasswdHashById,
    updateUserProfile,
    countPembeli
};