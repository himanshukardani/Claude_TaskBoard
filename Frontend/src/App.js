import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyTasksPage from './pages/MyTasksPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminTasksPage from './pages/AdminTasksPage';
import AdminUsersPage from './pages/AdminUsersPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected user routes */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <MyTasksPage />
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/tasks"
            element={
              <AdminRoute>
                <AdminTasksPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
