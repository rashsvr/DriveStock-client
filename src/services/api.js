import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    let message = 'An unexpected error occurred';
    let code = 500;
    let isBigError = false;

    if (!navigator.onLine) {
      message = 'No internet connection. Please check your network.';
      code = 0;
      isBigError = true;
    } else if (status === 400 && !error.response?.data?.message) {
      message = 'Bad request. Something went wrong with the system.';
      code = 400;
      isBigError = true;
    } else if (status === 500) {
      message = 'Internal server error. Please try again later.';
      code = 500;
      isBigError = true;
    } else if (status === 400) {
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

    throw { message, code, isBigError, originalError: error };
  }
);

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const getAllProducts = async (page = 1, limit = 10) => {
  const response = await apiClient.get('/buyer/products', { params: { page, limit } });
  return response.data;
};

export const getProductFilterOptions = async () => {
  const response = await apiClient.get('/buyer/product-filter-options');
  return response.data;
};

export const searchProducts = async (filters) => {
  const processedFilters = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      processedFilters[key] = value.join(',');
    } else if (value && value !== 'All') {
      processedFilters[key] = value;
    }
  });
  const response = await apiClient.get('/buyer/products/search', { params: processedFilters });
  return response.data;
};

export const getProductById = async (productId) => {
  const response = await apiClient.get(`/buyer/products/${productId}`);
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to add to cart', code: 401, isBigError: false };
  const response = await apiClient.post('/buyer/cart/add', { productId, quantity });
  return response.data;
};

export const viewCart = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view cart', code: 401, isBigError: false };
  const response = await apiClient.get('/buyer/cart');
  return response.data;
};

export const updateCartItem = async (productId, quantity) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to update cart', code: 401, isBigError: false };
  const response = await apiClient.post('/buyer/cart/update', { productId, quantity });
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

export const getProfile = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view profile', code: 401, isBigError: false };
  const response = await apiClient.get('/profile');
  return response.data;
};

export const getImageById = async (imageId) => {
  const response = await apiClient.get(`/uploads/${imageId}`, {
    responseType: 'blob', // Important for handling binary image data
  });
  return response.data;
};

const handleApiError = (error) => {
  console.error('API Error:', error.message || error);
  throw error;
};

const apiRequest = async (requestFn) => {
  try {
    return await requestFn();
  } catch (error) {
    handleApiError(error);
  }
};


export default {
  login: (email, password) => apiRequest(() => login(email, password)),
  register: (userData) => apiRequest(() => register(userData)),
  isAuthenticated,
  logout,
  getAllProducts: (page, limit) => apiRequest(() => getAllProducts(page, limit)),
  getProductFilterOptions: () => apiRequest(() => getProductFilterOptions()),
  searchProducts: (filters) => apiRequest(() => searchProducts(filters)),
  getProductById: (productId) => apiRequest(() => getProductById(productId)),
  addToCart: (productId, quantity) => apiRequest(() => addToCart(productId, quantity)),
  viewCart: () => apiRequest(() => viewCart()),
  updateCartItem: (productId, quantity) => apiRequest(() => updateCartItem(productId, quantity)),
  removeFromCart: (productId) => apiRequest(() => removeFromCart(productId)),
  clearCart: () => apiRequest(() => clearCart()),
  createOrder: (orderData) => apiRequest(() => createOrder(orderData)),
  cancelOrder: (orderId) => apiRequest(() => cancelOrder(orderId)),
  trackOrder: (orderId) => apiRequest(() => trackOrder(orderId)),
  getOrderHistory: () => apiRequest(() => getOrderHistory()),
  getProfile: () => apiRequest(() => getProfile()),
  getImageById: (imageId) => apiRequest(() => getImageById(imageId)),
};