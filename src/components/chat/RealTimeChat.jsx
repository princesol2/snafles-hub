import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import socketService from '../../services/socketService';

const RealTimeChat = ({ productId, sellerId, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [negotiationMode, setNegotiationMode] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    
    // Connect to WebSocket
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);
      socketService.joinProductRoom(productId);
    }

    // Set up event listeners
    const handleNewMessage = (data) => {
      setMessages(prev => [...prev, data]);
    };

    const handleOfferUpdate = (data) => {
      setMessages(prev => prev.map(msg => 
        msg.id === data.offerId ? { ...msg, status: data.status } : msg
      ));
    };

    const handleUserTyping = (data) => {
      if (data.userId !== user?.id) {
        setTypingUsers(prev => {
          if (data.isTyping) {
            return [...prev.filter(u => u.userId !== data.userId), data];
          } else {
            return prev.filter(u => u.userId !== data.userId);
          }
        });
      }
    };

    const handleConnectionStatus = (data) => {
      setIsConnected(data.connected);
    };

    socketService.on('new_message', handleNewMessage);
    socketService.on('offer_updated', handleOfferUpdate);
    socketService.on('user_typing', handleUserTyping);
    socketService.on('connection_status', handleConnectionStatus);

    return () => {
      socketService.off('new_message', handleNewMessage);
      socketService.off('offer_updated', handleOfferUpdate);
      socketService.off('user_typing', handleUserTyping);
      socketService.off('connection_status', handleConnectionStatus);
      socketService.leaveProductRoom(productId);
    };
  }, [productId, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/chat/messages/${productId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      productId,
      sellerId,
      message: newMessage,
      type: 'text'
    };

    try {
      // Send via WebSocket for real-time delivery
      socketService.sendMessage(messageData);
      
      // Also save to database
      await api.post('/chat/send', messageData);
      
      setNewMessage('');
      stopTyping();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendOffer = async () => {
    if (!offerAmount || isNaN(offerAmount)) return;

    const offerData = {
      productId,
      sellerId,
      amount: parseFloat(offerAmount),
      type: 'offer'
    };

    try {
      // Send via WebSocket for real-time delivery
      socketService.sendMessage(offerData);
      
      // Also save to database
      await api.post('/chat/send-offer', offerData);
      
      setOfferAmount('');
      setNegotiationMode(false);
    } catch (error) {
      console.error('Error sending offer:', error);
    }
  };

  const acceptOffer = async (messageId) => {
    try {
      await api.post(`/chat/accept-offer/${messageId}`);
      
      // Notify via WebSocket
      socketService.updateOffer({
        productId,
        offerId: messageId,
        status: 'accepted',
        message: 'Offer accepted!'
      });
    } catch (error) {
      console.error('Error accepting offer:', error);
    }
  };

  const rejectOffer = async (messageId) => {
    try {
      await api.post(`/chat/reject-offer/${messageId}`);
      
      // Notify via WebSocket
      socketService.updateOffer({
        productId,
        offerId: messageId,
        status: 'rejected',
        message: 'Offer rejected'
      });
    } catch (error) {
      console.error('Error rejecting offer:', error);
    }
  };

  // Typing functionality
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      socketService.startTyping(productId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  };

  const stopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      socketService.stopTyping(productId);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const formatMessage = (message) => {
    const isOwn = message.senderId === user?.id;
    const isOffer = message.type === 'offer';
    
    return (
      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-800'
        }`}>
          {isOffer ? (
            <div className="space-y-2">
              <div className="font-semibold">💰 Offer: ${message.amount}</div>
              <div className="text-sm">{message.message}</div>
              {!isOwn && message.status === 'pending' && (
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => acceptOffer(message.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectOffer(message.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
              {message.status === 'accepted' && (
                <div className="text-green-600 text-sm font-semibold">✅ Accepted</div>
              )}
              {message.status === 'rejected' && (
                <div className="text-red-600 text-sm font-semibold">❌ Rejected</div>
              )}
            </div>
          ) : (
            <div>
              <div>{message.message}</div>
              <div className="text-xs opacity-75 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl h-96 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">💬 Negotiation Chat</h3>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-500">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map(formatMessage)}
          
          {/* Typing indicators */}
          {typingUsers.map(user => (
            <div key={user.userId} className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">{user.userName} is typing...</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          {negotiationMode ? (
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Enter offer amount"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendOffer}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Send Offer
                </button>
                <button
                  onClick={() => setNegotiationMode(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={sendMessage} className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={handleTyping}
                onBlur={stopTyping}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
              <button
                type="button"
                onClick={() => setNegotiationMode(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                💰 Make Offer
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeChat;
