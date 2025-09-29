// API Base URL
// Prefer proxy via Vite in dev: default to '/api' to avoid mixed-content/CORS issues
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const { silent, ...restOptions } = options || {};
  const isFormData = restOptions?.body instanceof FormData;

  const config = {
    method: restOptions.method || 'GET',
    ...restOptions,
    headers: {
      Accept: 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...restOptions.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const raw = await response.text();
    let data = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      // Non-JSON response (e.g., proxy error page)
      data = { message: raw };
    }

    if (!response.ok) {
      const message = data?.message || data?.error || `HTTP ${response.status}`;
      throw new Error(message);
    }

    return data;
  } catch (error) {
    if (!silent) console.error('API request error:', error);
    throw error;
  }
};

// Lightweight axios-style wrapper expected by some components
// Returns objects with a { data } shape
export const api = {
  get: async (endpoint) => {
    const data = await apiRequest(endpoint, { method: 'GET' });
    return { data };
  },
  post: async (endpoint, body) => {
    const opts = body === undefined
      ? { method: 'POST' }
      : { method: 'POST', body: JSON.stringify(body) };
    const data = await apiRequest(endpoint, opts);
    return { data };
  },
  put: async (endpoint, body) => {
    const opts = body === undefined
      ? { method: 'PUT' }
      : { method: 'PUT', body: JSON.stringify(body) };
    const data = await apiRequest(endpoint, opts);
    return { data };
  },
  delete: async (endpoint) => {
    const data = await apiRequest(endpoint, { method: 'DELETE' });
    return { data };
  }
};

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Vendor specific auth
  vendorLogin: async (credentials) => {
    return apiRequest('/auth/vendor-login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      silent: true,
    });
  },
  vendorRegister: async (vendorData) => {
    return apiRequest('/auth/vendor-register', {
      method: 'POST',
      body: JSON.stringify(vendorData),
    });
  },

  // Get current user
  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },

  // Verify password
  verifyPassword: async (password) => {
    return apiRequest('/auth/verify-password', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  },

  // Request password reset
  requestPasswordReset: async (resetData) => {
    return apiRequest('/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
  },

  // Forgot password (request reset link)
  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password using token
  resetPassword: async ({ token, password }) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },

  // Verify email address
  verifyEmail: async (token) => {
    return apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  // Resend email verification
  resendVerification: async () => {
    return apiRequest('/auth/resend-verification', {
      method: 'POST',
    });
  },

  // Google OAuth login
  googleLogin: async (googleData) => {
    return apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify(googleData),
    });
  },
};

