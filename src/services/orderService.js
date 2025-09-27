import { ordersAPI, paymentsAPI } from './api';

class OrderService {
  // Create a new order
  async createOrder(orderData) {
    try {
      const response = await ordersAPI.createOrder(orderData);
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Process payment for an order
  async processPayment(orderId, paymentData) {
    try {
      const response = await paymentsAPI.createPaymentIntent({
        orderId,
        amount: paymentData.amount,
        currency: 'inr',
        paymentMethod: paymentData.method
      });
      return response;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Confirm payment
  async confirmPayment(paymentIntentId) {
    try {
      const response = await paymentsAPI.confirmPayment(paymentIntentId);
      return response;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  // Get order details
  async getOrder(orderId) {
    try {
      const response = await ordersAPI.getOrder(orderId);
      return response;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  // Get user orders
  async getUserOrders(params = {}) {
    try {
      const response = await ordersAPI.getUserOrders(params);
      return response;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const response = await ordersAPI.updateOrderStatus(orderId, status);
      return response;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId, reason) {
    try {
      const response = await ordersAPI.cancelOrder(orderId, reason);
      return response;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  // Track order
  async trackOrder(orderId) {
    try {
      const response = await ordersAPI.trackOrder(orderId);
      return response;
    } catch (error) {
      console.error('Error tracking order:', error);
      throw error;
    }
  }

  // Generate order number
  generateOrderNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `SNF-${timestamp}-${random}`.toUpperCase();
  }

  // Calculate order totals
  calculateTotals(cart, shippingInfo) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total,
      currency: 'INR'
    };
  }

  // Validate order data
  validateOrderData(orderData) {
    const errors = [];

    if (!orderData.items || orderData.items.length === 0) {
      errors.push('Order must contain at least one item');
    }

    if (!orderData.shipping || !orderData.shipping.firstName || !orderData.shipping.lastName) {
      errors.push('Shipping information is required');
    }

    if (!orderData.shipping.email || !orderData.shipping.phone) {
      errors.push('Email and phone number are required');
    }

    if (!orderData.shipping.address || !orderData.shipping.city) {
      errors.push('Complete address is required');
    }

    if (!orderData.payment || !orderData.payment.method) {
      errors.push('Payment method is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new OrderService();

