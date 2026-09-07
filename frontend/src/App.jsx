/**
 * App.jsx — AuthProvider + Router + daftar Route.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import PembeliLayout from './layouts/PembeliLayout';
import HomePage from './pages/HomePage';
import TokoPage from './pages/TokoPage';
import ArtikelListPage from './pages/ArtikelListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ArtikelDetailPage from './pages/ArtikelDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PembeliOverviewPage from './pages/pembeli/PembeliOverviewPage';
import PembeliBelanjaPage from './pages/pembeli/PembeliBelanjaPage';
import PembeliPesananPage from './pages/pembeli/PembeliPesananPage';
import PembeliProfilPage from './pages/pembeli/PembeliProfilPage';
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminProdukPage from './pages/admin/AdminProdukPage';
import AdminPembeliPage from './pages/admin/AdminPembeliPage';
import AdminPembelianPage from './pages/admin/AdminPembelianPage';
import AdminArtikelPage from './pages/admin/AdminArtikelPage';
import AdminArtikelTambahPage from './pages/admin/AdminArtikelTambahPage';
import AdminArtikelEditPage from './pages/admin/AdminArtikelEditPage';
import AdminArtikelDetailPage from './pages/admin/AdminArtikelDetailPage';
import AdminProfilPage from './pages/admin/AdminProfilPage';
import AdminProdukTambahPage from './pages/admin/AdminProdukTambahPage';
import AdminProdukEditPage from './pages/admin/AdminProdukEditPage';
import AdminProdukDetailPage from './pages/admin/AdminProdukDetailPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/toko" element={<TokoPage />} />
            <Route path="/artikel" element={<ArtikelListPage />} />
            <Route path="/produk/:id" element={<ProductDetailPage />} />
            <Route path="/artikel/:id" element={<ArtikelDetailPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/daftar" element={<RegisterPage />} />

          <Route
            path="/admin"
            element={
              <RequireAuth role="admin">
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="produk" element={<AdminProdukPage />} />
            <Route path="produk/tambah" element={<AdminProdukTambahPage />} />
            <Route path="produk/edit/:id" element={<AdminProdukEditPage />} />
            <Route path="produk/detail/:id" element={<AdminProdukDetailPage />} />
            <Route path="pembeli" element={<AdminPembeliPage />} />
            <Route path="pembelian" element={<AdminPembelianPage />} />
            <Route path="artikel" element={<AdminArtikelPage />} />
            <Route path="artikel/tambah" element={<AdminArtikelTambahPage />} />
            <Route path="artikel/edit/:id" element={<AdminArtikelEditPage />} />
            <Route path="artikel/detail/:id" element={<AdminArtikelDetailPage />} />
            <Route path="profil" element={<AdminProfilPage />} />
          </Route>

          <Route
            path="/akun"
            element={
              <RequireAuth role="pembeli">
                <PembeliLayout />
              </RequireAuth>
            }
          >
            <Route index element={<PembeliOverviewPage />} />
            <Route path="belanja" element={<PembeliBelanjaPage />} />
            <Route path="pesanan" element={<PembeliPesananPage />} />
            <Route path="profil" element={<PembeliProfilPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}