import React from 'react';
import TodoItem from './TodoItem';
import { ClipboardList, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TodoList({
  todos,
  isLoading,
  pagination,
  onPageChange,
  onToggleStatus,
  onEdit,
  onDelete,
  onOpenCreate
}) {
  if (isLoading) {
    return (
      <div className="todo-list-wrapper" id="todo-loading-skeletons">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="empty-state" id="todo-empty-state">
        <div className="empty-icon">
          <ClipboardList size={28} />
        </div>
        <h3 className="empty-title">No tasks found</h3>
        <p className="empty-desc">
          You don't have any tasks matching your current filters. Add a new task to stay organized!
        </p>
        <button
          type="button"
          id="empty-state-create-btn"
          className="btn btn-primary"
          onClick={onOpenCreate}
          style={{ marginTop: '0.5rem' }}
        >
          <Plus size={16} /> Create Task
        </button>
      </div>
    );
  }

  return (
    <div className="todo-list-wrapper" id="todo-items-container">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id || todo._id}
          todo={todo}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination" id="todo-pagination">
          <span>
            Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} total items)
          </span>
          <div className="pagination-controls">
            <button
              type="button"
              id="pagination-prev-btn"
              className="btn btn-secondary"
              disabled={!pagination.hasPrevPage}
              onClick={() => onPageChange(pagination.page - 1)}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              type="button"
              id="pagination-next-btn"
              className="btn btn-secondary"
              disabled={!pagination.hasNextPage}
              onClick={() => onPageChange(pagination.page + 1)}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
