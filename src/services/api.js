// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
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
  cancelOrder: async (id) => {
    return apiRequest(`/orders/${id}/cancel`, {
      method: 'PUT',
    });
  },
};

// Payments API
export const paymentsAPI = {
  // Create payment intent
  createPaymentIntent: async (paymentData) => {
    return apiRequest('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  // Confirm payment
  confirmPayment: async (paymentData) => {
    return apiRequest('/payments/confirm', {
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

    return apiRequest('/upload/image', {
      method: 'POST',
      headers: {
        // Don't set Content-Type, let browser set it for FormData
      },
      body: formData,
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
  healthAPI,
};

