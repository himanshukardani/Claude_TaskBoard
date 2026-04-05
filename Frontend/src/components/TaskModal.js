import React, { useState, useEffect } from 'react';

const STATUSES = ['To Do', 'In Progress', 'Done'];

/**
 * TaskModal — used for both creating and editing a task.
 * Props:
 *   show       — boolean visibility
 *   onClose    — fn to close the modal
 *   onSubmit   — fn(data) called with { title, description, status }
 *   initial    — task object for editing (null = create mode)
 */
export default function TaskModal({ show, onClose, onSubmit, initial }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form when editing
  useEffect(() => {
    if (initial) {
      setTitle(initial.title || '');
      setDescription(initial.description || '');
      setStatus(initial.status || 'To Do');
    } else {
      setTitle('');
      setDescription('');
      setStatus('To Do');
    }
    setError('');
  }, [initial, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }

    setLoading(true);
    setError('');
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), status });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1050 }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: 16, border: 'none' }}>

            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">
                <i className={`bi bi-${initial ? 'pencil' : 'plus-circle'} me-2 text-primary`}></i>
                {initial ? 'Edit Task' : 'Create New Task'}
              </h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body pt-2">
                {error && (
                  <div className="alert alert-danger py-2 small">{error}</div>
                )}

                {/* Title */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Add some details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Status */}
                <div className="mb-1">
                  <label className="form-label fw-semibold small">Status</label>
                  <div className="d-flex gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`btn btn-sm flex-fill ${status === s ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setStatus(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-light" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                  ) : (
                    <><i className={`bi bi-${initial ? 'check-lg' : 'plus-lg'} me-1`}></i>
                    {initial ? 'Save Changes' : 'Create Task'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
