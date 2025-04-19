import axios from 'axios';

/* The below code is defining a constant variable `API_BASE_URL` with the value
`'http://localhost:3000/api'`. This variable likely stores the base URL for an API endpoint that the
JavaScript code will interact with. */
const API_BASE_URL = 'http://localhost:3000/api';


/* The below code is creating an instance of Axios client called `apiClient` with a base URL of
`API_BASE_URL` and setting the content type header to `application/json`. This client can be used to
make HTTP requests to the specified base URL with the specified headers. */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* The below code is setting up a request interceptor for an API client in JavaScript. The interceptor
function is checking if there is a token stored in the local storage. If a token is found, it adds
an Authorization header to the request with the token in the format "Bearer {token}". This allows
the client to include the token in the headers of outgoing requests for authentication purposes. If
there is an error during the interception process, it will reject the error. */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));


/* The below code is setting up a response interceptor for an API client in JavaScript. It intercepts
responses from API requests and handles errors based on the status codes and other conditions. */
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
      window.location.href = '/login';
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

/**
 * The function `isAuthenticated` checks if a token is stored in the local storage and returns a
 * boolean indicating whether the user is authenticated.
 * @returns The `isAuthenticated` function is returning a boolean value based on whether a token is
 * present in the localStorage. If a token is present, it will return `true`, indicating that the user
 * is authenticated. If no token is present, it will return `false`, indicating that the user is not
 * authenticated.
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * The `logout` function removes the 'token' and 'user' items from localStorage and redirects the user
 * to the '/login' page.
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Logs in a user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{ success: boolean, data: { userId: string, token: string, role: string, status: string } }>}
 */
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Registers a new user with provided details
 * @param {Object} userData - User details (email, password, role, name, phone)
 * @returns {Promise<{ success: boolean, data: { userId: string, token: string } }>}
 */
export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

/**
 * Fetches a list of products with pagination
 * @param {number} [page=1] - Page number
 * @param {number} [limit=10] - Products per page
 * @returns {Promise<{ success: boolean, data: Object[], pagination: { page: number, limit: number, total: number } }>}
 */
export const getAllProducts = async (page = 1, limit = 10) => {
  const response = await apiClient.get('/buyer/products', { params: { page, limit } });
  return response.data;
};

/**
 * Fetches product filter options
 * @returns {Promise<{ success: boolean, data: { condition: string[], brand: string[], oem: string[], material: string[], availability: string[], aftermarket: string[], make: string[], model: string[], years: string[], category: Object[], priceRange: { min: number, max: number } } }>}
 */
export const getProductFilterOptions = async () => {
  const response = await apiClient.get('/buyer/product-filter-options');
  return response.data;
};

 /**
 * Searches products based on processed filters
 * @param {Object} filters - Product filters (e.g., condition, brand, make, categoryId)
 * @returns {Promise<{ success: boolean, data: Object[] }>}
 */
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

/**
 * Fetches product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export const getProductById = async (productId) => {
  const response = await apiClient.get(`/buyer/products/${productId}`);
  return response.data;
};

/**
 * Adds product to cart with specified quantity
 * @param {string} productId - Product ID
 * @param {number} [quantity=1] - Quantity to add
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export const addToCart = async (productId, quantity = 1) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to add to cart', code: 401, isBigError: false };
  const product = await getProductById(productId);
  if (quantity > product.data.stock) throw { message: `Only ${product.data.stock} items in stock`, code: 400, isBigError: false };
  const response = await apiClient.post('/buyer/cart/add', { productId, quantity });
  return response.data;
};

/**
 * Fetches user's cart data
 * @returns {Promise<{ success: boolean, data: { items: Object[], total: number } }>}
 */
export const viewCart = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view cart', code: 401, isBigError: false };
  const response = await apiClient.get('/buyer/cart');
  return response.data;
};
 
 /**
 * Removes product from user's cart
 * @param {string} productId - Product ID
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export const removeFromCart = async (productId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to remove from cart', code: 401, isBigError: false };
  const response = await apiClient.delete(`/buyer/cart/remove/${productId}`);
  return response.data;
};

 /**
 * Clears user's cart
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export const clearCart = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to clear cart', code: 401, isBigError: false };
  const response = await apiClient.delete('/buyer/cart/clear');
  return response.data;
};

/**
 * Creates a new order with provided data
 * @param {Object} orderData - Order details (items, shippingAddress)
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export const createOrder = async (orderData) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to create an order', code: 401, isBigError: false };
  const response = await apiClient.post('/buyer/order', orderData);
  return response.data;
};

/**
 * The function `cancelOrder` cancels an order by sending a POST request to the API endpoint with the
 * specified orderId.
 * @param orderId - The `orderId` parameter in the `cancelOrder` function represents the unique
 * identifier of the order that the user wants to cancel. This identifier is used to specify which
 * order should be canceled when the function is called.
 * @returns The `cancelOrder` function is returning the data from the response of the API call made to
 * cancel the order.
 */
