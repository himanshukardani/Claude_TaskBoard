import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // or manual decode below

// ── Simple JWT decode (no library needed) ───────────────────────────────────
function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);    // { name, email, role, token }
  const [loading, setLoading] = useState(true);

  // On mount: restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      // Check token hasn't expired
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({
          token,
          name: localStorage.getItem('name'),
          email: localStorage.getItem('email'),
          role: localStorage.getItem('role'),
        });
      } else {
        // Expired — clear storage
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  // Called after successful login or signup
  const login = (authData) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('name', authData.name);
    localStorage.setItem('email', authData.email);
    localStorage.setItem('role', authData.role);
    setUser(authData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const isAdmin = () => user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy consumption
export const useAuth = () => useContext(AuthContext);
