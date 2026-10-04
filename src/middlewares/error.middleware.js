const ApiError = require('../utils/apiError');

/**
 * Middleware for 404 Route Not Found
 */
const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Cannot find route '${req.method} ${req.originalUrl}' on this server`));
};

/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Invalid value for ${err.path}: '${err.value}'`;
    error = ApiError.badRequest(message);
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((val) => val.message);
    error = ApiError.badRequest('Validation error', details);
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for field '${field}'. Please use another value.`;
    error = new ApiError(409, message);
  }

  // Handle SyntaxError in request body (e.g. malformed JSON)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = ApiError.badRequest('Malformed JSON payload received');
  }

  const statusCode = error.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: error.message || 'Internal Server Error',
    ...(error.details && { details: error.details }),
    ...(isDevelopment && { stack: err.stack })
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
