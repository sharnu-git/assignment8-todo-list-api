# To-Do List Backend API (Node.js, Express.js & MongoDB)

A production-grade RESTful API backend for a To-Do List application built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**, following clean architectural principles (**Controller-Service-Routes pattern**), robust input validation, centralized error handling, and complete Postman testing suite.

---

## 📁 Project Structure

```
Assignment8/
├── .env                              # Environment configuration (active)
├── .env.example                      # Template environment variables
├── .gitignore                        # Git ignore patterns
├── package.json                      # Project dependencies & scripts
├── postman_collection.json           # Ready-to-import Postman test collection
├── test_endpoints.js                 # Automated API test suite
├── README.md                         # Project documentation
└── src/
    ├── config/
    │   └── db.js                     # MongoDB connection with Mongoose
    ├── controllers/
    │   └── todo.controller.js        # Request extraction & response handling
    ├── middlewares/
    │   ├── error.middleware.js       # Centralized 404 & global error handling
    │   └── validation.middleware.js  # Schema & input validation logic
    ├── models/
    │   └── todo.model.js             # Mongoose Schema & Indexes
    ├── routes/
    │   └── todo.routes.js            # Express API endpoint routes
    ├── services/
    │   └── todo.service.js           # Business logic & Database queries
    ├── utils/
    │   ├── apiError.js               # Standardized Error class
    │   ├── apiResponse.js            # Standardized API response format
    │   └── asyncHandler.js           # Async try/catch error wrapper
    ├── app.js                        # Express app initialization & middleware
    └── server.js                     # Server entry point & process management
```

---

## ⚙️ Architecture: Controller-Service-Routes Pattern

This project implements a clean separation of concerns:

1. **Routes (`src/routes/todo.routes.js`)**:
   - Maps HTTP methods and URI paths to controller methods.
   - Enforces validation middlewares (`validateMongoId`, `validateCreateTodo`, `validateUpdateTodo`) before requests reach controllers.

2. **Controllers (`src/controllers/todo.controller.js`)**:
   - Extracts parameters (`req.params`, `req.query`, `req.body`).
   - Delegates business operations to the Service layer.
   - Returns standardized HTTP responses with status codes (`200 OK`, `201 Created`, etc.) using `ApiResponse`.

3. **Services (`src/services/todo.service.js`)**:
   - Encapsulates pure business logic and queries directly against the `Todo` Mongoose model.
   - Performs filtering, pagination, sorting, text search, and MongoDB aggregation pipelines.
   - Throws operational `ApiError` instances if resources are missing or invalid.

4. **Models (`src/models/todo.model.js`)**:
   - Defines Mongoose schema with type constraints, defaults, and validation messages.
   - Automatically synchronizes `status: 'completed'` with `isCompleted: true`.
   - Defines database indexes (`status`, `priority`, `createdAt`, and text index on `title` + `description`).

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node.js v24)
- **MongoDB**: Local MongoDB instance or MongoDB Atlas URI

### 2. Installation
Clone or navigate to the project directory and install dependencies:
```bash
npm install
```

### 3. Configure Environment Variables
A `.env` file has been created. Customize if necessary:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/todo_app_db
NODE_ENV=development
```

### 4. Running the Application
- **Development Mode (with auto-reload via Nodemon):**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm start
  ```

Server will start on: `http://localhost:5000`

---

## 📡 API Endpoints Reference

### Base URL: `http://localhost:5000/api/todos`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server health check |
| `POST` | `/api/todos` | Create a new to-do task |
| `GET` | `/api/todos` | Retrieve all to-dos (supports filters, pagination, search, sorting) |
| `GET` | `/api/todos/:id` | Retrieve a single to-do by its MongoDB ID |
| `PUT` | `/api/todos/:id` | Full update of a to-do item |
| `PATCH` | `/api/todos/:id` | Partial update of a to-do item (e.g. toggle status) |
| `DELETE` | `/api/todos/:id` | Delete a single to-do item |
| `DELETE` | `/api/todos/clear/completed` | Bulk delete all completed to-do items |
| `GET` | `/api/todos/overview/stats` | Retrieve aggregate metrics (total, by status, by priority, completion rate) |

---

### Request & Response Examples

