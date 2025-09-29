import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, MessageCircle, Phone, Mail, Clock, HelpCircle, FileText, Truck, CreditCard, Shield, Store, Users, BarChart3, Settings, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();
  
  // Determine user role
  const userRole = user?.role || 'guest';
  const isCustomer = userRole === 'customer' || userRole === 'guest';
  const isVendor = userRole === 'vendor';
  const isAdmin = userRole === 'admin';

  // Role-based FAQs
  const customerFaqs = [
    {
      category: 'orders',
      question: 'How can I track my order?',
      answer: 'You can track your order by visiting the Orders page in your account or using the tracking number provided in your order confirmation email.'
    },
    {
      category: 'orders',
      question: 'Can I cancel my order?',
      answer: 'Orders can be cancelled within 24 hours of placement. After that, you can request a refund through our refund process.'
    },
    {
      category: 'shipping',
      question: 'What are your shipping options?',
      answer: 'We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Free shipping is available on orders over ₹999.'
    },
    {
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. International shipping times vary by location (7-14 business days).'
    },
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 14-day return policy for most items. Items must be in original condition with tags attached.'
    },
    {
      category: 'returns',
      question: 'How do I return an item?',
      answer: 'You can initiate a return by visiting the Refund page and filling out the return request form. We will provide you with return instructions.'
    },
    {
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, UPI, Net Banking, and Cash on Delivery (COD) for eligible orders.'
    },
    {
      category: 'payments',
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard encryption to protect your payment information. We never store your complete payment details.'
    }
  ];

  const vendorFaqs = [
    {
      category: 'vendor-setup',
      question: 'How do I become a vendor on SNAFLES Hub?',
      answer: 'To become a vendor, you need to register as a vendor, complete the verification process, and submit your business documents for approval.'
    },
    {
      category: 'vendor-setup',
      question: 'What documents do I need to become a vendor?',
      answer: 'You need a valid business license, tax ID, bank account details, and proof of address. For handmade items, you may also need craft certification.'
    },
    {
      category: 'products',
      question: 'How do I add products to my store?',
      answer: 'Go to your vendor dashboard, click "Add Product", fill in the product details, upload high-quality images, and set your pricing.'
    },
    {
      category: 'products',
      question: 'What are the product listing requirements?',
      answer: 'Products must have clear, high-resolution images, detailed descriptions, accurate pricing, and comply with our quality standards.'
    },
    {
      category: 'orders',
      question: 'How do I manage incoming orders?',
      answer: 'Orders will appear in your vendor dashboard. You can view order details, update order status, and communicate with customers.'
    },
    {
      category: 'orders',
      question: 'What is the order fulfillment process?',
      answer: 'Once you receive an order, you have 2 business days to confirm and 5-7 days to ship. Update the tracking information in your dashboard.'
    },
    {
      category: 'payments',
      question: 'How and when do I get paid?',
      answer: 'Payments are processed weekly on Fridays. You receive 85% of the sale price after our platform fee. Minimum payout is ₹500.'
    },
    {
      category: 'payments',
      question: 'What are the platform fees?',
      answer: 'We charge a 15% commission on each sale, which includes payment processing, customer support, and platform maintenance.'
    }
  ];

  const adminFaqs = [
    {
      category: 'user-management',
      question: 'How do I manage user accounts?',
      answer: 'Use the Admin Dashboard to view, edit, suspend, or delete user accounts. You can also manage user roles and permissions.'
    },
    {
      category: 'user-management',
      question: 'How do I handle user disputes?',
      answer: 'Review dispute details in the admin panel, communicate with both parties, and make fair decisions based on our policies.'
    },
    {
      category: 'vendor-management',
      question: 'How do I approve new vendors?',
      answer: 'Review vendor applications, verify documents, check product quality, and approve or reject applications through the admin panel.'
    },
    {
      category: 'vendor-management',
      question: 'How do I monitor vendor performance?',
      answer: 'Use the analytics dashboard to track vendor sales, customer ratings, order fulfillment times, and compliance metrics.'
    },
    {
      category: 'product-management',
      question: 'How do I moderate product listings?',
      answer: 'Review new product submissions, check for policy compliance, approve or reject listings, and manage product categories.'
    },
    {
      category: 'product-management',
      question: 'How do I handle product complaints?',
      answer: 'Investigate complaints, communicate with vendors and customers, and take appropriate action including product removal if necessary.'
    },
    {
      category: 'system-management',
      question: 'How do I manage platform settings?',
      answer: 'Access system settings to configure platform fees, shipping options, payment methods, and other global settings.'
    },
    {
      category: 'system-management',
      question: 'How do I generate reports?',
      answer: 'Use the reporting section to generate sales reports, user analytics, vendor performance reports, and financial summaries.'
    }
  ];

  // Select FAQs based on user role
  const faqs = isAdmin ? adminFaqs : isVendor ? vendorFaqs : customerFaqs;

  // Role-based categories
  const customerCategories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle },
    { id: 'orders', name: 'Orders', icon: FileText },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'returns', name: 'Returns & Exchanges', icon: Shield },
    { id: 'payments', name: 'Payments', icon: CreditCard }
  ];

  const vendorCategories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle },
    { id: 'vendor-setup', name: 'Vendor Setup', icon: Store },
    { id: 'products', name: 'Product Management', icon: Package },
    { id: 'orders', name: 'Order Management', icon: FileText },
    { id: 'payments', name: 'Payments & Payouts', icon: CreditCard }
  ];

  const adminCategories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle },
    { id: 'user-management', name: 'User Management', icon: Users },
    { id: 'vendor-management', name: 'Vendor Management', icon: Store },
    { id: 'product-management', name: 'Product Management', icon: Package },
    { id: 'system-management', name: 'System Management', icon: Settings }
  ];

  // Select categories based on user role
  const categories = isAdmin ? adminCategories : isVendor ? vendorCategories : customerCategories;

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex items-center mb-8">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-primary mr-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Help Center {isAdmin ? '(Admin)' : isVendor ? '(Vendor)' : '(Customer)'}
          </h1>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              {isAdmin 
                ? 'How can we help you manage the platform?' 
                : isVendor 
                ? 'How can we help you grow your business?' 
                : 'How can we help you today?'
              }
            </h2>
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {selectedCategory === 'all' ? 'All Questions' : categories.find(c => c.id === selectedCategory)?.name}
              </h3>
              
              {filteredFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HelpCircle size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No articles found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {isAdmin 
              ? 'Need technical support? Contact our admin team' 
              : isVendor 
              ? 'Need business support? Contact our vendor team' 
              : 'Still need help? Contact our support team'
            }
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 text-sm mb-4">
                {isAdmin 
                  ? 'Get instant help from our admin support team' 
                  : isVendor 
                  ? 'Get instant help from our vendor support team' 
                  : 'Get instant help from our support team'
                }
              </p>
              <button className="btn btn-primary btn-sm">Start Chat</button>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                {isAdmin 
                  ? 'admin@snafleshub.com' 
                  : isVendor 
                  ? 'vendors@snafleshub.com' 
                  : 'support@snafleshub.com'
                }
              </p>
              <button className="btn btn-outline btn-sm">Send Email</button>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                {isAdmin 
                  ? '+1 (555) 123-4567 (Admin Line)' 
                  : isVendor 
                  ? '+1 (555) 123-4568 (Vendor Line)' 
                  : '+1 (555) 123-4567'
                }
              </p>
              <p className="text-gray-500 text-xs">
                <Clock size={12} className="inline mr-1" />
                {isAdmin ? '24/7 Support' : 'Mon-Fri 9AM-6PM'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
