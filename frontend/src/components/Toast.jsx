import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toast-container">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 size={18} color="var(--accent-emerald)" />,
          error: <AlertCircle size={18} color="var(--accent-rose)" />,
          info: <Info size={18} color="var(--accent-cyan)" />
        };

        return (
          <div key={toast.id} className={`toast ${toast.type || 'info'}`} id={`toast-${toast.id}`}>
            {icons[toast.type] || icons.info}
            <span className="toast-message">{toast.message}</span>
            <button
              className="btn-icon"
              onClick={() => onDismiss(toast.id)}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
