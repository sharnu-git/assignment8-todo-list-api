import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';

export default function TodoForm({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    tags: ''
  });
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
        tags: ''
      });
    }
    setValidationError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'title' && value.trim()) {
      setValidationError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setValidationError('Please enter a task title.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      tags: formData.tags
        ? formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []
    };

    try {
      setIsSubmitting(true);
      await onSubmit(payload);
      onClose();
    } catch {
      // Handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="todo-modal-overlay">
      <div
        className="modal-content"
        id="todo-form-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {initialData ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {validationError && (
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid var(--accent-rose)',
                  color: '#fda4af',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem'
                }}
              >
                {validationError}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="todo-form-title" className="form-label">
                Task Title *
              </label>
              <input
                type="text"
                id="todo-form-title"
                name="title"
                className="form-input"
                placeholder="e.g. Complete Assignment 8 Integration"
                value={formData.title}
                onChange={handleChange}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="todo-form-desc" className="form-label">
                Description
              </label>
              <textarea
                id="todo-form-desc"
                name="description"
                className="form-textarea"
                placeholder="Optional details, notes, or steps..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="todo-form-status" className="form-label">
                  Status
                </label>
                <select
                  id="todo-form-status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="todo-form-priority" className="form-label">
                  Priority
                </label>
                <select
                  id="todo-form-priority"
                  name="priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="todo-form-duedate" className="form-label">
                  Due Date
                </label>
                <input
                  type="date"
                  id="todo-form-duedate"
                  name="dueDate"
                  className="form-input"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="todo-form-tags" className="form-label">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="todo-form-tags"
                  name="tags"
                  className="form-input"
                  placeholder="e.g. work, urgent, coding"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-todo-form-btn"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Saving...'
              ) : initialData ? (
                <>
                  <Save size={16} /> Update Task
                </>
              ) : (
                <>
                  <Plus size={16} /> Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
