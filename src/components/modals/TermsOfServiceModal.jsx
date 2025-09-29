import React from 'react';
import { X, FileText, Truck, RefreshCw, Shield, Clock, CheckCircle, CreditCard, AlertTriangle } from 'lucide-react';

const TermsOfServiceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Terms of Service</h2>
                <p className="text-green-100">Please read our terms carefully</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="h-5 w-5 text-blue-600 mr-2" />
                Shipping and Delivery
              </h3>
              <div className="bg-blue-50 rounded-lg p-6 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  We offer open-box delivery to ensure you're happy with what you receive right at your doorstep. 
                  Most of our products are delivered within one to two days, and we take full responsibility for 
                  the entire delivery process. If anything goes wrong—like a missing item or a mix-up—that's on us, 
                  not on the vendors or sellers. We're here to make sure you get exactly what you ordered, safely 
                  and swiftly, because your satisfaction is our priority.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-900">Fast Delivery</h4>
                  <p className="text-green-800 text-sm">1-2 days for most products</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900">Open-Box Delivery</h4>
                  <p className="text-blue-800 text-sm">Verify your order at delivery</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-900">Full Responsibility</h4>
                  <p className="text-purple-800 text-sm">We handle all delivery issues</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <RefreshCw className="h-5 w-5 text-green-600 mr-2" />
                Returns and Refunds
              </h3>
              <div className="bg-green-50 rounded-lg p-6 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  We want you to shop with confidence. If you need to return an item, you can do so within 14 days 
                  for a full refund. We take full responsibility for any issues—so if something arrives broken or 
                  isn't as expected, just let us know. If you request a refund within that 14-day window, you'll 
                  get your full amount back.
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-6 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  If you request a refund after 14 days, a small deduction—about 12%—will apply. We handle the 
                  entire process ourselves, so you don't have to worry about vendors or sellers. Our goal is to 
                  make sure you're happy and that everything is fair and simple.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Within 14 Days
                  </h4>
                  <ul className="space-y-2 text-green-800">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                      Full refund guaranteed
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                      No questions asked
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                      Free return shipping
                    </li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-6">
                  <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
                    <Clock className="h-5 w-5 text-orange-600 mr-2" />
                    After 14 Days
                  </h4>
                  <ul className="space-y-2 text-orange-800">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
                      12% deduction applies
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
                      Still fully handled by us
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
                      Fair and transparent process
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
                Payment Terms
              </h3>
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Payment is due at the time of purchase. We accept all major credit cards, UPI, Net Banking, 
                  and Cash on Delivery (where available). All transactions are processed securely.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Secure payment processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Multiple payment options</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Protected transaction data</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                Limitation of Liability
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  SNAFLEShub shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                  including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting 
                  from your use of the service.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">User Agreement</h3>
              <div className="bg-yellow-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  By using our service, you agree to these terms and conditions. You must be at least 18 years old to 
                  make purchases. You are responsible for maintaining the confidentiality of your account information 
                  and for all activities that occur under your account.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Changes to Terms</h3>
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes 
                  via email or through our website. Your continued use of the service after such modifications constitutes 
                  acceptance of the updated terms.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700"><strong>Email:</strong> legal@snafleshub.com</p>
                  <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p className="text-gray-700"><strong>Address:</strong> 123 Artisan Street, Creative City, CC 12345</p>
                </div>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500 text-center">
                These Terms of Service are effective as of {new Date().toLocaleDateString()} and will remain in effect 
                except with respect to any changes in its provisions in the future.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              I Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;
