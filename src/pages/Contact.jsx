import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, User, Store, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Determine user role
  const userRole = user?.role || 'guest';
  const isCustomer = userRole === 'customer' || userRole === 'guest';
  const isVendor = userRole === 'vendor';
  const isAdmin = userRole === 'admin';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Role-based inquiry types
  const customerInquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'order', label: 'Order Support' },
    { value: 'shipping', label: 'Shipping & Delivery' },
    { value: 'return', label: 'Returns & Refunds' },
    { value: 'payment', label: 'Payment Issues' },
    { value: 'product', label: 'Product Questions' }
  ];

  const vendorInquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'vendor-setup', label: 'Vendor Onboarding' },
    { value: 'product-listing', label: 'Product Listing Support' },
    { value: 'order-management', label: 'Order Management' },
    { value: 'payment-payout', label: 'Payment & Payouts' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'policy', label: 'Policy Questions' }
  ];

  const adminInquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'system-issue', label: 'System Issues' },
    { value: 'user-management', label: 'User Management' },
    { value: 'vendor-management', label: 'Vendor Management' },
    { value: 'security', label: 'Security Concerns' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'escalation', label: 'Escalation Required' }
  ];

  const inquiryTypes = isAdmin ? adminInquiryTypes : isVendor ? vendorInquiryTypes : customerInquiryTypes;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Contact form submitted:', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '', inquiryType: 'general' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            Contact Us {isAdmin ? '(Admin)' : isVendor ? '(Vendor)' : '(Customer)'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isAdmin 
                ? 'Admin Support' 
                : isVendor 
                ? 'Vendor Support' 
                : 'Get in Touch'
              }
            </h2>
            <p className="text-gray-600 mb-8">
              {isAdmin 
                ? 'Need technical support or have system issues? Our admin team is here to help with platform management and technical concerns.' 
                : isVendor 
                ? 'Need help growing your business or have vendor-related questions? Our vendor support team is here to assist you.' 
                : 'Have a question, suggestion, or need help? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'
              }
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Us</h3>
                  <p className="text-gray-600">
                    {isAdmin 
                      ? 'admin@snafleshub.com' 
                      : isVendor 
                      ? 'vendors@snafleshub.com' 
                      : 'support@snafleshub.com'
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    {isAdmin ? '24/7 Support' : 'We\'ll respond within 24 hours'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Call Us</h3>
                  <p className="text-gray-600">
                    {isAdmin 
                      ? '+1 (555) 123-4567 (Admin Line)' 
                      : isVendor 
                      ? '+1 (555) 123-4568 (Vendor Line)' 
                      : '+1 (555) 123-4567'
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    {isAdmin ? '24/7 Support' : 'Mon-Fri 9AM-6PM EST'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Visit Us</h3>
                  <p className="text-gray-600">123 Artisan Street<br />Creative City, CC 12345</p>
                  <p className="text-sm text-gray-500">By appointment only</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Business Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                  Inquiry Type *
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {inquiryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-3 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How quickly do you respond?</h3>
              <p className="text-gray-600 text-sm">We typically respond to all inquiries within 24 hours during business days.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer phone support?</h3>
              <p className="text-gray-600 text-sm">Yes, you can call us during business hours for immediate assistance.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I visit your office?</h3>
              <p className="text-gray-600 text-sm">Yes, but please schedule an appointment in advance.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What if I have a technical issue?</h3>
              <p className="text-gray-600 text-sm">For technical issues, please email us with detailed information about the problem.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
