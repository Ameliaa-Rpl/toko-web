// backend/controllers/adminController.js
const produkModel = require("../models/produkModel");
const usersModel = require("../models/usersModel");
const artikelModel = require("../models/artikelModel");
const pembelianModel = require("../models/pembelianModel");
const bcrypt = require("bcrypt");
const fs = require('fs');
const path = require('path');

// ==================== CRUD PRODUK ====================

/**
 * List semua produk
 * GET /api/admin/produk
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
 * Get produk by ID
 * GET /api/admin/produk/:id
 */
const getProdukById = async (req, res) => {
    try {
        const { id } = req.params;
        const produk = await produkModel.findProdukById(id);
        
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

/**
 * Create produk baru
 * POST /api/admin/produk
 * Body: nama_produk, deskripsi, harga, gambar (opsional), kategori
 */
const createProduk = async (req, res) => {
    try {
        const { nama_produk, deskripsi, harga, gambar, kategori } = req.body;

        // Validasi wajib
        if (!nama_produk || !deskripsi || !harga) {
            return res.status(400).json({ 
                error: "nama_produk, deskripsi, dan harga wajib diisi" 
            });
        }

        // Validasi kategori ENUM
        const validKategori = ['Baju Rajut', 'Tas Rajut', 'Mainan Rajut', 'Aksesoris Rajut'];
        if (kategori && !validKategori.includes(kategori)) {
            return res.status(400).json({ 
                error: `Kategori harus salah satu dari: ${validKategori.join(', ')}` 
            });
        }

        // Simpan produk
        const result = await produkModel.insertProduk({
            nama_produk,
            deskripsi,
            harga: parseInt(harga),
            gambar: gambar || null,
            kategori: kategori || 'Baju Rajut'
        });

        // Ambil produk yang baru dibuat
        const produkBaru = await produkModel.findProdukById(result.insertId);

        res.status(201).json({
            success: true,
            message: "Produk berhasil ditambahkan",
            data: produkBaru
        });
    } catch (error) {
        console.error("Create produk error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Update produk
 * PUT /api/admin/produk/:id
 * Body: nama_produk, deskripsi, harga, gambar (opsional), kategori
 */
const updateProduk = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_produk, deskripsi, harga, gambar, kategori } = req.body;

        // Cek produk ada
        const produk = await produkModel.findProdukById(id);
        if (!produk) {
            return res.status(404).json({ error: "Produk tidak ditemukan" });
        }

        // Validasi kategori ENUM
        const validKategori = ['Baju Rajut', 'Tas Rajut', 'Mainan Rajut', 'Aksesoris Rajut'];
        if (kategori && !validKategori.includes(kategori)) {
            return res.status(400).json({ 
                error: `Kategori harus salah satu dari: ${validKategori.join(', ')}` 
            });
        }

        // Update produk
        await produkModel.updateProduk(id, {
            nama_produk: nama_produk || produk.nama_produk,
            deskripsi: deskripsi || produk.deskripsi,
            harga: harga ? parseInt(harga) : produk.harga,
            gambar: gambar !== undefined ? gambar : produk.gambar,
            kategori: kategori || produk.kategori
        });

        // Ambil produk yang sudah diupdate
        const produkUpdated = await produkModel.findProdukById(id);

        res.status(200).json({
            success: true,
            message: "Produk berhasil diupdate",
            data: produkUpdated
        });
    } catch (error) {
        console.error("Update produk error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Delete produk
 * DELETE /api/admin/produk/:id
 */
const deleteProduk = async (req, res) => {
    try {
        const { id } = req.params;

        // Cek produk ada
        const produk = await produkModel.findProdukById(id);
        if (!produk) {
            return res.status(404).json({ error: "Produk tidak ditemukan" });
        }

        // Hapus produk
        await produkModel.deleteProduk(id);

        res.status(200).json({
            success: true,
            message: "Produk berhasil dihapus"
        });
    } catch (error) {
        console.error("Delete produk error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

// ==================== CRUD PEMBELI/USERS ====================

/**
 * List semua pembeli (role = pembeli)
 * GET /api/admin/pembeli
 */
const listPembeli = async (req, res) => {
    try {
        const [rows] = await require("../config/db").query(
            `SELECT id, nama_d, nama_b, kelamin, lahir, alamat, phone, email, uname, foto, created_at, updated_at 
             FROM users WHERE role = 'pembeli' ORDER BY created_at DESC`
        );
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("List pembeli error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Get pembeli by ID
 * GET /api/admin/pembeli/:id
 */
const getPembeliById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await usersModel.findUserById(id);
        
        if (!user) {
            return res.status(404).json({ error: "User tidak ditemukan" });
        }

        if (user.role !== 'pembeli') {
            return res.status(400).json({ error: "User bukan pembeli" });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("Get pembeli error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Create pembeli baru
 * POST /api/admin/pembeli
 * Body: nama_d, nama_b, kelamin, lahir, alamat, phone, email, uname, passwd, foto (opsional)
 */
const createPembeli = async (req, res) => {
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

        // Simpan user dengan role pembeli
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
            foto: foto || "default.jpg"
        });

        const userBaru = await usersModel.findUserById(result.insertId);

        res.status(201).json({
            success: true,
            message: "Pembeli berhasil ditambahkan",
            data: userBaru
        });
    } catch (error) {
        console.error("Create pembeli error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Update pembeli
 * PUT /api/admin/pembeli/:id
 * Body: nama_d, nama_b, kelamin, lahir, alamat, phone, email, foto (opsional)
 */
const updatePembeli = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_d, nama_b, kelamin, lahir, alamat, phone, email, foto } = req.body;

        // Cek user ada
        const user = await usersModel.findUserById(id);
        if (!user) {
            return res.status(404).json({ error: "User tidak ditemukan" });
        }

        if (user.role !== 'pembeli') {
            return res.status(400).json({ error: "User bukan pembeli" });
        }

        // Cek email tidak bentrok (kecuali email sendiri)
        if (email && email !== user.email) {
            const existingEmail = await usersModel.findUserByEmail(email);
            if (existingEmail) {
                return res.status(409).json({ error: "Email sudah digunakan user lain" });
            }
        }

        // Update user
        await usersModel.updateUserProfile(id, {
            nama_d: nama_d || user.nama_d,
            nama_b: nama_b || user.nama_b,
            kelamin: kelamin || user.kelamin,
            lahir: lahir || user.lahir,
            alamat: alamat || user.alamat,
            phone: phone || user.phone,
            email: email || user.email,
            foto: foto !== undefined ? foto : user.foto
        });

        const userUpdated = await usersModel.findUserById(id);

        res.status(200).json({
            success: true,
            message: "Pembeli berhasil diupdate",
            data: userUpdated
        });
    } catch (error) {
        console.error("Update pembeli error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Delete pembeli
 * DELETE /api/admin/pembeli/:id
 */
const deletePembeli = async (req, res) => {
    try {
        const { id } = req.params;

        // Cek user ada
        const user = await usersModel.findUserById(id);
        if (!user) {
            return res.status(404).json({ error: "User tidak ditemukan" });
        }

        if (user.role !== 'pembeli') {
            return res.status(400).json({ error: "User bukan pembeli" });
        }

        // Hapus user
        const db = require("../config/db");
        await db.query(`DELETE FROM users WHERE id = ?`, [id]);

        res.status(200).json({
            success: true,
            message: "Pembeli berhasil dihapus"
        });
    } catch (error) {
        console.error("Delete pembeli error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

// ==================== CRUD ARTIKEL ====================

/**
 * List semua artikel
 * GET /api/admin/artikel
 */
const listArtikel = async (req, res) => {
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
 * Get artikel by ID
 * GET /api/admin/artikel/:id
 */
const getArtikelById = async (req, res) => {
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

/**
 * Create artikel baru
 * POST /api/admin/artikel
 * Body: judul, ringkasan, isi, gambar
 */
const createArtikel = async (req, res) => {
    try {
        const { judul, ringkasan, isi, gambar } = req.body;

        // Validasi wajib
        if (!judul || !ringkasan || !isi || !gambar) {
            return res.status(400).json({ 
                error: "judul, ringkasan, isi, dan gambar wajib diisi" 
            });
        }

        // Simpan artikel
        const result = await artikelModel.insertArtikel({
            judul,
            ringkasan,
            isi,
            gambar
        });

        // Ambil artikel yang baru dibuat
        const artikelBaru = await artikelModel.findArtikelById(result.insertId);

        res.status(201).json({
            success: true,
            message: "Artikel berhasil ditambahkan",
            data: artikelBaru
        });
    } catch (error) {
        console.error("Create artikel error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Update artikel
 * PUT /api/admin/artikel/:id
 * Body: judul, ringkasan, isi, gambar
 */
const updateArtikel = async (req, res) => {
    try {
        const { id } = req.params;
        const { judul, ringkasan, isi, gambar } = req.body;

        // Cek artikel ada
        const artikel = await artikelModel.findArtikelById(id);
        if (!artikel) {
            return res.status(404).json({ error: "Artikel tidak ditemukan" });
        }

        // Update artikel
        await artikelModel.updateArtikel(id, {
            judul: judul || artikel.judul,
            ringkasan: ringkasan || artikel.ringkasan,
            isi: isi || artikel.isi,
            gambar: gambar || artikel.gambar
        });

        // Ambil artikel yang sudah diupdate
        const artikelUpdated = await artikelModel.findArtikelById(id);

        res.status(200).json({
            success: true,
            message: "Artikel berhasil diupdate",
            data: artikelUpdated
        });
    } catch (error) {
        console.error("Update artikel error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Delete artikel
 * DELETE /api/admin/artikel/:id
 */
const deleteArtikel = async (req, res) => {
    try {
        const { id } = req.params;

        // Cek artikel ada
        const artikel = await artikelModel.findArtikelById(id);
        if (!artikel) {
            return res.status(404).json({ error: "Artikel tidak ditemukan" });
        }

        // Hapus artikel
        await artikelModel.deleteArtikel(id);

        res.status(200).json({
            success: true,
            message: "Artikel berhasil dihapus"
        });
    } catch (error) {
        console.error("Delete artikel error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

// ==================== STATISTIK ====================

/**
 * Get statistik dashboard admin
 * GET /api/admin/stats
 */
const getStats = async (req, res) => {
    try {
        const stats = await pembelianModel.getAdminStats();
        const recentOrders = await pembelianModel.getRecentPembelian(5);
        const totalProduk = await produkModel.findAllProduk();
        const totalArtikel = await artikelModel.findAllArtikel();
        const totalPembeli = await usersModel.countPembeli();
        const totalTerjual = await pembelianModel.getTotalTerjual();

        res.status(200).json({
            success: true,
            data: {
                // Statistik pembelian
                total_pesanan: stats.total_pesanan || 0,
                selesai: stats.selesai || 0,
                diterima: stats.diterima || 0,
                dikirim: stats.dikirim || 0,
                dikemas: stats.dikemas || 0,
                tertunda: stats.tertunda || 0,
                belum_bayar: stats.belum_bayar || 0,
                sudah_bayar: stats.sudah_bayar || 0,
                total_pendapatan: stats.total_pendapatan || 0,
                
                // Statistik tambahan
                total_produk: totalProduk.length || 0,
                total_artikel: totalArtikel.length || 0,
                total_pembeli: totalPembeli || 0,
                total_terjual: totalTerjual || 0,
                
                // Transaksi terbaru
                recentOrders: recentOrders || []
            }
        });
    } catch (error) {
        console.error("Get stats error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

// ==================== CRUD PEMBELIAN ====================

/**
 * List semua pembelian
 * GET /api/admin/pembelian
 */
const listPembelian = async (req, res) => {
    try {
        const pembelian = await pembelianModel.findAllPembelianWithDetail();
        res.status(200).json({
            success: true,
            data: pembelian
        });
    } catch (error) {
        console.error("List pembelian error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Get pembelian by ID
 * GET /api/admin/pembelian/:id
 */
const getPembelianById = async (req, res) => {
    try {
        const { id } = req.params;
        const pembelian = await pembelianModel.findPembelianById(id);
        
        if (!pembelian) {
            return res.status(404).json({ error: "Pembelian tidak ditemukan" });
        }

        res.status(200).json({
            success: true,
            data: pembelian
        });
    } catch (error) {
        console.error("Get pembelian error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Update pembelian
 * PUT /api/admin/pembelian/:id
 * Body: metode_pembayaran, pembayaran, pengiriman, status, catatan, foto_bukti
 */
const updatePembelian = async (req, res) => {
    try {
        const { id } = req.params;
        const { metode_pembayaran, pembayaran, pengiriman, status, catatan, foto_bukti } = req.body;

        // Cek pembelian ada
        const pembelian = await pembelianModel.findPembelianById(id);
        if (!pembelian) {
            return res.status(404).json({ error: "Pembelian tidak ditemukan" });
        }

        // Jika status diubah menjadi "Selesai", pembayaran harus "Dibayar"
        if (status === 'Selesai' && pembayaran !== 'Dibayar') {
            return res.status(400).json({ 
                message: 'Pesanan tidak bisa diselesaikan jika pembayaran belum dibayar' 
            });
        }

        // Validasi ENUM
        const validMetode = ['Bank Transfer', 'COD'];
        const validPembayaran = ['Belum', 'Dibayar'];
        const validPengiriman = ['JNT Express', 'JNE'];
        const validStatus = ['Tertunda', 'Dikemas', 'Dikirim', 'Diterima', 'Selesai'];

        if (metode_pembayaran && !validMetode.includes(metode_pembayaran)) {
            return res.status(400).json({ error: `Metode pembayaran tidak valid` });
        }
        if (pembayaran && !validPembayaran.includes(pembayaran)) {
            return res.status(400).json({ error: `Status pembayaran tidak valid` });
        }
        if (pengiriman && !validPengiriman.includes(pengiriman)) {
            return res.status(400).json({ error: `Metode pengiriman tidak valid` });
        }
        if (status && !validStatus.includes(status)) {
            return res.status(400).json({ error: `Status tidak valid` });
        }

        // Update pembelian
        await pembelianModel.updatePembelian(id, {
            metode_pembayaran: metode_pembayaran || pembelian.metode_pembayaran,
            pembayaran: pembayaran || pembelian.pembayaran,
            pengiriman: pengiriman || pembelian.pengiriman,
            status: status || pembelian.status,
            catatan: catatan !== undefined ? catatan : pembelian.catatan,
            foto_bukti: foto_bukti !== undefined ? foto_bukti : pembelian.foto_bukti
        });

        const pembelianUpdated = await pembelianModel.findPembelianById(id);

        res.status(200).json({
            success: true,
            message: "Pembelian berhasil diupdate",
            data: pembelianUpdated
        });
    } catch (error) {
        console.error("Update pembelian error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Delete pembelian
 * DELETE /api/admin/pembelian/:id
 */
const deletePembelian = async (req, res) => {
    try {
        const { id } = req.params;

        // Cek pembelian ada
        const pembelian = await pembelianModel.findPembelianById(id);
        if (!pembelian) {
            return res.status(404).json({ error: "Pembelian tidak ditemukan" });
        }

        // Hapus pembelian
        await pembelianModel.deletePembelian(id);

        res.status(200).json({
            success: true,
            message: "Pembelian berhasil dihapus"
        });
    } catch (error) {
        console.error("Delete pembelian error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

module.exports = {
    // Produk
    listProduk,
    getProdukById,
    createProduk,
    updateProduk,
    deleteProduk,
    // Pembeli
    listPembeli,
    getPembeliById,
    createPembeli,
    updatePembeli,
    deletePembeli,
    // Artikel
    listArtikel,
    getArtikelById,
    createArtikel,
    updateArtikel,
    deleteArtikel,
    // Statistik
    getStats,
    // Pembelian
    listPembelian,
    getPembelianById,
    updatePembelian,
    deletePembelian
};