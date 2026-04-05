import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authAPI.signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      login(data);
      navigate('/tasks', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card card shadow-lg">
        <div className="card-body p-4">
          <div className="auth-logo mb-1">
            <i className="bi bi-kanban me-2"></i>TaskBoard
          </div>
          <p className="text-center text-muted small mb-4">Create your free account</p>

          {error && (
            <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-circle-fill"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold small">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-person text-muted"></i>
                </span>
                <input
                  type="text"
                  name="name"
                  className="form-control border-start-0 ps-0"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>
            </div>

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
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold small">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control border-start-0 ps-0"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold small">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock-fill text-muted"></i>
                </span>
                <input
                  type="password"
                  name="confirm"
                  className="form-control border-start-0 ps-0"
                  placeholder="Repeat your password"
                  value={form.confirm}
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
                <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
              ) : (
                <><i className="bi bi-person-plus me-2"></i>Create Account</>
              )}
            </button>
          </form>

          <hr className="my-3" />

          <p className="text-center text-muted small mb-0">
            Already have an account?{' '}
            <Link to="/login" className="text-primary fw-semibold text-decoration-none">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
