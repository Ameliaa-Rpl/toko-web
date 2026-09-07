import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SITE } from '../constants';
import { pembeliApi } from '../api';
import { mediaUrl } from '../utils';

function IconDashboard() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M4 2v2H2V2zm1 12v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m5 10v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1M9 2v2H7V2zm5 0v2h-2V2zM4 7v2H2V7zm5 0v2H7V7zm5 0h-2v2h2zM4 12v2H2v-2zm5 0v2H7v-2zm5 0v2h-2v-2zM12 1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-1 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z"/>
    </svg>
  );
}

function IconBelanja() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
    </svg>
  );
}

function IconPesanan() {
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
  '/akun': 'Dashboard',
  '/akun/belanja': 'Belanja',
  '/akun/pesanan': 'Pesanan Saya',
  '/akun/profil': 'Profil Saya',
};

function PembeliLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pembeliName, setPembeliName] = useState('');
  const [pembeliFoto, setPembeliFoto] = useState('');

  // Ambil judul berdasarkan path
  const title = TITLES[location.pathname] || 'Area Pembeli';

  // Ambil data pembeli dari API
  useEffect(() => {
    let alive = true;
    pembeliApi
      .getMe()
      .then((r) => {
        if (!alive) return;
        const data = r.data;
        setPembeliName(`${data.nama_d || ''} ${data.nama_b || ''}`.trim() || data.uname || 'Pembeli');
        setPembeliFoto(data.foto || '');
      })
      .catch((err) => {
        console.error('Gagal ambil data pembeli:', err);
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
    { to: '/akun', label: 'Dashboard', icon: <IconDashboard /> },
    { to: '/akun/belanja', label: 'Belanja', icon: <IconBelanja /> },
    { to: '/akun/pesanan', label: 'Pesanan Saya', icon: <IconPesanan /> },
    { to: '/akun/profil', label: 'Profil Saya', icon: <IconProfil /> },
  ];

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#e8e4e4' }}>
      <aside
        className="d-flex flex-column flex-shrink-0 p-3"
        style={{ width: '250px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E8E0D8', minHeight: '100vh', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', }}
      >
        <div className="d-flex align-items-center mb-4 pb-2 border-bottom" style={{ borderColor: '#E8E0D8' }}>
          <img src={SITE.logo_toko} style={{ height: '24px', width: 'auto' }} />
          <span className="fw-semibold ms-3" style={{ color: '#333333' }}>Area Pembeli</span>
        </div>

        <ul className="nav nav-pills flex-column mb-auto gap-1">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/akun'}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center rounded-3 ${isActive ? 'active' : ''}`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#333333' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#4A4A4A',
                  fontWeight: isActive ? '600' : '500',
                  padding: '10px 16px',
                  transition: 'all 0.2s',
                })}
              >
                <span className="me-2">{item.icon}</span>{item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="border-top pt-3" style={{ borderColor: '#E8E0D8' }}>
          <NavLink to="/" className="d-flex align-items-center text-decoration-none rounded-3 px-3 py-2 mb-1" style={{ color: '#4A4A4A' }}><span className='me-2'><IconHouse /></span>Lihat Beranda Toko</NavLink>
          <button onClick={handleLogout} className="btn w-100 d-flex align-items-center rounded-3 px-3 py-2 border-0" style={{ color: '#A83225' }}><span className="me-2"><IconKeluar /></span>Keluar</button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: '100vh' }}>
        {/* ===== TOPBAR ===== */}
        <header
          className="d-flex align-items-center justify-content-between px-4 py-3"
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E8E0D8',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <p className="fw-bold fs-4 mb-0" style={{ fontFamily: 'georgia', color: '#4A4A4A' }}>{title}</p>

          <div className="d-flex align-items-center gap-3">
            <img
              src={mediaUrl(pembeliFoto, 'avatar')}
              className="rounded-circle"
              style={{ width: '36px', height: '36px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            <span className="fw-medium" style={{ color: '#4A4A4A' }}>{pembeliName}</span>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PembeliLayout;