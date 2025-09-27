import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventListeners = new Map();
  }

  connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventHandlers();
    return this.socket;
  }

  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🔌 Connected to WebSocket server');
      this.isConnected = true;
      this.emit('connection_status', { connected: true });
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from WebSocket server');
      this.isConnected = false;
      this.emit('connection_status', { connected: false });
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 WebSocket connection error:', error);
      this.isConnected = false;
      this.emit('connection_error', error);
    });

    // Message events
    this.socket.on('new_message', (data) => {
      this.emit('new_message', data);
    });

    this.socket.on('offer_updated', (data) => {
      this.emit('offer_updated', data);
    });

    this.socket.on('user_typing', (data) => {
      this.emit('user_typing', data);
    });

    // Order events
    this.socket.on('order_updated', (data) => {
      this.emit('order_updated', data);
    });

    // Notification events
    this.socket.on('notification', (data) => {
      this.emit('notification', data);
    });

    // Bidding events
    this.socket.on('new_bid', (data) => {
      this.emit('new_bid', data);
    });

    // Error events
    this.socket.on('error', (error) => {
      this.emit('error', error);
    });
  }

  // Event system for components
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.eventListeners.has(event)) return;
    
    const listeners = this.eventListeners.get(event);
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  emit(event, data) {
    if (!this.eventListeners.has(event)) return;
    
    this.eventListeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  // Chat methods
  joinProductRoom(productId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_product_room', productId);
    }
  }

  leaveProductRoom(productId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_product_room', productId);
    }
  }

  sendMessage(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', data);
    }
  }

  updateOffer(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('offer_update', data);
    }
  }

  // Typing indicators
  startTyping(productId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_start', { productId });
    }
  }

  stopTyping(productId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_stop', { productId });
    }
  }

  // Order updates
  updateOrder(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('order_update', data);
    }
  }

  // Notifications
  sendNotification(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_notification', data);
    }
  }

  // Live bidding
  placeBid(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('place_bid', data);
    }
  }

  // Utility methods
  isConnected() {
    return this.isConnected;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventListeners.clear();
    }
  }

  reconnect(token) {
    this.disconnect();
    return this.connect(token);
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
