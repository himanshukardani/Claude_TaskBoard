import React from 'react';

/**
 * Renders a colour-coded badge for task statuses.
 */
export default function StatusBadge({ status }) {
  const config = {
    'To Do':       { cls: 'badge-todo',       icon: 'bi-circle',         label: 'To Do'       },
    'In Progress': { cls: 'badge-inprogress',  icon: 'bi-arrow-clockwise', label: 'In Progress' },
    'Done':        { cls: 'badge-done',        icon: 'bi-check-circle',   label: 'Done'        },
  };

  const { cls, icon, label } = config[status] || config['To Do'];

  return (
    <span className={`badge rounded-pill px-2 py-1 ${cls}`} style={{ fontSize: '0.75rem' }}>
      <i className={`bi ${icon} me-1`}></i>
      {label}
    </span>
  );
}
