import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Feather, LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-slate-200 shadow-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <Feather className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-xs mt-1">
            Log in to BlogNest to write and engage with posts.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'Logging in...' : 'Log In'}</span>
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
