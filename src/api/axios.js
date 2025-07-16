import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // Use base URL from env file
  timeout: 10000, // Optional: Set timeout for all requests
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: Interceptors for handling request/response globally

// Request interceptor to add authorization token
axiosInstance.interceptors.request.use(
  config => {
    // Always set Content-Type
    config.headers['Content-Type'] = 'application/json';

    // Always set x-auth-token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }

    // Always set x-tenant
    config.headers['x-tenant'] = 'mentoring';

    // Optionally: set organization-id if available
    const orgHeader = localStorage.getItem('custom_org');
    if (orgHeader) {
      config.headers['organization-id'] = orgHeader;
    }

    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // Handle global error (e.g., unauthorized)
    if (error.response && error.response.status === 401) {
      // Redirect to login or show a message
      // Example: window.location.href = '/login'; or use a state management solution for routing
      localStorage.clear()
      // Use `window.location.href` since `useNavigate` isn't directly usable here
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
