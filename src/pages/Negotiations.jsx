import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  User,
  Store,
  Filter,
  Search,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import toast from 'react-hot-toast';

const Negotiations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [negotiations, setNegotiations] = useState([]);
  const [selectedNegotiation, setSelectedNegotiation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadNegotiations();
  }, [user, navigate]);

  const loadNegotiations = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNegotiations([
        {
          id: 'NEG-001',
          product: {
            id: 1,
            name: 'Handcrafted Silver Necklace',
            image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop',
            originalPrice: 2999,
            currentPrice: 2499
          },
          vendor: {
            id: 1,
            name: 'Artisan Crafts Co.',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
          },
          customer: {
            id: user.id,
            name: user.name,
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
          },
          status: 'active',
          proposedPrice: 2200,
          counterPrice: 2300,
          messages: [
            {
              id: 1,
              sender: 'customer',
              message: 'Hi! I\'m interested in this necklace. Would you consider ₹2200?',
              timestamp: '2024-01-15T10:30:00Z',
              type: 'offer'
            },
            {
              id: 2,
              sender: 'vendor',
              message: 'Hello! Thank you for your interest. The best I can do is ₹2300. This is a handcrafted piece with premium materials.',
              timestamp: '2024-01-15T11:15:00Z',
              type: 'counter'
            },
            {
              id: 3,
              sender: 'customer',
              message: 'That sounds fair. What about ₹2250? I can pay immediately.',
              timestamp: '2024-01-15T11:45:00Z',
              type: 'offer'
            }
          ],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T11:45:00Z'
        },
        {
          id: 'NEG-002',
          product: {
            id: 2,
            name: 'Ceramic Vase Set',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
            originalPrice: 2499,
            currentPrice: 2499
          },
          vendor: {
            id: 2,
            name: 'Creative Home Studio',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
          },
          customer: {
            id: user.id,
            name: user.name,
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
          },
          status: 'accepted',
          proposedPrice: 2000,
          finalPrice: 2100,
          messages: [
            {
              id: 1,
              sender: 'customer',
              message: 'Hi! I love this vase set. Would ₹2000 work?',
              timestamp: '2024-01-14T14:20:00Z',
              type: 'offer'
            },
            {
              id: 2,
              sender: 'vendor',
              message: 'Hi! Thanks for your interest. I can do ₹2100 for this set. It\'s a great deal for handcrafted ceramics.',
              timestamp: '2024-01-14T15:30:00Z',
              type: 'counter'
            },
            {
              id: 3,
              sender: 'customer',
              message: 'Deal! ₹2100 works for me. How do I proceed with payment?',
              timestamp: '2024-01-14T16:00:00Z',
              type: 'acceptance'
            },
            {
              id: 4,
              sender: 'vendor',
              message: 'Perfect! I\'ll send you the payment link shortly. Thank you!',
              timestamp: '2024-01-14T16:15:00Z',
              type: 'confirmation'
            }
          ],
          createdAt: '2024-01-14T14:20:00Z',
          updatedAt: '2024-01-14T16:15:00Z'
        },
        {
          id: 'NEG-003',
          product: {
            id: 3,
            name: 'Wooden Wall Art',
            image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=200&fit=crop',
            originalPrice: 4599,
            currentPrice: 4599
          },
          vendor: {
            id: 3,
            name: 'Handmade Treasures',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
          },
          customer: {
            id: user.id,
            name: user.name,
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
          },
          status: 'rejected',
          proposedPrice: 3500,
          messages: [
            {
              id: 1,
              sender: 'customer',
              message: 'Hi! This wall art is beautiful. Would you consider ₹3500?',
              timestamp: '2024-01-13T09:15:00Z',
              type: 'offer'
            },
            {
              id: 2,
              sender: 'vendor',
              message: 'Hello! I appreciate your interest, but ₹3500 is too low for this hand-carved piece. The minimum I can accept is ₹4200.',
              timestamp: '2024-01-13T10:30:00Z',
              type: 'counter'
            },
            {
              id: 3,
              sender: 'customer',
              message: 'I understand. That\'s still a bit high for my budget. Maybe next time!',
              timestamp: '2024-01-13T11:00:00Z',
              type: 'rejection'
            }
          ],
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-13T11:00:00Z'
        }
      ]);
    } catch (error) {
      toast.error('Failed to load negotiations');
    } finally {
      setLoading(false);
    }
  };

  const filteredNegotiations = negotiations.filter(neg => {
    const matchesSearch = neg.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         neg.vendor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || neg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <Clock className="h-4 w-4" />,
      accepted: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
      expired: <AlertCircle className="h-4 w-4" />
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedNegotiation) return;

    const message = {
      id: Date.now(),
      sender: user.role === 'vendor' ? 'vendor' : 'customer',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    setNegotiations(prev => prev.map(neg => 
      neg.id === selectedNegotiation.id 
        ? { ...neg, messages: [...neg.messages, message], updatedAt: new Date().toISOString() }
        : neg
    ));

    setNewMessage('');
    toast.success('Message sent!');
  };

  const handleAcceptOffer = (negotiationId) => {
    setNegotiations(prev => prev.map(neg => 
      neg.id === negotiationId 
        ? { ...neg, status: 'accepted', finalPrice: neg.counterPrice || neg.proposedPrice }
        : neg
    ));
    toast.success('Offer accepted!');
  };

  const handleRejectOffer = (negotiationId) => {
    setNegotiations(prev => prev.map(neg => 
      neg.id === negotiationId 
        ? { ...neg, status: 'rejected' }
        : neg
    ));
    toast.success('Offer rejected');
  };

  const NegotiationModal = () => {
    if (!selectedNegotiation) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedNegotiation.product.image}
                  alt={selectedNegotiation.product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedNegotiation.product.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Original: {formatCurrency(selectedNegotiation.product.originalPrice)}</span>
                    <span>•</span>
                    <span>Proposed: {formatCurrency(selectedNegotiation.proposedPrice)}</span>
                    {selectedNegotiation.counterPrice && (
                      <>
                        <span>•</span>
                        <span>Counter: {formatCurrency(selectedNegotiation.counterPrice)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 max-h-96">
            <div className="space-y-4">
              {selectedNegotiation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'customer'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <img
                        src={message.sender === 'customer' 
                          ? selectedNegotiation.customer.avatar 
                          : selectedNegotiation.vendor.avatar
                        }
                        alt="Avatar"
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs font-medium">
                        {message.sender === 'customer' 
                          ? selectedNegotiation.customer.name 
                          : selectedNegotiation.vendor.name
                        }
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'customer' ? 'text-pink-200' : 'text-gray-500'
                    }`}>
                      {formatDate(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {selectedNegotiation.status === 'active' && (
            <div className="p-6 border-t bg-gray-50">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              
              {user.role === 'vendor' && (
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => handleAcceptOffer(selectedNegotiation.id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Offer
                  </button>
                  <button
                    onClick={() => handleRejectOffer(selectedNegotiation.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Offer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading negotiations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Negotiations</h1>
          <p className="text-gray-600 mt-2">
            Negotiate prices directly with vendors for better deals
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search negotiations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Negotiations List */}
        <div className="space-y-4">
          {filteredNegotiations.map((negotiation) => (
            <div
              key={negotiation.id}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedNegotiation(negotiation);
                setShowModal(true);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={negotiation.product.image}
                    alt={negotiation.product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {negotiation.product.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Vendor: {negotiation.vendor.name}</span>
                      <span>•</span>
                      <span>Original: {formatCurrency(negotiation.product.originalPrice)}</span>
                      <span>•</span>
                      <span>Proposed: {formatCurrency(negotiation.proposedPrice)}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {negotiation.messages.length} messages
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(negotiation.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(negotiation.status)}`}>
                    {getStatusIcon(negotiation.status)}
                    <span className="ml-1">{negotiation.status}</span>
                  </span>
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNegotiations.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No negotiations found</h3>
            <p className="text-gray-600">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Start negotiating with vendors for better prices!'}
            </p>
          </div>
        )}

        {/* Negotiation Modal */}
        {showModal && <NegotiationModal />}
      </div>
    </div>
  );
};

export default Negotiations;
