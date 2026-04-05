import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';

const FILTERS = ['All', 'To Do', 'In Progress', 'Done'];

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const status = filter === 'All' ? undefined : filter;
      const { data } = await adminAPI.getAllTasks(status);
      setTasks(data);
    } catch {
      showToast('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminAPI.deleteTask(deleteTarget.id);
      showToast('Task deleted.');
      setDeleteTarget(null);
      fetchTasks();
    } finally {
      setDeleting(false);
    }
  };

  // Client-side search filter
  const displayed = tasks.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.userName.toLowerCase().includes(q) ||
      t.userEmail.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <Navbar />
      <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="container py-4" style={{ maxWidth: 1100 }}>

          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
            <div>
              <h4 className="fw-bold mb-0">
                <i className="bi bi-collection me-2 text-primary"></i>All Tasks
              </h4>
              <p className="text-muted small mb-0">
                {displayed.length} task{displayed.length !== 1 ? 's' : ''} shown
              </p>
            </div>

            {/* Search box */}
            <div className="input-group" style={{ maxWidth: 280 }}>
              <span className="input-group-text bg-white">
                <i className="bi bi-search text-muted small"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search tasks or users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filter pills */}
          <div className="d-flex gap-2 mb-4 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ borderRadius: 20 }}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Table card */}
          <div className="card">
            <div className="card-body p-0">
              {loading ? (
                <div className="spinner-overlay">
                  <div className="spinner-border text-primary" />
                </div>
              ) : displayed.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox text-muted" style={{ fontSize: '2.5rem' }}></i>
                  <p className="text-muted mt-2 mb-0">No tasks found.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ background: '#f8f9fa' }}>
                      <tr>
                        <th className="ps-4 py-3">Title</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Assigned To</th>
                        <th className="py-3">Created</th>
                        <th className="py-3 text-end pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayed.map((task) => (
                        <tr key={task.id}>
                          <td className="ps-4 py-3">
                            <div className="fw-semibold small">{task.title}</div>
                            {task.description && (
                              <div
                                className="text-muted"
                                style={{
                                  fontSize: '0.75rem',
                                  maxWidth: 300,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {task.description}
                              </div>
                            )}
                          </td>
                          <td className="py-3">
                            <StatusBadge status={task.status} />
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                style={{
                                  width: 30,
                                  height: 30,
                                  background: `hsl(${task.userId * 47 % 360}, 55%, 55%)`,
                                  fontSize: '0.7rem',
                                  flexShrink: 0,
                                }}
                              >
                                {task.userName?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <div className="small fw-semibold">{task.userName}</div>
                                <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                                  {task.userEmail}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 small text-muted">
                            {new Date(task.createdAt).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })}
                          </td>
                          <td className="py-3 text-end pe-4">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              style={{ borderRadius: 8 }}
                              onClick={() => setDeleteTarget(task)}
                            >
                              <i className="bi bi-trash me-1"></i>Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        show={!!deleteTarget}
        title="Delete Task"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
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
