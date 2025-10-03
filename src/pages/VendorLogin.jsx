import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Store, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const VendorLogin = () => {
  const { loginVendor } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginVendor(formData.email, formData.password);
      if (result.success) {
        toast.success('Login successful!');
        navigate('/dashboard/vendor', { replace: true });
      } else {
        toast.error(result.message || 'Invalid vendor credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'vendor@snafles.com',
      password: 'vendor123'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Store
          </Link>
          
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <Store className="h-6 w-6 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900">
            Vendor Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your vendor dashboard to manage products and orders
          </p>
        </div>

        {/* Demo Credentials Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Vendor:</strong> vendor@snafles.com / vendor123</p>
            <p><strong>Admin:</strong> admin@snafles.com / admin123</p>
          </div>
          <button
            onClick={fillDemoCredentials}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Fill Demo Credentials
          </button>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-primary hover:text-primary/80"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in to Dashboard'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have a vendor account?{' '}
              <Link
                to="/vendor-register"
                className="font-medium text-primary hover:text-primary/80"
              >
                Apply to become a vendor
              </Link>
            </p>
          </div>
        </form>

        {/* Features */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Vendor Dashboard Features</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              Manage your product catalog
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              Track orders and sales
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              View analytics and reports
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              Update business profile
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;
