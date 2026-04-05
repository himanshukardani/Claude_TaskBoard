import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ── ProtectedRoute: requires login ───────────────────────────────────────────
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="spinner-overlay">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  return user ? children : <Navigate to="/login" replace />;
}

// ── AdminRoute: requires Admin role ─────────────────────────────────────────
export function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return (
    <div className="spinner-overlay">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/tasks" replace />;

  return children;
}
