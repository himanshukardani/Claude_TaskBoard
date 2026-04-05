import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: '#1e1b4b', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <div className="container-fluid px-4">
        {/* Brand */}
        <Link className="navbar-brand" to="/">
          <i className="bi bi-kanban me-2"></i>
          Task<span className="brand-dot">Board</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto">
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/tasks">
                  <i className="bi bi-list-task me-1"></i>My Tasks
                </Link>
              </li>
            )}

            {/* Admin-only links */}
            {isAdmin() && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/tasks">
                    <i className="bi bi-collection me-1"></i>All Tasks
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/users">
                    <i className="bi bi-people me-1"></i>Users
                  </Link>
                </li>
              </>
            )}
          </ul>

          {user && (
            <div className="d-flex align-items-center gap-3">
              <span className="text-white-50 small">
                <i className="bi bi-person-circle me-1"></i>
                {user.name}
                {isAdmin() && (
                  <span className="badge bg-warning text-dark ms-2" style={{ fontSize: '0.65rem' }}>
                    Admin
                  </span>
                )}
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
