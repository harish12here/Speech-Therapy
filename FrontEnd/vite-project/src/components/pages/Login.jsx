//src/components/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';
import { Mic, Smile, Loader } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'child'
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await loginUser(formData.email, formData.password);
      // Login successful, redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.detail || 'Failed to login. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4 transition-colors duration-500">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-10 border border-white/20 dark:border-gray-800 animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-6 md:mb-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30 group">
            <Mic className="text-white group-hover:scale-110 transition-transform md:w-10 md:h-10" size={28} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white tracking-tight">
            Speech<span className="text-blue-600">Therapy</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base font-medium">AI-Powered Assistant</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-sm text-center font-bold animate-pulse">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-1 md:space-y-2">
            <label className="block text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 md:py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 text-gray-800 dark:text-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-sm md:text-base"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-1 md:space-y-2">
            <label className="block text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
              Secret Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 md:py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 text-gray-800 dark:text-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-sm md:text-base"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1 md:space-y-2">
            <label className="block text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
              Who are you?
            </label>
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 md:py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 text-gray-800 dark:text-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-sm md:text-base appearance-none cursor-pointer"
            >
              <option value="child">Child / Student</option>
              <option value="parent">Parent</option>
              <option value="therapist">Therapist</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-blue-500/25 active:scale-95 flex items-center justify-center space-x-3 mt-4 md:mt-8"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" size={24} />
                <span>Entering...</span>
              </>
            ) : (
              <>
                <Smile size={24} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            New here?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
            >
              Create an Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;