import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../context/AuthContext';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleTarget, setRoleTarget] = useState(null); // { user, newRole }
  const [changing, setChanging] = useState(false);
  const [toast, setToast] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getAllUsers();
      setUsers(data);
    } catch {
      showToast('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleRoleChange = async () => {
    setChanging(true);
    try {
      await adminAPI.changeRole(roleTarget.user.id, roleTarget.newRole);
      showToast(`Role changed to ${roleTarget.newRole}.`);
      setRoleTarget(null);
      fetchUsers();
    } catch {
      showToast('Failed to change role.');
    } finally {
      setChanging(false);
    }
  };

  const displayed = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  // Generate a consistent avatar color from user id
  const avatarColor = (id) => `hsl(${id * 47 % 360}, 55%, 55%)`;

  return (
    <>
      <Navbar />
      <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="container py-4" style={{ maxWidth: 960 }}>

          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
            <div>
              <h4 className="fw-bold mb-0">
                <i className="bi bi-people me-2 text-primary"></i>User Management
              </h4>
              <p className="text-muted small mb-0">
                {users.length} registered user{users.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="input-group" style={{ maxWidth: 260 }}>
              <span className="input-group-text bg-white">
                <i className="bi bi-search text-muted small"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* User cards */}
          {loading ? (
            <div className="spinner-overlay">
              <div className="spinner-border text-primary" />
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-person-x text-muted" style={{ fontSize: '2.5rem' }}></i>
              <p className="text-muted mt-2">No users found.</p>
            </div>
          ) : (
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ background: '#f8f9fa' }}>
                      <tr>
                        <th className="ps-4 py-3">User</th>
                        <th className="py-3">Role</th>
                        <th className="py-3">Tasks</th>
                        <th className="py-3">Joined</th>
                        <th className="py-3 text-end pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayed.map((u) => {
                        const isSelf = u.email === currentUser?.email;
                        return (
                          <tr key={u.id}>
                            {/* User info */}
                            <td className="ps-4 py-3">
                              <div className="d-flex align-items-center gap-3">
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                  style={{
                                    width: 38,
                                    height: 38,
                                    background: avatarColor(u.id),
                                    fontSize: '0.85rem',
                                    flexShrink: 0,
                                  }}
                                >
                                  {u.name[0].toUpperCase()}
                                </div>
                                <div>
                                  <div className="fw-semibold small">
                                    {u.name}
                                    {isSelf && (
                                      <span className="badge bg-light text-secondary ms-2" style={{ fontSize: '0.65rem' }}>
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                    {u.email}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Role badge */}
                            <td className="py-3">
                              <span
                                className={`badge rounded-pill px-3 py-1 ${
                                  u.role === 'Admin' ? 'bg-warning text-dark' : 'bg-light text-secondary'
                                }`}
                                style={{ fontSize: '0.75rem' }}
                              >
                                <i className={`bi ${u.role === 'Admin' ? 'bi-shield-fill-check' : 'bi-person'} me-1`}></i>
                                {u.role}
                              </span>
                            </td>

                            {/* Task count */}
                            <td className="py-3">
                              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1" style={{ borderRadius: 20 }}>
                                {u.taskCount} task{u.taskCount !== 1 ? 's' : ''}
                              </span>
                            </td>

                            {/* Joined date */}
                            <td className="py-3 small text-muted">
                              {new Date(u.createdAt).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric',
                              })}
                            </td>

                            {/* Role toggle */}
                            <td className="py-3 text-end pe-4">
                              {isSelf ? (
                                <span className="text-muted small">—</span>
                              ) : (
                                <button
                                  className={`btn btn-sm ${
                                    u.role === 'Admin'
                                      ? 'btn-outline-secondary'
                                      : 'btn-outline-warning'
                                  }`}
                                  style={{ borderRadius: 8, fontSize: '0.78rem' }}
                                  onClick={() =>
                                    setRoleTarget({
                                      user: u,
                                      newRole: u.role === 'Admin' ? 'User' : 'Admin',
                                    })
                                  }
                                >
                                  {u.role === 'Admin' ? (
                                    <><i className="bi bi-arrow-down-circle me-1"></i>Demote to User</>
                                  ) : (
                                    <><i className="bi bi-arrow-up-circle me-1"></i>Promote to Admin</>
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role change confirmation */}
      <ConfirmDialog
        show={!!roleTarget}
        title="Change Role"
        message={`Change ${roleTarget?.user?.name}'s role to "${roleTarget?.newRole}"?`}
        onConfirm={handleRoleChange}
        onCancel={() => setRoleTarget(null)}
        loading={changing}
        confirmLabel="Confirm"
        confirmVariant={roleTarget?.newRole === 'Admin' ? 'warning' : 'secondary'}
      />

      {toast && (
        <div className="position-fixed bottom-0 end-0 m-4" style={{ zIndex: 9999 }}>
          <div className="toast show align-items-center text-bg-dark border-0">
            <div className="d-flex">
              <div className="toast-body">
                <i className="bi bi-check-circle-fill me-2 text-success"></i>{toast}
              </div>
              <button className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast('')} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
