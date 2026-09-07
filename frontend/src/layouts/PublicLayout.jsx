import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SITE } from '../constants';
import { useAuth } from '../context/AuthContext';
import { mediaUrl } from '../utils';

function IconTelepon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16">
      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
    </svg>
  );
}

function IconEmail() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16">
      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
    </svg>
  );
}

function IconLokasi() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16">
      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
    </svg>
  );
}

function IconJam() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16">
      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
    </svg>
  );
}

export default function PublicLayout() {
  const { isLoggedIn, isAdmin, isPembeli, logout, user } = useAuth();
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const activeStyle = ({ isActive }) => ({
    color: isActive ? '#333333' : '#66745D',
    fontWeight: isActive ? 'bold' : '600',
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userName = user
    ? `${user.nama_d || ''} ${user.nama_b || ''}`.trim() || user.uname || 'User'
    : 'User';

  return (
    <>
      <nav className="navbar bg-white border-bottom px-4 px-md-5" style={{ minHeight: "70px", position: "sticky", top: 0, zIndex: 1000 }}>
        <div className="container-fluid">
          <div>
            <NavLink to="/" onClick={closeMenu}><img src={SITE.logo_toko} alt="logo" className="public-logo" style={{ width: "150px" }}/></NavLink>
          </div>

          <div className="public-nav-menu d-flex align-items-center gap-5">
            <NavLink to="/" className="text-decoration-none fw-bold" style={activeStyle}>BERANDA</NavLink>
            <NavLink to="/toko" className="text-decoration-none fw-bold" style={activeStyle}>TOKO</NavLink>
            <NavLink to="/artikel" className="text-decoration-none fw-bold" style={activeStyle}>ARTIKEL</NavLink>
          </div>


          <div className="public-nav-right d-flex align-items-center gap-3 justify-content-end">
            {isLoggedIn ? (
              <>
                <img src={mediaUrl(user?.foto, 'avatar')} alt={userName} className="rounded-circle"
                  style={{ width: '36px', height: '36px', objectFit: 'cover', border: '2px solid #66745D'}}
                  onError={(e) => {e.target.src = '/placeholder-image.jpg';}}
                />

                {isPembeli && (
                  <NavLink to="/akun" className="text-decoration-none fw-bold" style={{ color: '#333333' }}>{userName}</NavLink>
                )}

                {isAdmin && (
                  <NavLink to="/admin" className="text-decoration-none fw-bold" style={{ color: '#333333' }}>Dashboard Admin</NavLink>
                )}

                <button onClick={handleLogout} className="btn btn-sm px-3 py-1 fw-bold border-0" style={{ backgroundColor: '#A83225', color: '#FFFFFF'}}>Keluar</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="text-decoration-none fw-bold" style={{ color: '#333333' }}>Masuk</NavLink>
                <NavLink to="/daftar" className="text-decoration-none px-3 py-2 fw-bold" style={{color: '#FAF8F5', backgroundColor: '#66745D'}}>Daftar</NavLink>
              </>
            )}
          </div>

          <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Buka menu">{menuOpen ? '✕' : '☰'}</button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <NavLink to="/" onClick={closeMenu} className="mobile-menu-link" style={activeStyle}>BERANDA</NavLink>
            <NavLink to="/toko" onClick={closeMenu} className="mobile-menu-link" style={activeStyle}>TOKO</NavLink>
            <NavLink to="/artikel" onClick={closeMenu} className="mobile-menu-link" style={activeStyle}>ARTIKEL</NavLink>

            <div className="mobile-menu-divider"></div>
            {isLoggedIn ? (
              <>
                {isPembeli && (
                  <NavLink to="/akun" onClick={closeMenu} className="mobile-menu-link">{userName}</NavLink>
                )}

                {isAdmin && (
                  <NavLink to="/admin" onClick={closeMenu} className="mobile-menu-link">Dashboard Admin</NavLink>
                )}

                <button onClick={() => { handleLogout(); closeMenu(); }} className="mobile-logout-button">Keluar</button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMenu} className="mobile-menu-link">MASUK</NavLink>
                <NavLink to="/daftar" onClick={closeMenu} className="mobile-daftar-button">DAFTAR</NavLink>
              </>
            )}
          </div>
        )}
      </nav>

      <main className='flex-grow-1'>
        <Outlet />
      </main>

      <footer className="pt-5 px-5" style={{ backgroundColor: '#e8e4e4' }}>
        <div className='container-fluid' style={{ color: "#30352F" }}>
          <div className='row g-4'>
            <div className='col-md-4'>
              <img src={SITE.logo_toko} alt='logo' style={{ width: "100px" }} />
              <p className='mt-3 pe-md-5'>{SITE.tentang}</p>
              <a href={SITE.link_ig} target="_blank" rel="noopener noreferrer" className="text-decoration-none rounded-pill px-2 py-1 me-2" style={{ backgroundColor: "#F8F7F3", color: "#30352F" }}>Instagram</a>
              <a href={SITE.link_fb} target="_blank" rel="noopener noreferrer" className="text-decoration-none rounded-pill px-2 py-1 me-2" style={{ backgroundColor: "#F8F7F3", color: "#30352F" }}>Facebook</a>
              <a href={SITE.link_wa} target="_blank" rel="noopener noreferrer" className="text-decoration-none rounded-pill px-2 py-1" style={{ backgroundColor: "#F8F7F3", color: "#30352F" }}>WhatsApp</a>
            </div>
            <div className='col-md-4'>
              <p className='fw-bold fs-5'>Navigasi</p>
              <div className="d-flex flex-column">
                <NavLink to="/" className="text-decoration-none" style={{ color: '#4A4A4A' }}>Beranda</NavLink><br />
                <NavLink to="/toko" className="text-decoration-none" style={{ color: '#4A4A4A' }}>Toko</NavLink><br />
                <NavLink to="/artikel" className="text-decoration-none" style={{ color: '#4A4A4A' }}>Artikel</NavLink>
              </div>
            </div>
            <div className='col-md-4'>
              <p className='fw-bold fs-5'>Hubungi Kami</p>
              <p><IconTelepon /> {SITE.tlp_toko}</p>
              <p><IconEmail /> {SITE.email_toko}</p>
              <p><IconLokasi /> {SITE.alamat_toko}</p>
              <p><IconJam /> 0{SITE.jam_buka}:00 - {SITE.jam_tutup}:00 WIB</p>
            </div>
            <hr className="mt-4" style={{ borderColor: '#C5C2B8' }} />
            <div className='col-md-6'>
              <p style={{ fontSize: "13px" }}>&copy; {year} {SITE.nama_toko}. Semua hak dilindungi undang-undang.</p>
            </div>
            <div className='col-md-6'>
              <div className="text-md-end" style={{fontSize: "13px"}}>
                <a href="#" className='me-3' style={{ color: '#263238', textDecoration: 'none' }}>Kebijakan Privasi</a>
                <a href="#" style={{ color: '#263238', textDecoration: 'none' }}>Syarat & Ketentuan</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}