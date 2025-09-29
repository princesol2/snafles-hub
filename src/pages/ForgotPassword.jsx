import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDevResetUrl('');
    try {
      const emailTrimmed = email.trim().toLowerCase();
      if (!emailTrimmed) {
        toast.error('Please enter your email');
        return;
      }

      // Use unified reset request API used elsewhere in the app
      const res = await authAPI.requestPasswordReset({ email: emailTrimmed });
      toast.success('If the email exists, a reset link has been sent.');
      if (res?.resetUrl) setDevResetUrl(res.resetUrl);
    } catch (err) {
      toast.error(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
        <p className="text-sm text-gray-600 mb-6">Enter your email to receive a password reset link.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-4 text-sm">
          <Link to="/login" className="text-primary hover:underline">Back to login</Link>
        </div>

        {devResetUrl && (
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <div className="font-medium text-yellow-800">Development reset link</div>
            <a href={devResetUrl} target="_blank" rel="noreferrer" className="text-yellow-700 underline break-all">{devResetUrl}</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
