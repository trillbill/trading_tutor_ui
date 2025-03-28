import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8080',
  withCredentials: true, // Important: This allows cookies to be sent with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We'll let the components handle 401 errors with AuthPrompt
    // instead of automatically redirecting
    return Promise.reject(error);
  }
);

export default api;