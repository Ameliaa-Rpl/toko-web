import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';
import {
  getToken,
  getRole,
  saveSession,
  clearSession,
} from '../utils';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [role, setRole] = useState(getRole());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memuat data user saat aplikasi dibuka
  useEffect(() => {
    const loadUser = async () => {
      const currentToken = getToken();
      const currentRole = getRole();

      if (!currentToken || !currentRole) {
        setLoading(false);
        return;
      }

      try {
        const response =
          currentRole === 'admin'
            ? await api.getAdminMe()
            : await api.getPembeliMe();

        setUser(response.data || null);
        setToken(currentToken);
        setRole(currentRole);
      } catch (error) {
        console.error('Load user error:', error);
        clearSession();
        setToken(null);
        setRole(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const refreshUser = async () => {
    try {
      const currentRole = getRole();
      const response =
        currentRole === 'admin'
          ? await api.getAdminMe()
          : await api.getPembeliMe();
      setUser(response.data || null);
      return response;
    } catch (error) {
      console.error('Refresh user error:', error);
      throw error;
    }
  };

  // Login
  const login = async (credential, passwd) => {
    const response = await api.login(credential, passwd);

    const data = response.data || response;

    const newToken = data.token;
    const newRole = data.user?.role || data.role;

    if (!newToken || !newRole) {
      throw new Error('Data login tidak lengkap.');
    }

    saveSession(newToken, newRole);

    setToken(newToken);
    setRole(newRole);
    setUser(data.user || null);

    return response;
  };

  // Logout
  const logout = () => {
    clearSession();
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const value = {
    token,
    role,
    user,
    loading,
    isLoggedIn: Boolean(token),
    isAdmin: role === 'admin',
    isPembeli: role === 'pembeli',
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
}