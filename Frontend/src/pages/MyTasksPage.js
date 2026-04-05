import React, { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../services/api';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';

const FILTERS = ['All', 'To Do', 'In Progress', 'Done'];

// Status → card CSS class
const statusClass = { 'To Do': 'todo', 'In Progress': 'inprogress', 'Done': 'done' };

export default function MyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);         // null = create mode
  const [deleteTarget, setDeleteTarget] = useState(null); // task to delete
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');

  // ── Fetch tasks (with optional status filter) ─────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const status = filter === 'All' ? undefined : filter;
      const { data } = await tasksAPI.getAll(status);
      setTasks(data);
    } catch {
      showToast('Failed to load tasks.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // ── Create task ───────────────────────────────────────────────────────────
  const handleCreate = async (data) => {
    await tasksAPI.create(data);
    showToast('Task created!');
    fetchTasks();
  };

  // ── Update task ───────────────────────────────────────────────────────────
  const handleUpdate = async (data) => {
    await tasksAPI.update(editTask.id, data);
    showToast('Task updated!');
    fetchTasks();
  };

  // ── Delete task ───────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await tasksAPI.delete(deleteTarget.id);
      showToast('Task deleted.');
      setDeleteTarget(null);
      fetchTasks();
    } finally {
      setDeleting(false);
    }
  };

  // ── Counts per status (for filter pills) ─────────────────────────────────
  const countByStatus = (s) => tasks.filter((t) => t.status === s).length;

  return (
    <>
      <Navbar />

      <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="container py-4" style={{ maxWidth: 960 }}>

          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
            <div>
              <h4 className="fw-bold mb-0">
                <i className="bi bi-list-task me-2 text-primary"></i>My Tasks
              </h4>
              <p className="text-muted small mb-0">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => { setEditTask(null); setShowModal(true); }}
            >
              <i className="bi bi-plus-lg me-2"></i>New Task
            </button>
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
                {f !== 'All' && (
                  <span className={`badge ms-2 ${filter === f ? 'bg-white text-primary' : 'bg-secondary'}`}>
                    {countByStatus(f)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Task list */}
          {loading ? (
            <div className="spinner-overlay">
              <div className="spinner-border text-primary" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-3 mb-3">
                {filter === 'All' ? 'No tasks yet. Create your first one!' : `No tasks with status "${filter}".`}
              </p>
              {filter === 'All' && (
                <button
                  className="btn btn-primary"
                  onClick={() => { setEditTask(null); setShowModal(true); }}
                >
                  <i className="bi bi-plus-lg me-2"></i>Create Task
                </button>
              )}
            </div>
          ) : (
            <div className="row g-3">
              {tasks.map((task) => (
                <div key={task.id} className="col-md-6 col-lg-4">
                  <div className={`card task-card h-100 ${statusClass[task.status] || 'todo'}`}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <StatusBadge status={task.status} />
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-light rounded-circle p-1 lh-1"
                            data-bs-toggle="dropdown"
                          >
                            <i className="bi bi-three-dots-vertical small"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ borderRadius: 10 }}>
                            <li>
                              <button
                                className="dropdown-item small"
                                onClick={() => { setEditTask(task); setShowModal(true); }}
                              >
                                <i className="bi bi-pencil me-2 text-primary"></i>Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item small text-danger"
                                onClick={() => setDeleteTarget(task)}
                              >
                                <i className="bi bi-trash me-2"></i>Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <h6 className="fw-bold mb-1" style={{ lineHeight: 1.3 }}>{task.title}</h6>

                      {task.description && (
                        <p className="text-muted small mb-0" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="card-footer bg-transparent border-0 pt-0">
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {new Date(task.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <TaskModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={editTask ? handleUpdate : handleCreate}
        initial={editTask}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        show={!!deleteTarget}
        title="Delete Task"
        message={`Delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        confirmLabel="Delete"
        confirmVariant="danger"
      />

      {/* Toast notification */}
      {toast && (
        <div
          className="position-fixed bottom-0 end-0 m-4"
          style={{ zIndex: 9999 }}
        >
          <div className="toast show align-items-center text-bg-dark border-0" role="alert">
            <div className="d-flex">
              <div className="toast-body">
                <i className="bi bi-check-circle-fill me-2 text-success"></i>
                {toast}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast('')}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
