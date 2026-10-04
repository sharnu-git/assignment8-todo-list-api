import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for unified response handling and error extraction
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let errorMessage = 'Network error: could not connect to server.';
    let errorDetails = null;

    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data?.message || `Server returned error (${error.response.status})`;
      errorDetails = error.response.data?.details || null;
    } else if (error.request) {
      // Request made but no response received
      errorMessage = 'No response received from backend server. Make sure the Node.js server is running on port 5000.';
    } else {
      errorMessage = error.message;
    }

    const customError = new Error(errorMessage);
    customError.details = errorDetails;
    customError.status = error.response?.status;

    return Promise.reject(customError);
  }
);

export default apiClient;
