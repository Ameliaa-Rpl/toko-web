// frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SITE } from '../constants';

function LoginPage() {
  const [credential, setCredential] = useState('');
  const [passwd, setPasswd] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(credential, passwd);
      const role = response.data?.user?.role || response.role;

      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/akun', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-6 vh-100 text-white d-flex flex-column justify-content-end" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${SITE.foto_banner})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", padding: "0px 70px 50px 70px" }}>
          <p className='fw-bolder fs-2 mb-2 font-serif'>"Setiap rajutan memiliki cerita."</p>
          <p style={{color: "#E8C9B8"}}>Temukan koleksi rajut pilihan untuk melengkapi gaya keseharian anda.</p>
        </div>

        <div className='col-6 vh-100' style={{ backgroundColor: "#FAF8F5", padding: "70px 130px"}}>
          <Link to="/" className='text-decoration-none' style={{color: "#333333"}}>← Kembali ke beranda</Link>
          <p className='fw-bolder fs-2 mb-0 mt-4' style={{fontFamily: "georgia"}}>Selamat Datang</p>
          <p className='mb-5'>Masuk untuk melanjutkan ke akun Anda</p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="pb-5">
            <label htmlFor="credential" className="fw-medium mb-2">Email atau Username</label>
            <input type="text" id="credential" className="form-control mb-3" value={credential} onChange={(e) => setCredential(e.target.value)} required />

            <label htmlFor="passwd" className="fw-medium mb-2">Password</label>
            <input type="password" id="passwd" className="form-control mb-3" placeholder="******" value={passwd} onChange={(e) => setPasswd(e.target.value)} required />

            <button type="submit" className="btn text-light rounded-3 mt-3 me-3 py-2 fw-semibold" style={{ backgroundColor: '#333333', width: "100%" }} disabled={loading}>{loading ? 'Loading...' : 'Masuk ke Akun'}</button>
          </form>

          <p className='text-center'>Belum punya akun? <Link to="/daftar" className='text-decoration-none' style={{ color: "#333333" }}>Daftar gratis</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;