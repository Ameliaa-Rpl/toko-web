// backend/routes/users.js
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { authenticate, requireRole, middlewareUploadGambar, sendHasilUpload } = require("../middlewares");

// ========================== AUTH ==========================
router.post("/register", usersController.registerUser);
router.post("/login", usersController.loginUser);

// ==================== PRODUK (PUBLIC) ====================
router.get("/produk", usersController.listProduk);
router.get("/produk/:id_produk", usersController.getProdukById);

// ==================== ARTIKEL (PUBLIC) ====================
router.get("/artikel", usersController.listArtikelPublik);
router.get("/artikel/:id", usersController.getArtikelPublikById);

// ==================== UPLOAD GAMBAR (PUBLIC - TANPA LOGIN) ====================
router.post("/upload-gambar", middlewareUploadGambar, sendHasilUpload);

// ==================== PEMBELI (AUTH + ROLE PEMBELI) ====================
// Semua route dibawah wajib login + role pembeli
router.use(authenticate);
router.use(requireRole("pembeli"));

// ==================== PROFIL ====================
router.get("/me", usersController.getMyProfile);
router.put("/me", usersController.updateMyProfile);

// ==================== DASHBOARD ====================
router.get("/dashboard", usersController.getDashboard);

// ==================== PEMBELIAN ====================
router.post("/pembelian", usersController.createPembelian);
router.get("/pembelian", usersController.listMyPembelian);
router.get("/pembelian/:id", usersController.getMyPembelianById);

module.exports = router;