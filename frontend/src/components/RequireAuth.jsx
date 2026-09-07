// frontend/src/components/RequireAuth.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Komponen untuk melindungi route yang membutuhkan login dan role tertentu
 * @param {Object} props
 * @param {React.ReactNode} props.children - Komponen yang akan dirender
 * @param {string} props.role - Role yang diizinkan ('admin' atau 'pembeli')
 */
export default function RequireAuth({ children, role }) {
  const { isLoggedIn, isAdmin, isPembeli, loading } = useAuth();
  const location = useLocation();

  // Sedang loading (cek token di localStorage)
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Belum login → redirect ke login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Cek role
  const hasRole = role === 'admin' ? isAdmin : isPembeli;

  // Role tidak sesuai → redirect ke halaman sesuai role
  if (!hasRole) {
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    if (isPembeli) {
      return <Navigate to="/akun" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Login dan role sesuai → render children
  return children;
}