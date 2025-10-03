import { createContext, useContext, useState, useEffect } from 'react';
import orderService from '../services/orderService';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    // Fallback stub to avoid hard crash if provider not mounted (e.g., during HMR)
    console.warn('useOrders used outside OrderProvider; using service fallback.');
    return {
      orders: [],
      currentOrder: null,
      loading: false,
      error: null,
      createOrder: (data) => orderService.createOrder(data),
      processPayment: (orderId, paymentData) => orderService.processPayment(orderId, paymentData),
      confirmPayment: (payload) => orderService.confirmPayment(payload),
      getOrder: (orderId) => orderService.getOrder(orderId),
      updateOrderStatus: (orderId, status) => orderService.updateOrderStatus(orderId, status),
      cancelOrder: (orderId, reason) => orderService.cancelOrder(orderId, reason),
      trackOrder: (orderId) => orderService.trackOrder(orderId),
      loadOrders: async () => {},
      getOrdersByStatus: () => [],
      getRecentOrders: () => [],
    };
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load user orders (Fixed to handle unauthenticated users)
  const loadOrders = async () => {
    if (!user) {
      setOrders([]);
      setCurrentOrder(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getUserOrders();
      setOrders(response.orders || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading orders:', err);
      // If it's an auth error, clear the orders
      if (err.message.includes('Token is not valid') || err.message.includes('Unauthorized')) {
        setOrders([]);
        setCurrentOrder(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create new order
  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      // Validate order data
      const validation = orderService.validateOrderData(orderData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Calculate totals
      const totals = orderService.calculateTotals(orderData.items, orderData.shipping);
      
      // Create order with generated order number
      const orderNumber = orderService.generateOrderNumber();
      const completeOrderData = {
        ...orderData,
        orderNumber,
        ...totals,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const response = await orderService.createOrder(completeOrderData);
      setCurrentOrder(response.order);
      
      // Reload orders to include the new one
      await loadOrders();
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Process payment for order
  const processPayment = async (orderId, paymentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.processPayment(orderId, paymentData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Confirm payment
  const confirmPayment = async (paymentIntentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.confirmPayment({ paymentIntentId, orderId: currentOrder?.id || currentOrder?._id });
      
      // Update current order status
      if (currentOrder) {
        setCurrentOrder(prev => ({
          ...prev,
          payment: {
            ...prev.payment,
            status: 'completed'
          },
          status: 'confirmed'
        }));
      }
      
      // Reload orders to reflect the update
      await loadOrders();
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get order by ID
  const getOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrder(orderId);
      setCurrentOrder(response.order);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.updateOrderStatus(orderId, status);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder(prev => ({ ...prev, status }));
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId, reason) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.cancelOrder(orderId, reason);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ));
      
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder(prev => ({ ...prev, status: 'cancelled' }));
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Track order
  const trackOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.trackOrder(orderId);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get orders by status
  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  // Get recent orders
  const getRecentOrders = (limit = 5) => {
    return orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  // Load orders when user changes
  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setOrders([]);
      setCurrentOrder(null);
    }
  }, [user]);

  const value = {
    orders,
    currentOrder,
    loading,
    error,
    createOrder,
    processPayment,
    confirmPayment,
    getOrder,
    updateOrderStatus,
    cancelOrder,
    trackOrder,
    loadOrders,
    getOrdersByStatus,
    getRecentOrders
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

