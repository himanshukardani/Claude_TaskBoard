import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import Navbar from '../components/Navbar';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminAPI.getDashboard()
      .then(({ data }) => setStats(data))
      .catch(() => setError('Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: 'bi-people-fill',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
      link: '/admin/users',
    },
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      icon: 'bi-list-check',
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
      link: '/admin/tasks',
    },
    {
      label: 'To Do',
      value: stats.todoCount,
      icon: 'bi-circle',
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      link: '/admin/tasks',
    },
    {
      label: 'In Progress',
      value: stats.inProgressCount,
      icon: 'bi-arrow-clockwise',
      gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
      link: '/admin/tasks',
    },
    {
      label: 'Done',
      value: stats.doneCount,
      icon: 'bi-check-circle-fill',
      gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
      link: '/admin/tasks',
    },
  ] : [];

  // Completion percentage
  const completionPct = stats && stats.totalTasks > 0
    ? Math.round((stats.doneCount / stats.totalTasks) * 100)
    : 0;

  return (
    <>
      <Navbar />
      <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="container py-4" style={{ maxWidth: 1100 }}>

          {/* Page header */}
          <div className="mb-4">
            <h4 className="fw-bold mb-0">
              <i className="bi bi-speedometer2 me-2 text-primary"></i>Admin Dashboard
            </h4>
            <p className="text-muted small">Overview of all users and tasks</p>
          </div>

          {loading ? (
            <div className="spinner-overlay">
              <div className="spinner-border text-primary" />
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="row g-3 mb-4">
                {statCards.map((card) => (
                  <div key={card.label} className="col-6 col-md-4 col-lg">
                    <Link to={card.link} className="text-decoration-none">
                      <div className="stat-card h-100" style={{ background: card.gradient }}>
                        <div className="stat-icon mb-2">
                          <i className={`bi ${card.icon}`}></i>
                        </div>
                        <div className="stat-value">{card.value}</div>
                        <div className="stat-label mt-1">{card.label}</div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Progress & Quick Links */}
              <div className="row g-3">
                {/* Task Completion */}
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="fw-bold mb-3">
                        <i className="bi bi-bar-chart-fill me-2 text-primary"></i>
                        Task Completion Rate
                      </h6>

                      {/* Overall progress */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="text-muted">Overall Progress</span>
                          <span className="fw-bold">{completionPct}%</span>
                        </div>
                        <div className="progress" style={{ height: 10, borderRadius: 8 }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${completionPct}%`,
                              background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                              borderRadius: 8,
                            }}
                          />
                        </div>
                      </div>

                      {/* Per-status bars */}
                      {[
                        { label: 'To Do', count: stats.todoCount, color: '#6b7280' },
                        { label: 'In Progress', count: stats.inProgressCount, color: '#3b82f6' },
                        { label: 'Done', count: stats.doneCount, color: '#10b981' },
                      ].map(({ label, count, color }) => {
                        const pct = stats.totalTasks > 0
                          ? Math.round((count / stats.totalTasks) * 100)
                          : 0;
                        return (
                          <div key={label} className="mb-2">
                            <div className="d-flex justify-content-between small mb-1">
                              <span className="text-muted">{label}</span>
                              <span>{count} tasks ({pct}%)</span>
                            </div>
                            <div className="progress" style={{ height: 6, borderRadius: 8 }}>
                              <div
                                className="progress-bar"
                                style={{ width: `${pct}%`, background: color, borderRadius: 8 }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quick navigation */}
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="fw-bold mb-3">
                        <i className="bi bi-grid-fill me-2 text-primary"></i>
                        Quick Access
                      </h6>
                      <div className="d-flex flex-column gap-2">
                        <Link
                          to="/admin/tasks"
                          className="btn btn-outline-primary d-flex align-items-center gap-3"
                          style={{ borderRadius: 10, padding: '0.75rem 1rem' }}
                        >
                          <i className="bi bi-collection fs-5"></i>
                          <div className="text-start">
                            <div className="fw-semibold small">All Tasks</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                              View, filter and delete any task
                            </div>
                          </div>
                          <i className="bi bi-chevron-right ms-auto text-muted"></i>
                        </Link>

                        <Link
                          to="/admin/users"
                          className="btn btn-outline-success d-flex align-items-center gap-3"
                          style={{ borderRadius: 10, padding: '0.75rem 1rem' }}
                        >
                          <i className="bi bi-people fs-5"></i>
                          <div className="text-start">
                            <div className="fw-semibold small">User Management</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                              View users and change roles
                            </div>
                          </div>
                          <i className="bi bi-chevron-right ms-auto text-muted"></i>
                        </Link>

                        <Link
                          to="/tasks"
                          className="btn btn-outline-secondary d-flex align-items-center gap-3"
                          style={{ borderRadius: 10, padding: '0.75rem 1rem' }}
                        >
                          <i className="bi bi-list-task fs-5"></i>
                          <div className="text-start">
                            <div className="fw-semibold small">My Tasks</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                              Manage your personal tasks
                            </div>
                          </div>
                          <i className="bi bi-chevron-right ms-auto text-muted"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
