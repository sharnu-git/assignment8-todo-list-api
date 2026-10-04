const todoService = require('../services/todo.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

class TodoController {
  /**
   * @desc    Create a new Todo
   * @route   POST /api/todos
   */
  createTodo = asyncHandler(async (req, res) => {
    const newTodo = await todoService.createTodo(req.body);
    return ApiResponse.created(res, newTodo, 'Todo created successfully');
  });

  /**
   * @desc    Get all Todos with filters, search, sorting, and pagination
   * @route   GET /api/todos
   */
  getAllTodos = asyncHandler(async (req, res) => {
    const result = await todoService.getAllTodos(req.query);
    return ApiResponse.success(res, result, 'Todos retrieved successfully');
  });

  /**
   * @desc    Get a single Todo by ID
   * @route   GET /api/todos/:id
   */
  getTodoById = asyncHandler(async (req, res) => {
    const todo = await todoService.getTodoById(req.params.id);
    return ApiResponse.success(res, todo, 'Todo retrieved successfully');
  });

  /**
   * @desc    Update a Todo by ID (Full or Partial)
   * @route   PUT /api/todos/:id, PATCH /api/todos/:id
   */
  updateTodo = asyncHandler(async (req, res) => {
    const updatedTodo = await todoService.updateTodo(req.params.id, req.body);
    return ApiResponse.success(res, updatedTodo, 'Todo updated successfully');
  });

  /**
   * @desc    Delete a Todo by ID
   * @route   DELETE /api/todos/:id
   */
  deleteTodo = asyncHandler(async (req, res) => {
    const deletedTodo = await todoService.deleteTodo(req.params.id);
    return ApiResponse.success(res, deletedTodo, 'Todo deleted successfully');
  });

  /**
   * @desc    Delete all completed Todos
   * @route   DELETE /api/todos/clear/completed
   */
  deleteCompletedTodos = asyncHandler(async (req, res) => {
    const result = await todoService.deleteCompletedTodos();
    return ApiResponse.success(res, result, `${result.deletedCount} completed todo(s) removed successfully`);
  });

  /**
   * @desc    Get summary statistics for Todos
   * @route   GET /api/todos/overview/stats
   */
  getTodoStats = asyncHandler(async (req, res) => {
    const stats = await todoService.getStats();
    return ApiResponse.success(res, stats, 'Todo statistics retrieved successfully');
  });
}

module.exports = new TodoController();
