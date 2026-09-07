// backend/controllers/usersController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/usersModel");
const produkModel = require("../models/produkModel");
const artikelModel = require("../models/artikelModel");
const pembelianModel = require("../models/pembelianModel");

/**
 * Registrasi user baru
 * Body: nama_d, nama_b, kelamin, lahir, alamat, phone, email, uname, passwd, foto
 */
const registerUser = async (req, res) => {
    try {
        const { nama_d, nama_b, kelamin, lahir, alamat, phone, email, uname, passwd, foto } = req.body;

        // Validasi wajib
        if (!nama_d || !nama_b || !email || !uname || !passwd) {
            return res.status(400).json({ error: "Semua field wajib diisi" });
        }

        // Cek email sudah terdaftar
        const existingEmail = await usersModel.findUserByEmail(email);
        if (existingEmail) {
            return res.status(409).json({ error: "Email sudah terdaftar" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPasswd = await bcrypt.hash(passwd, saltRounds);

        // Simpan user
        const result = await usersModel.createUser({
            nama_d,
            nama_b,
            kelamin: kelamin || "Laki-laki",
            lahir: lahir || "",
            alamat: alamat || "",
            phone: phone || 0,
            email,
            role: "pembeli",
            uname,
            passwd: hashedPasswd,
            foto: foto || "default.jpg",
        });

        res.status(201).json({
            message: "Registrasi berhasil",
            userId: result.insertId
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Login user
 * Body: credential (email atau username), passwd
 */
const loginUser = async (req, res) => {
    try {
        const { credential, passwd } = req.body;

        if (!credential || !passwd) {
            return res.status(400).json({ error: "Credential dan password wajib diisi" });
        }

        // Cari user berdasarkan email atau username
        const user = await usersModel.findUserByCredential(credential);
        if (!user) {
            return res.status(401).json({ error: "Credential atau password salah" });
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(passwd, user.passwd);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Credential atau password salah" });
        }

        // Buat JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Kirim response (tanpa password)
        const { passwd: _, ...userWithoutPassword } = user;
        res.status(200).json({
            message: "Login berhasil",
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Get profil user sendiri
 * GET /api/users/me
 * Butuh authenticate
 */
const getMyProfile = async (req, res) => {
    try {
        // User sudah ada di req.user dari middleware authenticate
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Update profil user sendiri
 * PUT /api/users/me
 * Body: nama_d, nama_b, kelamin, lahir, alamat, phone, email, foto, passwd_lama (opsional), passwd_baru (opsional)
 * Butuh authenticate
 */
const updateMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            nama_d, nama_b, kelamin, lahir, alamat, phone, email, foto,
            passwd_lama, passwd_baru 
        } = req.body;
        
        // Ambil data user saat ini
        const user = await usersModel.findUserByIdWithPasswd(userId);
        if (!user) {
            return res.status(404).json({ error: "User tidak ditemukan" });
        }
        
        // Jika ingin ganti password
        if (passwd_baru) {
            // Wajib sertakan password lama
            if (!passwd_lama) {
                return res.status(400).json({ error: "Password lama wajib diisi untuk mengganti password" });
            }

            if (!user.passwd) {
                return res.status(400).json({ error: "Password user tidak ditemukan" });
            }

            // Verifikasi password lama
            const isPasswordValid = await bcrypt.compare(passwd_lama, user.passwd);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Password lama salah" });
            }

            // Hash password baru
            const saltRounds = 10;
            const hashedNewPasswd = await bcrypt.hash(passwd_baru, saltRounds);

            // Update password di database
            const db = require("../config/db");
            await db.query(
                `UPDATE users SET passwd = ? WHERE id = ?`,
                [hashedNewPasswd, userId]
            );
        }

        // Cek email tidak bentrok (kecuali email sendiri)
        if (email && email !== user.email) {
            const existingEmail = await usersModel.findUserByEmail(email);
            if (existingEmail) {
                return res.status(409).json({ error: "Email sudah digunakan user lain" });
            }
        }

        // Update profil (tanpa password)
        await usersModel.updateUserProfile(userId, {
            nama_d: nama_d || user.nama_d,
            nama_b: nama_b || user.nama_b,
            kelamin: kelamin || user.kelamin,
            lahir: lahir || user.lahir,
            alamat: alamat || user.alamat,
            phone: phone || user.phone,
            email: email || user.email,
            foto: foto !== undefined ? foto : user.foto
        });

        // Ambil data terbaru
        const updatedUser = await usersModel.findUserById(userId);

        res.status(200).json({
            success: true,
            message: "Profil berhasil diupdate",
            data: updatedUser
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

// ==================== PRODUK (PUBLIC) ====================

/**
 * List semua produk (public)
 * GET /api/users/produk
 */
const listProduk = async (req, res) => {
    try {
        const produk = await produkModel.findAllProduk();
        res.status(200).json({
            success: true,
            data: produk
        });
    } catch (error) {
        console.error("List produk error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Get produk by ID (public)
 * GET /api/users/produk/:id_produk
 */
const getProdukById = async (req, res) => {
    try {
        const { id_produk } = req.params;
        const produk = await produkModel.findProdukById(id_produk);
        
        if (!produk) {
            return res.status(404).json({ error: "Produk tidak ditemukan" });
        }

        res.status(200).json({
            success: true,
            data: produk
        });
    } catch (error) {
        console.error("Get produk error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

// ==================== ARTIKEL (PUBLIC) ====================

/**
 * List semua artikel (public)
 * GET /api/users/artikel
 */
const listArtikelPublik = async (req, res) => {
    try {
        const artikel = await artikelModel.findAllArtikel();
        res.status(200).json({
            success: true,
            data: artikel
        });
    } catch (error) {
        console.error("List artikel error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Get artikel by ID (public)
 * GET /api/users/artikel/:id
 */
const getArtikelPublikById = async (req, res) => {
    try {
        const { id } = req.params;
        const artikel = await artikelModel.findArtikelById(id);
        
        if (!artikel) {
            return res.status(404).json({ error: "Artikel tidak ditemukan" });
        }

        res.status(200).json({
            success: true,
            data: artikel
        });
    } catch (error) {
        console.error("Get artikel error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

// ==================== DASHBOARD PEMBELI ====================

/**
 * Get dashboard pembeli (statistik + riwayat terbaru)
 * GET /api/users/dashboard
 * Butuh authenticate
 */
const getDashboard = async (req, res) => {
    try {
        const pembeliId = req.user.id;

        // Statistik pembelian
        const stats = await pembelianModel.getStatsByPembeliId(pembeliId);

        // Riwayat 5 pembelian terbaru
        const recentOrders = await pembelianModel.findPembelianByPembeliIdWithDetail(pembeliId);
        const latestOrders = recentOrders.slice(0, 5);

        res.status(200).json({
            success: true,
            data: {
                stats,
                recentOrders: latestOrders
            }
        });
    } catch (error) {
        console.error("Get dashboard error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

// ==================== CRUD PEMBELIAN ====================

/**
 * Create pembelian baru
 * POST /api/users/pembelian
 * Body: id_produk, nama_pembeli, alamat_pembeli, phone_pembeli, metode_pembayaran, catatan (opsional)
 * Butuh authenticate
 */
const createPembelian = async (req, res) => {
    try {
        const pembeliId = req.user.id;
        const { id_produk, nama_pembeli, alamat_pembeli, phone_pembeli, metode_pembayaran, catatan } = req.body;

        // Validasi wajib
        if (!id_produk || !nama_pembeli || !alamat_pembeli || !phone_pembeli || !metode_pembayaran) {
            return res.status(400).json({ 
                error: "id_produk, nama_pembeli, alamat_pembeli, phone_pembeli, dan metode_pembayaran wajib diisi" 
            });
        }

        // Validasi produk ada
        const produk = await produkModel.findProdukById(id_produk);
        if (!produk) {
            return res.status(404).json({ error: "Produk tidak ditemukan" });
        }

        // Validasi metode_pembayaran ENUM
        const validMetode = ['Bank Transfer', 'COD'];
        if (!validMetode.includes(metode_pembayaran)) {
            return res.status(400).json({ 
                error: `metode_pembayaran harus salah satu dari: ${validMetode.join(', ')}` 
            });
        }

        // Simpan pembelian
        const result = await pembelianModel.insertPembelian({
            id_pembeli: pembeliId,
            id_produk,
            nama_pembeli,
            alamat_pembeli,
            phone_pembeli,
            metode_pembayaran,
            pembayaran: 'Belum',
            pengiriman: 'JNT Express',
            status: 'Tertunda',
            catatan: catatan || null,
            foto_bukti: null
        });

        // Ambil pembelian yang baru dibuat
        const pembelianBaru = await pembelianModel.findPembelianById(result.insertId);

        res.status(201).json({
            success: true,
            message: "Pembelian berhasil dibuat",
            data: pembelianBaru
        });
    } catch (error) {
        console.error("Create pembelian error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * List pembelian milik sendiri
 * GET /api/users/pembelian
 * Butuh authenticate
 */
const listMyPembelian = async (req, res) => {
    try {
        const pembeliId = req.user.id;
        const pembelian = await pembelianModel.findPembelianByPembeliIdWithDetail(pembeliId);

        res.status(200).json({
            success: true,
            data: pembelian
        });
    } catch (error) {
        console.error("List my pembelian error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Get pembelian milik sendiri by ID
 * GET /api/users/pembelian/:id
 * Butuh authenticate
 */
const getMyPembelianById = async (req, res) => {
    try {
        const pembeliId = req.user.id;
        const { id } = req.params;

        // Cek pembelian ada dan milik user
        const pembelian = await pembelianModel.findPembelianByIdAndPembeliId(id, pembeliId);
        if (!pembelian) {
            return res.status(404).json({ error: "Pembelian tidak ditemukan atau bukan milik Anda" });
        }

        // Ambil detail lengkap
        const detailPembelian = await pembelianModel.findPembelianById(id);

        res.status(200).json({
            success: true,
            data: detailPembelian
        });
    } catch (error) {
        console.error("Get my pembelian error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMyProfile,
    updateMyProfile,
    listProduk,
    getProdukById,
    listArtikelPublik,
    getArtikelPublikById,
    getDashboard,
    createPembelian,
    listMyPembelian,
    getMyPembelianById
};