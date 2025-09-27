import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';

const AuthGuard = ({ children, requireAuth = true, allowedRoles = [], guestAllowed = false }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    // If guest is allowed and no user, just render children
    if (guestAllowed && !user) {
      return;
    }

    if (requireAuth && !user) {
      // Store the attempted URL to redirect after login
      const currentPath = location.pathname + location.search;
      localStorage.setItem('redirectAfterLogin', currentPath);
      navigate('/login');
      return;
    }

    if (requireAuth && user && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        navigate('/unauthorized');
        return;
      }
    }
  }, [user, loading, requireAuth, allowedRoles, navigate, location, guestAllowed]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">
              You need to be signed in to access this content. Please log in to continue.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full btn btn-primary flex items-center justify-center"
              >
                <User className="h-5 w-5 mr-2" />
                Sign In
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
              
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create one here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show unauthorized message if role doesn't match
  if (requireAuth && user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this content. Please contact an administrator if you believe this is an error.
            </p>
            
            <button
              onClick={() => navigate('/')}
              className="w-full btn btn-outline"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;