export const cancelOrder = async (orderId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to cancel an order', code: 401, isBigError: false };
  const response = await apiClient.post(`/buyer/order/cancel/${orderId}`);
  return response.data;
};

/**
 * The trackOrder function allows authenticated users to track an order by sending a POST request with
 * the orderId and productId, handling a 404 error by sending a GET request with the same parameters if
 * needed.
 * @param orderId - The `orderId` parameter in the `trackOrder` function represents the unique
 * identifier of the order that you want to track. It is used to specify which order you are trying to
 * track in the system.
 * @param productId - The `productId` parameter is a required parameter that identifies the specific
 * product being tracked in the order. It is used to track the order associated with the given
 * `orderId`.
 * @returns The function `trackOrder` returns the data from the API response after tracking the order
 * with the provided orderId and productId.
 */
export const trackOrder = async (orderId, productId) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to track an order', code: 401, isBigError: false };
  if (!productId) throw { message: 'productId is required', code: 400, isBigError: false };
  try {
    const response = await apiClient.post(`/buyer/order/track/${orderId}`, { productId });
    return response.data;
  } catch (error) {
    if (error.code === 404) {
      const response = await apiClient.get(`/buyer/order/track/${orderId}`, {
        params: { productId }
      });
      return response.data;
    }
    throw error;
  }
};

/**
 * The function `getOrderHistory` retrieves a user's order history with pagination support.
 * @param [] - The `getOrderHistory` function is an asynchronous function that retrieves order history
 * data from the server. It takes an object as an argument with optional `page` and `limit` parameters,
 * defaulting to `1` and `5` respectively if not provided.
 * @returns The function `getOrderHistory` returns the order history data fetched from the API endpoint
 * `/buyer/orders` with the specified pagination parameters (page number and limit).
 */
export const getOrderHistory = async ({ page = 1, limit = 5 } = {}) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view order history', code: 401, isBigError: false };
  const response = await apiClient.get('/buyer/orders', { params: { page, limit } });
  return response.data;
};

/**
 * This function retrieves the user's profile data if the user is authenticated, otherwise it throws an
 * error.
 * @returns The `getProfile` function is returning the data from the response of the API call to
 * retrieve the user's profile information.
 */
export const getProfile = async () => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to view profile', code: 401, isBigError: false };
  const response = await apiClient.get('/profile');
  return response.data;
};

/**
 * This function retrieves an image by its ID from a server using an API call with a specified response
 * type of 'blob'.
 * @param imageId - The `imageId` parameter is the unique identifier of the image that you want to
 * retrieve. It is used to make a request to the server to fetch the image data associated with that
 * specific identifier.
 * @returns The function `getImageById` is returning the image data fetched from the API endpoint
 * `/uploads/` in blob format.
 */
