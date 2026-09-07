// backend/middlewares/index.js
const jwt = require("jsonwebtoken");
const usersModel = require("../models/usersModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * Middleware autentikasi
 * Memverifikasi token JWT dari header Authorization: Bearer <token>
 * Menyimpan user ke req.user jika valid
 */
const authenticate = async (req, res, next) => {
    try {
        // Ambil header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token tidak ditemukan" });
        }

        // Ekstrak token
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Token tidak valid" });
        }

        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: "Token tidak valid" });
        }

        // Ambil data user dari database (tanpa password)
        const user = await usersModel.findUserById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: "User tidak ditemukan" });
        }

        // Simpan user ke req untuk digunakan di controller
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Token tidak valid" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token sudah kadaluarsa" });
        }
        console.error("Auth error:", error);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
};

/**
 * Middleware otorisasi berdasarkan role
 * @param {...string} roles - Role yang diizinkan
 * @returns {Function} - Middleware function
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        // Pastikan user sudah terautentikasi
        if (!req.user) {
            return res.status(401).json({ error: "Silakan login terlebih dahulu" });
        }

        // Cek apakah role user diizinkan
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Akses ditolak. Membutuhkan role: ${roles.join(", ")}` 
            });
        }

        next();
    };
};

/**
 * Middleware upload gambar dengan multer
 * Field: "gambar", folder: uploads/images, max: 5MB
 */
const uploadDir = path.join(__dirname, "../uploads/images");

// Buat folder jika belum ada
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Format: timestamp-nama-asli
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Hanya file gambar yang diizinkan (jpeg, jpg, png, gif, webp)"));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
});

/**
 * Middleware upload gambar (single file)
 * Field name: "gambar"
 */
const middlewareUploadGambar = upload.single("gambar");

/**
 * Helper untuk response hasil upload
 * Mengembalikan path file yang bisa diakses publik
 */
const sendHasilUpload = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Tidak ada file yang diupload" });
        }

        // Path untuk akses publik
        const filePath = `/uploads/images/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: "File berhasil diupload",
            data: {
                filename: req.file.filename,
                path: filePath,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Terjadi kesalahan saat upload" });
    }
};

module.exports = {
    authenticate,
    requireRole,
    middlewareUploadGambar,
    sendHasilUpload
};