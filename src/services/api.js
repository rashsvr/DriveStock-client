import axios from 'axios';

// Base URL for your API
const API_BASE_URL = 'http://localhost:3000/api';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    let message = 'An unexpected error occurred';
    let code = 500;
    let isBigError = false;

    // Big Errors: Redirect to ErrorPage
    if (!navigator.onLine) {
      message = 'No internet connection. Please check your network.';
      code = 0; // Custom code for no internet
      isBigError = true;
    } else if (status === 400 && !error.response?.data?.message) {
      message = 'Bad request. Something went wrong with the system.';
      code = 400;
      isBigError = true;
    } else if (status === 500) {
      message = 'Internal server error. Please try again later.';
      code = 500;
      isBigError = true;
    }
    // Small Errors: Handle in UI
    else if (status === 400) {
      message = error.response?.data?.message || 'Invalid request. Please check your input.';
      code = 400;
    } else if (status === 401) {
      message = error.response?.data?.message || 'Invalid credentials. Please try again.';
      code = 401;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } else if (status === 404) {
      message = error.response?.data?.message || 'Resource not found.';
      code = 404;
    } else if (status === 409) {
      message = error.response?.data?.message || 'Email already exists.';
      code = 409;
    }

    // Throw error with type indicator
    throw { message, code, isBigError, originalError: error };
  }
);

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Auth API Calls
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

// Buyer Product Exploration API Calls (No authentication required)
export const getAllProducts = async (page = 1, limit = 10) => {
  const response = await apiClient.get('/buyer/products', { params: { page, limit } });
  return response.data;
};

export const searchProducts = async (filters) => {
  const response = await apiClient.get('/buyer/products/search', { params: filters });
  return response.data;
};

export const getProductById = async (productId) => {
  const response = await apiClient.get(`/buyer/products/${productId}`);
  return response.data;
};

// Buyer Cart API Calls (Requires authentication)
export const addToCart = async (productId, quantity) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to add to cart', code: 401, isBigError: false };
  const response = await apiClient.post('/buyer/cart/add', { productId, quantity });
  return response.data;
};

export const viewCart = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view cart', code: 401, isBigError: false };
  const response = await apiClient.get('/buyer/cart');
  return response.data;
};

export const removeFromCart = async (productId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to remove from cart', code: 401, isBigError: false };
  const response = await apiClient.delete(`/buyer/cart/remove/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to clear cart', code: 401, isBigError: false };
  const response = await apiClient.delete('/buyer/cart/clear');
  return response.data;
};

// Buyer Order API Calls (Requires authentication)
export const createOrder = async (orderData) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to create an order', code: 401, isBigError: false };
  const response = await apiClient.post('/buyer/order', orderData);
  return response.data;
};

export const cancelOrder = async (orderId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to cancel an order', code: 401, isBigError: false };
  const response = await apiClient.post(`/buyer/order/cancel/${orderId}`);
  return response.data;
};

export const trackOrder = async (orderId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to track an order', code: 401, isBigError: false };
  const response = await apiClient.get(`/buyer/order/track/${orderId}`);
  return response.data;
};

export const getOrderHistory = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view order history', code: 401, isBigError: false };
  const response = await apiClient.get('/buyer/orders');
  return response.data;
};

// Profile Management API Calls (Requires authentication)
export const getProfile = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view profile', code: 401, isBigError: false };
  const response = await apiClient.get('/profile');
  return response.data;
};

// Error handling utility
const handleApiError = (error) => {
  console.error('API Error:', error.message || error);
  throw error; // Rethrow the structured error
};

// Wrap all requests with try-catch for centralized error handling
const apiRequest = async (requestFn) => {
  try {
    return await requestFn();
  } catch (error) {
    handleApiError(error);
  }
};

// Export wrapped functions
export default {
  login: (email, password) => apiRequest(() => login(email, password)),
  register: (userData) => apiRequest(() => register(userData)),
  isAuthenticated,
  logout,
  getAllProducts: (page, limit) => apiRequest(() => getAllProducts(page, limit)),
  searchProducts: (filters) => apiRequest(() => searchProducts(filters)),
  getProductById: (productId) => apiRequest(() => getProductById(productId)),
  addToCart: (productId, quantity) => apiRequest(() => addToCart(productId, quantity)),
  viewCart: () => apiRequest(() => viewCart()),
  removeFromCart: (productId) => apiRequest(() => removeFromCart(productId)),
  clearCart: () => apiRequest(() => clearCart()),
  createOrder: (orderData) => apiRequest(() => createOrder(orderData)),
  cancelOrder: (orderId) => apiRequest(() => cancelOrder(orderId)),
  trackOrder: (orderId) => apiRequest(() => trackOrder(orderId)),
  getOrderHistory: () => apiRequest(() => getOrderHistory()),
  getProfile: () => apiRequest(() => getProfile()),
};