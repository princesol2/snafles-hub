import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Privacy Matters</h2>
              <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <UserCheck className="h-5 w-5 text-blue-600 mr-2" />
                  Privacy Policy
                </h3>
                <div className="bg-blue-50 rounded-lg p-6 mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    We take your privacy seriously. All the data we store is encrypted to keep it safe. We don't hold onto any 
                    sensitive information beyond what's needed. We might keep your name, phone number, and maybe your card details 
                    just to make future orders easier and for authentication, but we never store anything overly sensitive. 
                    You can trust that your info is handled carefully and that we're only using it to make your experience smoother.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <UserCheck className="h-5 w-5 text-green-600 mr-2" />
                  User Accounts and Registration
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We collect only the minimal information needed to verify your identity and make your login experience seamless. 
                  Your account details are securely stored and are never shared with third parties. This way, next time you come back, 
                  logging in is easy and your information stays completely private.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Lock className="h-5 w-5 text-green-600 mr-2" />
                  Data Security
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We implement industry-standard security measures to protect your personal information. All data is encrypted 
                  in transit and at rest, and we regularly audit our security practices to ensure your information remains safe.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Eye className="h-5 w-5 text-purple-600 mr-2" />
                  Information We Collect
                </h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Account information (name, email, phone number)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Order and transaction history</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Shipping and billing addresses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Communication preferences</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Database className="h-5 w-5 text-orange-600 mr-2" />
                  How We Use Your Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Service Delivery</h4>
                    <p className="text-blue-800 text-sm">Process orders, manage your account, and provide customer support</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Communication</h4>
                    <p className="text-green-800 text-sm">Send order updates, respond to inquiries, and share important information</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Personalization</h4>
                    <p className="text-purple-800 text-sm">Customize your experience and recommend relevant products</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-900 mb-2">Improvement</h4>
                    <p className="text-orange-800 text-sm">Analyze usage patterns to improve our services</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Rights</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">1</span>
                      </div>
                      <span className="text-gray-700">Access your personal data</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">2</span>
                      </div>
                      <span className="text-gray-700">Correct inaccurate information</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">3</span>
                      </div>
                      <span className="text-gray-700">Delete your account</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-sm">4</span>
                      </div>
                      <span className="text-gray-700">Opt-out of marketing communications</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Services</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may use trusted third-party services for payment processing, analytics, and customer support. 
                  These services are carefully selected and are required to maintain the same level of privacy protection 
                  as outlined in this policy.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h3>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar technologies to enhance your browsing experience, remember your preferences, 
                  and analyze website traffic. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h3>
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    If you have any questions about this Privacy Policy or how we handle your personal information, 
                    please don't hesitate to contact us:
                  </p>
                  <div className="space-y-2">
                    <p className="text-gray-700"><strong>Email:</strong> privacy@snafleshub.com</p>
                    <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p className="text-gray-700"><strong>Address:</strong> 123 Artisan Street, Creative City, CC 12345</p>
                  </div>
                </div>
              </section>

              <div className="border-t border-gray-200 pt-6 mt-8">
                <p className="text-sm text-gray-500 text-center">
                  This Privacy Policy is effective as of {new Date().toLocaleDateString()} and will remain in effect 
                  except with respect to any changes in its provisions in the future, which will be in effect 
                  immediately after being posted on this page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
