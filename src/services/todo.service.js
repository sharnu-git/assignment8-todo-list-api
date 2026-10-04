const Todo = require('../models/todo.model');
const ApiError = require('../utils/apiError');

class TodoService {
  /**
   * Create a new Todo item
   */
  async createTodo(todoData) {
    // If status is passed as completed, ensure isCompleted is true
    if (todoData.status === 'completed') {
      todoData.isCompleted = true;
    } else if (todoData.isCompleted === true) {
      todoData.status = 'completed';
    }

    const todo = new Todo(todoData);
    return await todo.save();
  }

  /**
   * Get all todos with filtering, searching, sorting, and pagination
   */
  async getAllTodos(query = {}) {
    const {
      status,
      priority,
      isCompleted,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = query;

    const filter = {};

    // Filter by status
    if (status) {
      filter.status = status.toLowerCase();
    }

    // Filter by priority
    if (priority) {
      filter.priority = priority.toLowerCase();
    }

    // Filter by completion flag
    if (isCompleted !== undefined) {
      filter.isCompleted = isCompleted === 'true' || isCompleted === true;
    }

    // Search by title or description
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * limitNumber;

    const sortOrder = order.toLowerCase() === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const [todos, total] = await Promise.all([
      Todo.find(filter).sort(sortOptions).skip(skip).limit(limitNumber),
      Todo.countDocuments(filter)
    ]);

    return {
      todos,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber) || 1,
        hasNextPage: pageNumber * limitNumber < total,
        hasPrevPage: pageNumber > 1
      }
    };
  }

  /**
   * Retrieve a single Todo by ID
   */
  async getTodoById(id) {
    const todo = await Todo.findById(id);
    if (!todo) {
      throw ApiError.notFound(`Todo with ID '${id}' was not found`);
    }
    return todo;
  }

  /**
   * Update a Todo by ID
   */
  async updateTodo(id, updateData) {
    // Keep isCompleted and status synchronized if either is modified
    if (updateData.status) {
      updateData.isCompleted = updateData.status.toLowerCase() === 'completed';
    } else if (updateData.isCompleted !== undefined) {
      updateData.status = updateData.isCompleted ? 'completed' : 'pending';
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedTodo) {
      throw ApiError.notFound(`Todo with ID '${id}' was not found`);
    }

    return updatedTodo;
  }

  /**
   * Delete a Todo by ID
   */
  async deleteTodo(id) {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      throw ApiError.notFound(`Todo with ID '${id}' was not found`);
    }
    return deletedTodo;
  }

  /**
   * Delete all completed todos
   */
  async deleteCompletedTodos() {
    const result = await Todo.deleteMany({
      $or: [{ status: 'completed' }, { isCompleted: true }]
    });
    return {
      deletedCount: result.deletedCount
    };
  }

  /**
   * Retrieve statistical summary for todos
   */
  async getStats() {
    const [statusStats, priorityStats, totalCount] = await Promise.all([
      Todo.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Todo.aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]),
      Todo.countDocuments()
    ]);

    const statusCounts = {
      pending: 0,
      'in-progress': 0,
      completed: 0
    };
    statusStats.forEach((item) => {
      if (item._id && statusCounts.hasOwnProperty(item._id)) {
        statusCounts[item._id] = item.count;
      }
    });

    const priorityCounts = {
      low: 0,
      medium: 0,
      high: 0
    };
    priorityStats.forEach((item) => {
      if (item._id && priorityCounts.hasOwnProperty(item._id)) {
        priorityCounts[item._id] = item.count;
      }
    });

    const completionRate = totalCount > 0
      ? Number(((statusCounts.completed / totalCount) * 100).toFixed(2))
      : 0;

    return {
      total: totalCount,
      byStatus: statusCounts,
      byPriority: priorityCounts,
      completionRate: `${completionRate}%`
    };
  }
}

module.exports = new TodoService();
