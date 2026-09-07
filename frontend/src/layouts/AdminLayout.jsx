import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SITE } from '../constants';
import { adminApi } from '../api';
import { mediaUrl } from '../utils';

function IconDashboard() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M4 2v2H2V2zm1 12v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m5 10v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1M9 2v2H7V2zm5 0v2h-2V2zM4 7v2H2V7zm5 0v2H7V7zm5 0h-2v2h2zM4 12v2H2v-2zm5 0v2H7v-2zm5 0v2h-2v-2zM12 1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-1 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z"/>
    </svg>
  );
}

function IconProduk() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
    </svg>
  );
}

function IconPembeli() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
    </svg>
  );
}

function IconPesanan() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
    </svg>
  );
}

function IconArtikel() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5M5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z"/>
      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1"/>
    </svg>
  );
}

function IconProfil() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
    </svg>
  );
}

function IconHouse() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
    </svg>
  );
}

function IconKeluar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
      <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
    </svg>
  );
}

// Mapping halaman ke judul
const TITLES = {
  '/admin': 'Dashboard',
  '/admin/produk': 'Kelola Produk',
  '/admin/pembeli': 'Kelola Pembeli',
  '/admin/pembelian': 'Kelola Pesanan',
  '/admin/artikel': 'Kelola Artikel',
  '/admin/profil': 'Profil Admin',
};

function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState('');
  const [adminFoto, setAdminFoto] = useState('');

  // Ambil judul berdasarkan path
  const title = TITLES[location.pathname] || 'Panel Admin';

  // Fetch data admin
  useEffect(() => {
    let alive = true;
    adminApi
      .getMe()
      .then((r) => {
        if (!alive) return;
        const data = r.data;
        setAdminName(`${data.nama_d || ''} ${data.nama_b || ''}`.trim() || data.uname || 'Admin');
        setAdminFoto(data.foto || '');
      })
      .catch((err) => {
        console.error('Gagal ambil data admin:', err);
      });
    return () => {
      alive = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { to: '/admin', label: 'Dashboard', icon: <IconDashboard /> },
    { to: '/admin/produk', label: 'Produk', icon: <IconProduk /> },
    { to: '/admin/pembeli', label: 'Pembeli', icon: <IconPembeli /> },
    { to: '/admin/pembelian', label: 'Pesanan', icon: <IconPesanan /> },
    { to: '/admin/artikel', label: 'Artikel', icon: <IconArtikel /> },
    { to: '/admin/profil', label: 'Profil Admin', icon: <IconProfil /> },
  ];

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#e8e4e4' }}>
      <aside className="d-flex flex-column flex-shrink-0 bg-white p-3"
        style={{width: '250px', borderRight: '1px solid #E8E0D8', minHeight: '100vh', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto'}}
      >
        <div className="d-flex align-items-center mb-4 pb-2 border-bottom" style={{ borderColor: '#E8E0D8' }}>
          <img src={SITE.logo_toko} style={{ height: '25px', width: 'auto' }} />
          <span className="fw-semibold ms-3" style={{ color: '#333333' }}>Area Admin</span>
        </div>

        {/* Menu */}
        <ul className="nav nav-pills flex-column mb-auto gap-1">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.to}>
              <NavLink to={item.to} end={item.to === '/admin'} className={({ isActive }) =>`nav-link d-flex align-items-center rounded-3 ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({backgroundColor: isActive ? '#333333' : 'transparent', color: isActive ? '#FFFFFF' : '#4A4A4A', fontWeight: isActive ? '600' : '500', padding: '10px 16px'})}
              >
                <span className="me-2">{item.icon}</span>{item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="border-top pt-3" style={{ borderColor: '#E8E0D8' }}>
          <NavLink to="/" className="d-flex text-decoration-none rounded-3 px-3 py-2 mb-2" style={{ color: '#4A4A4A' }}><span className="me-2"><IconHouse /></span>Lihat Beranda Toko</NavLink>
          <button onClick={handleLogout} className="btn w-100 d-flex rounded-3 px-3 py-2 border-0" style={{ color: '#A83225' }}><span className="me-2"><IconKeluar /></span>Keluar</button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: '100vh' }}>
        {/* ===== TOPBAR ===== */}
        <header className="d-flex align-items-center justify-content-between px-4 py-3"
          style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E0D8', position: 'sticky', top: 0, zIndex: 100 }}
        >
          <p className="fw-bold fs-4 mb-0 font-serif">{title}</p>

          <div className="d-flex align-items-center gap-3">
            <img src={mediaUrl(adminFoto, 'avatar')} alt={adminName} className="rounded-circle" style={{ width: '36px', height: '36px', objectFit: 'cover' }}
              onError={(e) => {e.target.src = '/placeholder-image.jpg';}}
            />
            <span className="fw-medium" style={{ color: '#4A4A4A' }}>{adminName}</span>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;