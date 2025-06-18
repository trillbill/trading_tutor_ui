import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8080',
  withCredentials: true, // Important: This allows cookies to be sent with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor to handle authentication errors and token refresh
api.interceptors.response.use(
  (response) => {
    // Check if token was refreshed by the server
    if (response.headers['x-token-refreshed'] === 'true') {
      // Optionally dispatch an event or update context here
      window.dispatchEvent(new CustomEvent('tokenRefreshed'));
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration
    if (error.response?.status === 401) {
      const errorData = error.response.data;
      
      // If token is expired, try to refresh it once
      if (errorData?.expired && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Try to refresh the token
          await api.post('/api/auth/refresh-token');
          
          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, redirect to login
          window.dispatchEvent(new CustomEvent('authExpired'));
          return Promise.reject(error);
        }
      } else {
        // For other auth errors or if retry already attempted
        window.dispatchEvent(new CustomEvent('authError', { 
          detail: { error: errorData } 
        }));
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;