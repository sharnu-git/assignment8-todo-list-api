import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import TodoFilters from './components/TodoFilters';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import { todoApi } from './api/todoApi';
import { Plus, Trash2, RefreshCw } from 'lucide-react';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    byStatus: { pending: 0, 'in-progress': 0, completed: 0 },
    byPriority: { low: 0, medium: 0, high: 0 },
    completionRate: '0%'
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 10
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const searchDebounceRef = useRef(null);

  // Toast notification helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch todos with active filters
  const fetchTodoList = useCallback(async (currentFilters = filters) => {
    try {
      setIsLoading(true);
      const res = await todoApi.getTodos(currentFilters);
      if (res && res.data) {
        setTodos(res.data.todos || []);
        setPagination(res.data.pagination || {});
        setIsOnline(true);
      }
    } catch (err) {
      console.error('Error fetching todos:', err);
      setIsOnline(false);
      addToast(err.message || 'Failed to load tasks from server', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [filters, addToast]);

  // Fetch aggregate metrics
  const fetchStats = useCallback(async () => {
    try {
      const res = await todoApi.getStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  // Refresh both list and stats
  const refreshAll = useCallback(() => {
    fetchTodoList();
    fetchStats();
  }, [fetchTodoList, fetchStats]);

  // Initial load
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Handle filter / search changes
  const handleFilterChange = (key, value) => {
    if (key === 'search') {
      setFilters((prev) => ({ ...prev, search: value, page: 1 }));
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
        fetchTodoList({ ...filters, search: value, page: 1 });
      }, 350);
    } else if (key === 'sort') {
      const newFilters = { ...filters, sortBy: value.sortBy, order: value.order, page: 1 };
      setFilters(newFilters);
      fetchTodoList(newFilters);
    } else {
      const newFilters = { ...filters, [key]: value, page: 1 };
      setFilters(newFilters);
      fetchTodoList(newFilters);
    }
  };

  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    fetchTodoList(newFilters);
  };

  // Open creation modal
  const handleOpenCreate = () => {
    setEditingTodo(null);
    setIsFormOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  // Submit task (create or update)
  const handleFormSubmit = async (formData) => {
    try {
      if (editingTodo) {
        await todoApi.updateTodo(editingTodo.id, formData);
        addToast(`Task "${formData.title}" updated successfully!`, 'success');
      } else {
        await todoApi.createTodo(formData);
        addToast(`Task "${formData.title}" created successfully!`, 'success');
      }
      refreshAll();
    } catch (err) {
      addToast(err.message || 'Operation failed. Please try again.', 'error');
      throw err;
    }
  };

  // Toggle status (Quick check toggle)
  const handleToggleStatus = async (todo) => {
    try {
      const targetStatus = todo.status === 'completed' ? 'pending' : 'completed';
      // Optimistic update
      setTodos((prev) =>
        prev.map((item) =>
          item.id === todo.id
            ? { ...item, status: targetStatus, isCompleted: targetStatus === 'completed' }
            : item
        )
      );

      await todoApi.toggleStatus(todo.id, todo.status);
      addToast(
        `Task marked as ${targetStatus === 'completed' ? 'completed ✓' : 'pending'}`,
        'success'
      );
      fetchStats();
    } catch (err) {
      addToast(err.message || 'Failed to update task status.', 'error');
      fetchTodoList();
    }
  };

  // Delete single task
  const handleDeleteTodo = (todo) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Task',
      message: `Are you sure you want to delete "${todo.title}"?`,
      onConfirm: async () => {
        try {
          await todoApi.deleteTodo(todo.id);
          addToast('Task deleted successfully', 'success');
          refreshAll();
        } catch (err) {
          addToast(err.message || 'Failed to delete task', 'error');
        }
      }
    });
  };

  // Clear completed tasks
  const handleClearCompleted = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Clear Completed Tasks',
      message: 'Are you sure you want to permanently delete all completed tasks?',
      onConfirm: async () => {
        try {
          const res = await todoApi.clearCompleted();
          addToast(res.message || 'Completed tasks cleared', 'success');
          refreshAll();
        } catch (err) {
          addToast(err.message || 'Failed to clear completed tasks', 'error');
        }
      }
    });
  };

  const hasCompletedTasks = (stats.byStatus && stats.byStatus.completed > 0);

  return (
    <div className="app-container" id="taskflow-root">
      {/* Navigation */}
      <Navbar isOnline={isOnline} onRefresh={refreshAll} />

      {/* Analytics Overview Cards */}
      <StatsOverview stats={stats} />

      {/* Main Action Header */}
      <div className="action-header">
        <h2 className="section-title">
          <span>Task Dashboard</span>
          <button
            type="button"
            className="btn-icon"
            onClick={refreshAll}
            title="Refresh list"
            aria-label="Refresh list"
          >
            <RefreshCw size={16} />
          </button>
        </h2>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {hasCompletedTasks && (
            <button
              type="button"
              id="clear-completed-btn"
              className="btn btn-danger-outline"
              onClick={handleClearCompleted}
            >
              <Trash2 size={16} /> Clear Completed
            </button>
          )}

          <button
            type="button"
            id="create-task-main-btn"
            className="btn btn-primary"
            onClick={handleOpenCreate}
          >
            <Plus size={18} /> Add New Task
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <TodoFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Todo List View */}
      <TodoList
        todos={todos}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onToggleStatus={handleToggleStatus}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteTodo}
        onOpenCreate={handleOpenCreate}
      />

      {/* Create / Edit Modal Form */}
      <TodoForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTodo}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
      />

      {/* Toast Feedback Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
