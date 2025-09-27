const jwt = require('jsonwebtoken');
const User = require('../models/User');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socketId
  }

  initialize(server) {
    const { Server } = require('socket.io');
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
    
    console.log('🔌 WebSocket server initialized');
  }

  setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('_id name email role');
        
        if (!user) {
          return next(new Error('Authentication error: User not found'));
        }

        socket.userId = user._id.toString();
        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`👤 User ${socket.user.name} (${socket.userId}) connected`);
      
      // Store user connection
      this.connectedUsers.set(socket.userId, socket.id);

      // Join user to their personal room
      socket.join(`user_${socket.userId}`);

      // Handle joining product-specific rooms for negotiations
      socket.on('join_product_room', (productId) => {
        socket.join(`product_${productId}`);
        console.log(`📦 User ${socket.user.name} joined product room: ${productId}`);
      });

      // Handle leaving product rooms
      socket.on('leave_product_room', (productId) => {
        socket.leave(`product_${productId}`);
        console.log(`📦 User ${socket.user.name} left product room: ${productId}`);
      });

      // Handle chat messages
      socket.on('send_message', async (data) => {
        try {
          const { productId, message, type = 'text', amount } = data;
          
          // Emit to all users in the product room
          this.io.to(`product_${productId}`).emit('new_message', {
            id: Date.now().toString(),
            productId,
            senderId: socket.userId,
            senderName: socket.user.name,
            message,
            type,
            amount,
            timestamp: new Date().toISOString()
          });

          console.log(`💬 Message sent in product ${productId} by ${socket.user.name}`);
        } catch (error) {
          console.error('Error handling send_message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle offer updates
      socket.on('offer_update', (data) => {
        const { productId, offerId, status, message } = data;
        
        this.io.to(`product_${productId}`).emit('offer_updated', {
          offerId,
          status,
          message,
          updatedBy: socket.userId,
          updatedByName: socket.user.name,
          timestamp: new Date().toISOString()
        });

        console.log(`💰 Offer ${offerId} updated to ${status} by ${socket.user.name}`);
      });

      // Handle typing indicators
      socket.on('typing_start', (data) => {
        const { productId } = data;
        socket.to(`product_${productId}`).emit('user_typing', {
          userId: socket.userId,
          userName: socket.user.name,
          isTyping: true
        });
      });

      socket.on('typing_stop', (data) => {
        const { productId } = data;
        socket.to(`product_${productId}`).emit('user_typing', {
          userId: socket.userId,
          userName: socket.user.name,
          isTyping: false
        });
      });

      // Handle order updates
      socket.on('order_update', (data) => {
        const { orderId, status, message } = data;
        
        // Emit to the order owner
        this.io.to(`user_${data.userId}`).emit('order_updated', {
          orderId,
          status,
          message,
          updatedAt: new Date().toISOString()
        });

        console.log(`📦 Order ${orderId} updated to ${status}`);
      });

      // Handle notifications
      socket.on('send_notification', (data) => {
        const { userId, type, title, message, data: notificationData } = data;
        
        this.io.to(`user_${userId}`).emit('notification', {
          id: Date.now().toString(),
          type,
          title,
          message,
          data: notificationData,
          timestamp: new Date().toISOString()
        });

        console.log(`🔔 Notification sent to user ${userId}: ${title}`);
      });

      // Handle live bidding
      socket.on('place_bid', (data) => {
        const { productId, bidAmount, bidderName } = data;
        
        this.io.to(`product_${productId}`).emit('new_bid', {
          bidId: Date.now().toString(),
          productId,
          bidAmount,
          bidderId: socket.userId,
          bidderName: bidderName || socket.user.name,
          timestamp: new Date().toISOString()
        });

        console.log(`🎯 New bid placed on product ${productId}: ${bidAmount} by ${socket.user.name}`);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`👋 User ${socket.user.name} (${socket.userId}) disconnected`);
        this.connectedUsers.delete(socket.userId);
      });
    });
  }

  // Utility methods for server-side events
  notifyUser(userId, notification) {
    this.io.to(`user_${userId}`).emit('notification', {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date().toISOString()
    });
  }

  notifyProductRoom(productId, event, data) {
    this.io.to(`product_${productId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  notifyOrderUpdate(userId, orderData) {
    this.io.to(`user_${userId}`).emit('order_updated', {
      ...orderData,
      timestamp: new Date().toISOString()
    });
  }

  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }

  getOnlineUsers() {
    return Array.from(this.connectedUsers.keys());
  }
}

module.exports = new SocketService();
