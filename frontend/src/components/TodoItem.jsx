import React from 'react';
import { Check, Calendar, Tag, Edit3, Trash2 } from 'lucide-react';

export default function TodoItem({
  todo,
  onToggleStatus,
  onEdit,
  onDelete
}) {
  const isCompleted = todo.isCompleted || todo.status === 'completed';

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const formattedDate = formatDueDate(todo.dueDate);

  return (
    <div
      className={`todo-card ${todo.status || 'pending'} ${isCompleted ? 'completed' : ''}`}
      id={`todo-item-${todo.id}`}
    >
      {/* Checkbox */}
      <div className="todo-checkbox-wrapper">
        <button
          type="button"
          id={`toggle-todo-${todo.id}`}
          className={`custom-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={() => onToggleStatus(todo)}
          aria-label={isCompleted ? 'Mark task as pending' : 'Mark task as completed'}
        >
          {isCompleted && <Check size={14} strokeWidth={3} />}
        </button>
      </div>

      {/* Content */}
      <div className="todo-content">
        <div className="todo-header-line">
          <h3 className="todo-title">{todo.title}</h3>
          <div className="todo-actions">
            <button
              type="button"
              id={`edit-btn-${todo.id}`}
              className="btn-icon"
              onClick={() => onEdit(todo)}
              title="Edit Task"
              aria-label="Edit Task"
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              id={`delete-btn-${todo.id}`}
              className="btn-icon btn-icon-danger"
              onClick={() => onDelete(todo)}
              title="Delete Task"
              aria-label="Delete Task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {todo.description && (
          <p className="todo-desc">{todo.description}</p>
        )}

        <div className="todo-meta">
          {/* Status Badge */}
          <span className={`badge badge-${(todo.status || 'pending').replace('-', '')}`}>
            {todo.status || 'pending'}
          </span>

          {/* Priority Badge */}
          <span className={`badge badge-${todo.priority || 'medium'}`}>
            {todo.priority || 'medium'} priority
          </span>

          {/* Due Date */}
          {formattedDate && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={13} /> {formattedDate}
            </span>
          )}

          {/* Tags */}
          {Array.isArray(todo.tags) && todo.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
              <Tag size={12} color="var(--text-muted)" />
              {todo.tags.map((tag, idx) => (
                <span key={idx} className="tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