// Products API
export const productsAPI = {
  // Get all products
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
  },

  // Get single product
  getProduct: async (id) => {
    return apiRequest(`/products/${id}`);
  },

  // Create product (vendor only)
  createProduct: async (productData) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update product (vendor only)
  updateProduct: async (id, productData) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Delete product (vendor only)
  deleteProduct: async (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Search products
  searchProducts: async (query, filters = {}) => {
    const params = { q: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products/search?${queryString}`);
  },
};

// Vendors API
export const vendorsAPI = {
  // Get all vendors
  getVendors: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/vendors${queryString ? `?${queryString}` : ''}`);
  },

  // Get single vendor
  getVendor: async (id) => {
    return apiRequest(`/vendors/${id}`);
  },

  // Get vendor products
  getVendorProducts: async (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/vendors/${id}/products${queryString ? `?${queryString}` : ''}`);
  },

  // Update vendor profile
  updateVendorProfile: async (vendorData) => {
    return apiRequest('/vendors/profile', {
      method: 'PUT',
      body: JSON.stringify(vendorData),
    });
  },
};

// Orders API
export const ordersAPI = {
  // Get user orders
  getOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  // Get single order
  getOrder: async (id) => {
    return apiRequest(`/orders/${id}`);
  },

  // Create order
  createOrder: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    return apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Cancel order
  cancelOrder: async (id, reason) => {
    return apiRequest(`/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Get user orders (alias for getOrders)
  getUserOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  // Track order
  trackOrder: async (id) => {
    // Backend provides GET /api/orders/tracking/:orderNumber
    return apiRequest(`/orders/tracking/${id}`);
  },
};

// Payments API
export const paymentsAPI = {
  // Create payment intent
  createPaymentIntent: async (paymentData) => {
    return apiRequest('/payments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  // Confirm payment
  confirmPayment: async (paymentData) => {
    return apiRequest('/payments/confirm-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
};

// Upload API
export const uploadAPI = {
  // Upload image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return apiRequest('/upload/single', {
      method: 'POST',
      headers: {
        // Don't set Content-Type, let browser set it for FormData
      },
      body: formData,
    });
  },
};

// Second-Hand API
export const secondhandAPI = {
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/secondhand${queryString ? `?${queryString}` : ''}`);
  },
  getProduct: async (id) => {
    return apiRequest(`/secondhand/${id}`);
  },
  createProduct: async (data) => {
    return apiRequest('/secondhand', { method: 'POST', body: JSON.stringify(data) });
  },
  updateProduct: async (id, data) => {
    return apiRequest(`/secondhand/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  deleteProduct: async (id) => {
    return apiRequest(`/secondhand/${id}`, { method: 'DELETE' });
  },
};

// Chat API
export const chatAPI = {
  // Get messages for a product/negotiation
  getMessages: async (productId) => {
    return apiRequest(`/chat/messages/${productId}`);
  },

  // Send message
  sendMessage: async (messageData) => {
    return apiRequest('/chat/send', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // Send offer
  sendOffer: async (offerData) => {
    return apiRequest('/chat/send-offer', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  },
};

// Negotiations API
export const negotiationsAPI = {
  // Get user negotiations
  getNegotiations: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/negotiations${queryString ? `?${queryString}` : ''}`);
  },

  // Get single negotiation
  getNegotiation: async (id) => {
    return apiRequest(`/negotiations/${id}`);
  },

  // Create negotiation
  createNegotiation: async (negotiationData) => {
    return apiRequest('/negotiations', {
      method: 'POST',
      body: JSON.stringify(negotiationData),
    });
  },

  // Update negotiation status
  updateNegotiationStatus: async (id, status) => {
    return apiRequest(`/negotiations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Reviews API
export const reviewsAPI = {
  // Get reviews for product or vendor
  getReviews: async (type, id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/reviews/${type}/${id}${queryString ? `?${queryString}` : ''}`);
  },

  // Create review
  createReview: async (reviewData) => {
    return apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Update review
  updateReview: async (id, reviewData) => {
    return apiRequest(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  },

  // Delete review
  deleteReview: async (id) => {
    return apiRequest(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },
};

// Rewards API
export const rewardsAPI = {
  getPoints: async () => {
    return apiRequest('/rewards/points');
  },
  getAvailable: async () => {
    return apiRequest('/rewards/available');
  },
  getRedeemed: async () => {
    return apiRequest('/rewards/redeemed');
  },
  redeem: async (rewardId) => {
    return apiRequest(`/rewards/redeem/${rewardId}`, { method: 'POST' });
  },
};

// Repayment API
export const repaymentAPI = {
  // Get repayment plans
  getRepaymentPlans: async () => {
    return apiRequest('/repayment/plans');
  },

  // Create repayment plan
  createRepaymentPlan: async (planData) => {
    return apiRequest('/repayment/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  },

  // Get user repayments
  getUserRepayments: async () => {
    return apiRequest('/repayment/user');
  },
};

// Vendor Analytics API
export const vendorAnalyticsAPI = {
  // Get dashboard analytics
  getDashboard: async () => {
    return apiRequest('/vendor/analytics/dashboard');
  },

  // Get products with analytics
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/vendor/analytics/products${queryString ? `?${queryString}` : ''}`);
  },

  // Get orders with analytics
  getOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/vendor/analytics/orders${queryString ? `?${queryString}` : ''}`);
  },

  // Get negotiations
  getNegotiations: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/vendor/analytics/negotiations${queryString ? `?${queryString}` : ''}`);
  },

  // Get sales report
  getSalesReport: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/vendor/analytics/sales-report${queryString ? `?${queryString}` : ''}`);
  },
};

// Shipping API
export const shippingAPI = {
  // Get available carriers
  getCarriers: async () => {
    return apiRequest('/shipping/carriers');
  },

  // Calculate shipping cost
  calculateShipping: async (shippingData) => {
    return apiRequest('/shipping/calculate', {
      method: 'POST',
      body: JSON.stringify(shippingData),
    });
  },

  // Generate shipping label
  generateLabel: async (orderId, carrier) => {
    return apiRequest(`/shipping/label/${orderId}`, {
      method: 'POST',
      body: JSON.stringify({ carrier }),
    });
  },

  // Track shipment
  trackShipment: async (trackingNumber, carrier) => {
    const queryString = carrier ? `?carrier=${carrier}` : '';
    return apiRequest(`/shipping/track/${trackingNumber}${queryString}`);
  },

  // Update shipping information
  updateShipping: async (orderId, updateData) => {
    return apiRequest(`/shipping/update/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
};

// Admin API
export const adminAPI = {
  // Get dashboard stats
  getDashboardStats: async () => {
    return apiRequest('/admin/dashboard');
  },

  // Get all users
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  // Get all vendors
  getVendors: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/vendors${queryString ? `?${queryString}` : ''}`);
  },

  // Update user status
  updateUserStatus: async (id, status) => {
    return apiRequest(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Update vendor status
  updateVendorStatus: async (id, status) => {
    return apiRequest(`/admin/vendors/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    return apiRequest('/health');
  },
};

export default {
  authAPI,
  productsAPI,
  vendorsAPI,
  ordersAPI,
  paymentsAPI,
  uploadAPI,
  chatAPI,
  negotiationsAPI,
  reviewsAPI,
  rewardsAPI,
  repaymentAPI,
  vendorAnalyticsAPI,
  shippingAPI,
  adminAPI,
  healthAPI,
};