#### 1. Create a To-Do
- **Endpoint**: `POST /api/todos`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Build Node.js backend",
    "description": "Implement Controller-Service architecture for assignment 8",
    "priority": "high",
    "status": "pending",
    "dueDate": "2026-10-15T00:00:00.000Z",
    "tags": ["nodejs", "express", "mongodb"]
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Todo created successfully",
    "data": {
      "id": "6ac289329e124a0c9572bfbd",
      "title": "Build Node.js backend",
      "description": "Implement Controller-Service architecture for assignment 8",
      "status": "pending",
      "priority": "high",
      "dueDate": "2026-10-15T00:00:00.000Z",
      "tags": ["nodejs", "express", "mongodb"],
      "isCompleted": false,
      "createdAt": "2026-10-04T17:13:22.951Z",
      "updatedAt": "2026-10-04T17:13:22.951Z"
    }
  }
  ```

---

#### 2. Get All To-Dos (with Filtering & Pagination)
- **Endpoint**: `GET /api/todos?status=pending&priority=high&page=1&limit=10&sortBy=createdAt&order=desc`
- **Query Parameters**:
  - `status`: Filter by `'pending'`, `'in-progress'`, or `'completed'`
  - `priority`: Filter by `'low'`, `'medium'`, or `'high'`
  - `isCompleted`: Filter by boolean (`true` or `false`)
  - `search`: Keyword search across `title` and `description`
  - `sortBy`: Field to sort by (default: `createdAt`)
  - `order`: `'asc'` or `'desc'` (default: `desc`)
  - `page`: Page number (default: `1`)
  - `limit`: Items per page (default: `10`, max: `100`)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Todos retrieved successfully",
    "data": {
      "todos": [ ... ],
      "pagination": {
        "total": 12,
        "page": 1,
        "limit": 10,
        "totalPages": 2,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
  }
  ```

---

#### 3. Update To-Do (Partial Update / Toggle Status)
- **Endpoint**: `PATCH /api/todos/:id`
- **Request Body**:
  ```json
  {
    "status": "completed"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Todo updated successfully",
    "data": {
      "id": "6ac289329e124a0c9572bfbd",
      "title": "Build Node.js backend",
      "status": "completed",
      "isCompleted": true,
      "updatedAt": "2026-10-04T17:15:00.000Z"
    }
  }
  ```

---

#### 4. To-Do Analytics / Statistics
- **Endpoint**: `GET /api/todos/overview/stats`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Todo statistics retrieved successfully",
    "data": {
      "total": 5,
      "byStatus": {
        "pending": 2,
        "in-progress": 1,
        "completed": 2
      },
      "byPriority": {
        "low": 1,
        "medium": 2,
        "high": 2
      },
      "completionRate": "40%"
    }
  }
  ```

---

## 🛡️ Error Handling & Validation

All error responses adhere to a consistent JSON structure:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "details": [
    "Field \"title\" is required and must be a non-empty string."
  ]
}
```

The error handling middleware automatically handles:
- **Input Validation Failures**: Returns HTTP `400 Bad Request` with field details.
- **Invalid MongoDB ID**: Checks for valid 24-hex ObjectId, returns HTTP `400 Bad Request`.
- **Resource Not Found**: Throws HTTP `404 Not Found` for non-existent IDs.
- **Undefined Routes**: Catches unmatched routes with HTTP `404 Not Found`.
- **Malformed JSON**: Catches parsing syntax errors with HTTP `400 Bad Request`.

---

## 🧪 Testing with Postman

A pre-configured Postman collection is included in the project: `postman_collection.json`.

### How to Import and Test:
1. Open **Postman**.
2. Click **Import** (top left).
3. Select the file: `c:\Programming\Assignment8\postman_collection.json`.
4. The collection will appear under **Collections** as **`To-Do List API (Assignment 8)`**.
5. Ensure your server is running:
   ```bash
   npm run dev
   ```
6. The collection includes pre-configured tests and an auto-variable `{{todoId}}`:
   - Running the **1. Create New Todo (POST)** request will automatically store the newly created ID into the collection variable `todoId`.
   - Subsequent requests (**Get By ID**, **Update**, **Delete**) will automatically use this `todoId`!
7. You can also run the entire folder via Postman's **Collection Runner** to execute all tests automatically.

---

## 🤖 Automated Test Script

You can also run the built-in end-to-end automated test suite anytime with:
```bash
node test_endpoints.js
```
This tests database connectivity, validation errors, CRUD lifecycle, analytics aggregation, and clean deletion against the live database.