export const getImageById = async (imageId) => {
  const response = await apiClient.get(`/uploads/${imageId}`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * The `initiatePayment` function in JavaScript dynamically loads the PayHere SDK and initiates a
 * payment process, handling success, dismissal, and error scenarios through promises.
 * @param payhereData - The `payhereData` parameter in the `initiatePayment` function is likely an
 * object containing the necessary data for initiating a payment through the PayHere payment gateway.
 * This data could include information such as the payment amount, currency, customer details, and any
 * other required parameters for processing the payment.
 * @param onSuccess - The `onSuccess` parameter in the `initiatePayment` function is a callback
 * function that will be executed when the payment process is successfully completed. You can provide a
 * function that contains the logic you want to execute after a successful payment, such as displaying
 * a success message or redirecting the user to
 * @param onDismiss - The `onDismiss` parameter in the `initiatePayment` function is a callback
 * function that will be called when the payment process is dismissed or canceled by the user. It
 * allows you to handle any specific actions or UI changes when the payment is dismissed before
 * completion.
 * @param onError - The `onError` parameter in the `initiatePayment` function is a callback function
 * that will be called if an error occurs during the payment process. It allows you to handle any
 * errors that may occur, such as network issues, invalid payment data, or any other unexpected errors
 * that may arise.
 * @returns The `initiatePayment` function returns a Promise that resolves when the PayHere SDK is
 * successfully loaded and the payment process is initiated, or rejects if there is an error during the
 * process.
 */
export const initiatePayment = (payhereData, onSuccess, onDismiss, onError) => {
  return new Promise((resolve, reject) => {
    // Check if PayHere SDK is already loaded
    if (window.payhere) {
      startPayment(payhereData, onSuccess, onDismiss, onError, resolve, reject);
    } else {
      // Load PayHere SDK
      const script = document.createElement("script");
      script.src = "https://www.payhere.lk/lib/payhere.js";
      script.async = true;
      script.onload = () => {
        console.log("PayHere SDK loaded");
        startPayment(payhereData, onSuccess, onDismiss, onError, resolve, reject);
      };
      script.onerror = () => {
        console.error("Failed to load PayHere SDK");
        reject(new Error("Failed to load payment gateway."));
      };
      document.body.appendChild(script);
    }
  });
};

/**
 * Submits a complaint for a delivered order
 * @param {string} orderId - Order ID
 * @param {Object} complaintData - Complaint details
 * @param {string} complaintData.productId - Product ID
 * @param {string} complaintData.description - Complaint description
 * @param {boolean} complaintData.refundRequested - Whether a refund is requested
 * @param {number} [complaintData.refundAmount] - Requested refund amount
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export const makeComplaint = async (orderId, { productId, description, refundRequested, refundAmount } = {}) => {
  if (!isAuthenticated()) throw { message: 'User must be logged in to make complaint', code: 401, isBigError: false };
  if (!productId) throw { message: 'Product ID is required', code: 400, isBigError: false };
  if (!description) throw { message: 'Description is required', code: 400, isBigError: false };
  const response = await apiClient.post(`/buyer/order/${orderId}/complaint`, {
    productId,
    description,
    refundRequested,
    refundAmount,
  });
  return response.data;
};




/**
 * The `startPayment` function in JavaScript initiates a payment using PayHere, handling success,
 * dismissal, and error scenarios with appropriate callbacks and promises.
 * @param payhereData - `payhereData` is an object containing data required to initiate a payment using
 * PayHere. It likely includes details such as the payment amount, currency, customer information, and
 * any other necessary payment parameters.
 * @param onSuccess - The `onSuccess` parameter in the `startPayment` function is a callback function
 * that will be executed when the payment is successfully completed. It typically takes an `orderId` as
 * a parameter, which represents the unique identifier for the completed order.
 * @param onDismiss - The `onDismiss` parameter in the `startPayment` function is a callback function
 * that will be called when the payment process is dismissed by the user. It is used to handle actions
 * that need to be taken when the user decides to dismiss the payment process without completing it.
 * @param onError - The `onError` parameter in the `startPayment` function is a callback function that
 * will be called if there is an error during the payment process. It is used to handle and display any
 * errors that occur during the payment transaction.
 * @param resolve - The `resolve` parameter in the `startPayment` function is a function that is used
 * to fulfill the promise when the payment process is completed or dismissed successfully. It is
 * typically called with the result of the asynchronous operation when it is successful. In this case,
 * it is used to resolve the promise with
 * @param reject - The `reject` parameter in the `startPayment` function is a function that is used to
 * reject the Promise in case of an error during the payment process. If an error occurs during payment
 * initiation or processing, the `reject` function is called with an error object as an argument,
 * indicating the reason
 */
const startPayment = (payhereData, onSuccess, onDismiss, onError, resolve, reject) => {
  // Ensure sandbox mode
  payhereData.sandbox = true;

  // Log payhereData for debugging
  console.log("PayHere Data:", JSON.stringify(payhereData, null, 2));

  // Set up PayHere event handlers
  window.payhere.onCompleted = (orderId) => {
    console.log("Payment completed. OrderID: " + orderId);
    if (onSuccess) onSuccess(orderId);
    resolve({ status: "completed", orderId });
  };

  window.payhere.onDismissed = () => {
    console.log("Payment dismissed");
    if (onDismiss) onDismiss();
    resolve({ status: "dismissed" });
  };

  window.payhere.onError = (error) => {
    console.log("Payment Error: " + error);
    if (onError) onError(error);
    reject(new Error(`Payment failed: ${error}`));
  };

  // Initiate payment
  try {
    console.log("Initiating PayHere Payment...");
    window.payhere.startPayment(payhereData);
  } catch (err) {
    console.error("Payment Initiation Error:", err);
    reject(new Error("Failed to initiate payment."));
  }
};

export default {
  login,
  register,
  isAuthenticated,
  logout,
  getAllProducts,
  makeComplaint,
  getProductFilterOptions,
  searchProducts,
  getProductById,
  addToCart,
  viewCart, 
  removeFromCart,
  clearCart,
  createOrder,
  cancelOrder,
  trackOrder,
  getOrderHistory,
  
  getProfile,
  getImageById,
  initiatePayment,
};