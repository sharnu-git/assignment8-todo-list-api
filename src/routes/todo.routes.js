const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');
const {
  validateMongoId,
  validateCreateTodo,
  validateUpdateTodo
} = require('../middlewares/validation.middleware');

// Statistical overview route (placed before :id route)
router.get('/overview/stats', todoController.getTodoStats);

// Bulk delete completed todos route (placed before :id route)
router.delete('/clear/completed', todoController.deleteCompletedTodos);

// Base collection routes
router
  .route('/')
  .get(todoController.getAllTodos)
  .post(validateCreateTodo, todoController.createTodo);

// Individual item routes
router
  .route('/:id')
  .get(validateMongoId, todoController.getTodoById)
  .put(validateMongoId, validateUpdateTodo, todoController.updateTodo)
  .patch(validateMongoId, validateUpdateTodo, todoController.updateTodo)
  .delete(validateMongoId, todoController.deleteTodo);

module.exports = router;
