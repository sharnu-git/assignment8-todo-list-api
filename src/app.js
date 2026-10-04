const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const todoRoutes = require('./routes/todo.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check / root route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'To-Do List API is operational',
    endpoints: {
      todos: '/api/todos',
      stats: '/api/todos/overview/stats',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/todos', todoRoutes);

// 404 and Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
