import apiClient from './apiClient';

export const todoApi = {
  /**
   * Fetch todos with filtering, search, sorting, and pagination
   */
  async getTodos(params = {}) {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== '' && params[key] !== undefined && params[key] !== null && params[key] !== 'all') {
        cleanParams[key] = params[key];
      }
    });
    return await apiClient.get('/todos', { params: cleanParams });
  },

  /**
   * Fetch single todo by ID
   */
  async getTodoById(id) {
    return await apiClient.get(`/todos/${id}`);
  },

  /**
   * Create a new task
   */
  async createTodo(data) {
    return await apiClient.post('/todos', data);
  },

  /**
   * Update full or partial task details
   */
  async updateTodo(id, data) {
    return await apiClient.patch(`/todos/${id}`, data);
  },

  /**
   * Toggle task status between completed and pending
   */
  async toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    return await apiClient.patch(`/todos/${id}`, { status: newStatus });
  },

  /**
   * Delete a task by ID
   */
  async deleteTodo(id) {
    return await apiClient.delete(`/todos/${id}`);
  },

  /**
   * Bulk remove all completed tasks
   */
  async clearCompleted() {
    return await apiClient.delete('/todos/clear/completed');
  },

  /**
   * Fetch metrics and statistics
   */
  async getStats() {
    return await apiClient.get('/todos/overview/stats');
  },

  /**
   * Check backend server connectivity
   */
  async checkConnection() {
    try {
      const response = await apiClient.get('/todos/overview/stats');
      return { online: true, data: response };
    } catch {
      return { online: false };
    }
  }
};
