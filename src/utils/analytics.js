// Google Analytics utility functions
export const GA_TRACKING_ID = 'GA_MEASUREMENT_ID'; // Replace with your actual GA4 Measurement ID

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track e-commerce events
export const trackPurchase = (transactionId, value, currency = 'USD', items = []) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    });
  }
};

// Track product views
export const trackProductView = (productId, productName, category, price) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'USD',
      value: price,
      items: [{
        item_id: productId,
        item_name: productName,
        item_category: category,
        price: price,
      }],
    });
  }
};

// Track add to cart
export const trackAddToCart = (productId, productName, category, price, quantity = 1) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: price * quantity,
      items: [{
        item_id: productId,
        item_name: productName,
        item_category: category,
        price: price,
        quantity: quantity,
      }],
    });
  }
};

// Track user registration
export const trackRegistration = (method = 'email') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: method,
    });
  }
};

// Track user login
export const trackLogin = (method = 'email') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'login', {
      method: method,
    });
  }
};

// Track search
export const trackSearch = (searchTerm) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
    });
  }
};

// Track vendor actions
export const trackVendorAction = (action, vendorId, vendorName) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'vendor_action', {
      action: action,
      vendor_id: vendorId,
      vendor_name: vendorName,
    });
  }
};

// Track negotiation events
export const trackNegotiation = (action, productId, price) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'negotiation', {
      action: action,
      product_id: productId,
      price: price,
    });
  }
};

// Track wishlist actions
export const trackWishlist = (action, productId, productName) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'wishlist_action', {
      action: action,
      product_id: productId,
      product_name: productName,
    });
  }
};

// Track error events
export const trackError = (error, errorMessage) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: errorMessage,
      fatal: false,
    });
  }
};

// Real-time tracking functions
export const trackRealTimeEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      timestamp: Date.now(),
    });
  }
};

// Track user engagement
export const trackEngagement = (action, page, duration = null) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'engagement', {
      action: action,
      page: page,
      duration: duration,
    });
  }
};

// Track performance metrics
export const trackPerformance = (metric, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'performance', {
      metric: metric,
      value: value,
    });
  }
};

export default {
  initGA,
  trackPageView,
  trackEvent,
  trackPurchase,
  trackProductView,
  trackAddToCart,
  trackRegistration,
  trackLogin,
  trackSearch,
  trackVendorAction,
  trackNegotiation,
  trackWishlist,
  trackError,
  trackRealTimeEvent,
  trackEngagement,
  trackPerformance,
};
