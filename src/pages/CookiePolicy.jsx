import React from 'react';
import { ArrowLeft, Cookie, Shield, Eye, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CookiePolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Cookie className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
              <p className="text-gray-600 mt-2">How we use cookies and similar technologies</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-blue-600" />
                  What Are Cookies?
                </h2>
                <p className="text-gray-700 mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences and enabling certain 
                  functionality.
                </p>
                <p className="text-gray-700">
                  We use both session cookies (which expire when you close your browser) and persistent cookies 
                  (which remain on your device for a set period of time).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Eye className="h-6 w-6 mr-3 text-green-600" />
                  Types of Cookies We Use
                </h2>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                    <p className="text-gray-700 mb-2">
                      These cookies are necessary for the website to function properly. They enable basic functions like 
                      page navigation, access to secure areas, and remembering your login status.
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Examples:</strong> Authentication tokens, shopping cart contents, security preferences
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                    <p className="text-gray-700 mb-2">
                      These cookies help us understand how visitors interact with our website by collecting and 
                      reporting information anonymously.
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Examples:</strong> Google Analytics, page views, user behavior tracking
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Functional Cookies</h3>
                    <p className="text-gray-700 mb-2">
                      These cookies enable enhanced functionality and personalization, such as remembering your 
                      language preferences and customizing content.
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Examples:</strong> Language settings, theme preferences, location data
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Marketing Cookies</h3>
                    <p className="text-gray-700 mb-2">
                      These cookies are used to track visitors across websites to display relevant and engaging 
                      advertisements.
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Examples:</strong> Ad targeting, social media integration, remarketing
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Settings className="h-6 w-6 mr-3 text-purple-600" />
                  Managing Your Cookie Preferences
                </h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Browser Settings</h3>
                  <p className="text-blue-800 mb-4">
                    You can control and delete cookies through your browser settings. Most browsers allow you to:
                  </p>
                  <ul className="list-disc list-inside text-blue-800 space-y-2">
                    <li>View and delete cookies</li>
                    <li>Block cookies from specific websites</li>
                    <li>Block third-party cookies</li>
                    <li>Clear all cookies when you close your browser</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Cookie Consent</h3>
                  <p className="text-green-800 mb-4">
                    When you first visit our website, you'll see a cookie consent banner where you can:
                  </p>
                  <ul className="list-disc list-inside text-green-800 space-y-2">
                    <li>Accept all cookies</li>
                    <li>Reject non-essential cookies</li>
                    <li>Customize your preferences by category</li>
                    <li>Change your preferences at any time</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Some cookies on our website are set by third-party services that appear on our pages. 
                  These include:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                  <li><strong>Social Media Platforms:</strong> For social sharing and login functionality</li>
                  <li><strong>Payment Processors:</strong> For secure payment processing</li>
                  <li><strong>Advertising Networks:</strong> For targeted advertising (with your consent)</li>
                </ul>
                <p className="text-gray-700">
                  We don't control these third-party cookies, so please check their respective privacy policies 
                  for more information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or 
                  for other operational, legal, or regulatory reasons.
                </p>
                <p className="text-gray-700">
                  We will notify you of any material changes by posting the updated policy on our website 
                  and updating the "Last updated" date at the top of this page.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> privacy@snafleshub.com
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> 123 Artisan Street, Creative City
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;

