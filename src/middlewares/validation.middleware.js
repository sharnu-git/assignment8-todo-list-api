const mongoose = require('mongoose');
const ApiError = require('../utils/apiError');

const ALLOWED_STATUSES = ['pending', 'in-progress', 'completed'];
const ALLOWED_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Validate MongoDB ObjectId parameter
 */
const validateMongoId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(ApiError.badRequest(`Invalid ID format: '${id}'. Must be a valid 24-character MongoDB ObjectId.`));
  }
  next();
};

/**
 * Validate Todo creation payload
 */
const validateCreateTodo = (req, res, next) => {
  const { title, description, status, priority, dueDate, tags } = req.body;
  const errors = [];

  // Title validation
  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('Field "title" is required and must be a non-empty string.');
  } else if (title.trim().length > 150) {
    errors.push('Field "title" cannot exceed 150 characters.');
  }

  // Description validation
  if (description !== undefined && typeof description !== 'string') {
    errors.push('Field "description" must be a string.');
  } else if (description && description.length > 1000) {
    errors.push('Field "description" cannot exceed 1000 characters.');
  }

  // Status validation
  if (status !== undefined) {
    if (typeof status !== 'string' || !ALLOWED_STATUSES.includes(status.toLowerCase().trim())) {
      errors.push(`Field "status" must be one of: ${ALLOWED_STATUSES.join(', ')}.`);
    }
  }

  // Priority validation
  if (priority !== undefined) {
    if (typeof priority !== 'string' || !ALLOWED_PRIORITIES.includes(priority.toLowerCase().trim())) {
      errors.push(`Field "priority" must be one of: ${ALLOWED_PRIORITIES.join(', ')}.`);
    }
  }

  // DueDate validation
  if (dueDate !== undefined && dueDate !== null) {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push('Field "dueDate" must be a valid date format (e.g. YYYY-MM-DD or ISO 8601).');
    }
  }

  // Tags validation
  if (tags !== undefined && (!Array.isArray(tags) || !tags.every(t => typeof t === 'string'))) {
    errors.push('Field "tags" must be an array of strings.');
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Validation failed', errors));
  }

  next();
};

/**
 * Validate Todo update payload
 */
const validateUpdateTodo = (req, res, next) => {
  const { title, description, status, priority, dueDate, isCompleted, tags } = req.body;
  const errors = [];

  const providedKeys = Object.keys(req.body);
  if (providedKeys.length === 0) {
    return next(ApiError.badRequest('Request body cannot be empty for an update.'));
  }

  // Title validation
  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      errors.push('Field "title" must be a non-empty string.');
    } else if (title.trim().length > 150) {
      errors.push('Field "title" cannot exceed 150 characters.');
    }
  }

  // Description validation
  if (description !== undefined && typeof description !== 'string') {
    errors.push('Field "description" must be a string.');
  } else if (description && description.length > 1000) {
    errors.push('Field "description" cannot exceed 1000 characters.');
  }

  // Status validation
  if (status !== undefined) {
    if (typeof status !== 'string' || !ALLOWED_STATUSES.includes(status.toLowerCase().trim())) {
      errors.push(`Field "status" must be one of: ${ALLOWED_STATUSES.join(', ')}.`);
    }
  }

  // Priority validation
  if (priority !== undefined) {
    if (typeof priority !== 'string' || !ALLOWED_PRIORITIES.includes(priority.toLowerCase().trim())) {
      errors.push(`Field "priority" must be one of: ${ALLOWED_PRIORITIES.join(', ')}.`);
    }
  }

  // DueDate validation
  if (dueDate !== undefined && dueDate !== null) {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push('Field "dueDate" must be a valid date format.');
    }
  }

  // isCompleted validation
  if (isCompleted !== undefined && typeof isCompleted !== 'boolean') {
    errors.push('Field "isCompleted" must be a boolean (true or false).');
  }

  // Tags validation
  if (tags !== undefined && (!Array.isArray(tags) || !tags.every(t => typeof t === 'string'))) {
    errors.push('Field "tags" must be an array of strings.');
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Validation failed', errors));
  }

  next();
};

module.exports = {
  validateMongoId,
  validateCreateTodo,
  validateUpdateTodo
};
