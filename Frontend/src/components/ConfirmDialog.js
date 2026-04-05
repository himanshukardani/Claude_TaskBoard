import React from 'react';

/**
 * A simple confirmation dialog modal.
 * Props: show, title, message, onConfirm, onCancel, loading, confirmLabel, confirmVariant
 */
export default function ConfirmDialog({
  show,
  title = 'Confirm',
  message = 'Are you sure?',
  onConfirm,
  onCancel,
  loading = false,
  confirmLabel = 'Delete',
  confirmVariant = 'danger',
}) {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onCancel} />
      <div className="modal fade show d-block" style={{ zIndex: 1050 }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content" style={{ borderRadius: 16, border: 'none' }}>
            <div className="modal-body text-center p-4">
              <div className="mb-3">
                <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h6 className="fw-bold mb-2">{title}</h6>
              <p className="text-muted small mb-4">{message}</p>
              <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-light btn-sm px-4" onClick={onCancel} disabled={loading}>
                  Cancel
                </button>
                <button
                  className={`btn btn-${confirmVariant} btn-sm px-4`}
                  onClick={onConfirm}
                  disabled={loading}
                >
                  {loading
                    ? <span className="spinner-border spinner-border-sm" />
                    : confirmLabel
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
