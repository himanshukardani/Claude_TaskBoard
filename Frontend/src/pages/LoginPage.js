import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await authAPI.login(form);
      login(data);
      // Redirect based on role
      navigate(data.role === 'Admin' ? '/admin/dashboard' : '/tasks', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card card shadow-lg">
        <div className="card-body p-4">
          {/* Logo */}
          <div className="auth-logo mb-1">
            <i className="bi bi-kanban me-2"></i>TaskBoard
          </div>
          <p className="text-center text-muted small mb-4">Sign in to your workspace</p>

          {error && (
            <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-circle-fill"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold small">Email address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-envelope text-muted"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control border-start-0 ps-0"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold small">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control border-start-0 ps-0"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
              )}
            </button>
          </form>

          <hr className="my-3" />

          <p className="text-center text-muted small mb-0">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary fw-semibold text-decoration-none">
              Sign up
            </Link>
          </p>

          {/* Demo hint */}
          <div className="mt-3 p-2 rounded" style={{ background: '#f8f9ff', border: '1px dashed #c7d2fe' }}>
            <p className="mb-1 small fw-semibold text-indigo-700" style={{ color: '#4f46e5' }}>
              <i className="bi bi-info-circle me-1"></i>Default Admin
            </p>
            <p className="mb-0 small text-muted">
              Email: <code>Admin@gmail.com</code><br />
              Password: <code>Admin@123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
