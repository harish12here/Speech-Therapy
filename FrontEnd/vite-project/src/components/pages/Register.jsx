//src/components/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, UserPlus, Loader, ArrowLeft } from 'lucide-react';
import { registerUser } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'child',
    age: '', // Optional for child
    language_preference: 'en'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Convert age to number if present
      const submissionData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null
      };
      
      await registerUser(submissionData);
      
      // Registration successful!
      // In a real app we might auto-login, but for now redirect to login
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      console.error(err);
      setError(err.detail || 'Failed to register. Please try again.');
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
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-10 border border-white/20 dark:border-gray-800 animate-fadeIn overflow-y-auto max-h-[95vh] scrollbar-hide">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/login')}
          className="group flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-all font-bold text-xs uppercase tracking-widest active:scale-95"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </button>

        {/* Logo */}
        <div className="text-center mb-6 md:mb-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-500/30 group">
            <UserPlus className="text-white group-hover:scale-110 transition-transform md:w-10 md:h-10" size={28} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white tracking-tight">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base font-medium">Join SpeechTherapy today</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-sm text-center font-bold animate-pulse">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-1 md:space-y-2">
            <label className="block text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 md:py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 text-gray-800 dark:text-white rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all outline-none text-sm md:text-base"
              placeholder="Your name"
            />
          </div>

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
              className="w-full px-4 py-3 md:py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 text-gray-800 dark:text-white rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all outline-none text-sm md:text-base"
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
              minLength={6}
              className="w-full px-4 py-3 md:py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 text-gray-800 dark:text-white rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all outline-none text-sm md:text-base"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 md:space-y-2">
              <label className="block text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
                Role
              </label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 md:py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 text-gray-800 dark:text-white rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all outline-none text-sm md:text-base appearance-none cursor-pointer"
              >
                <option value="child">Child</option>
                <option value="parent">Parent</option>
                <option value="therapist">Therapist</option>
              </select>
            </div>
            
            {formData.role === 'child' && (
              <div className="space-y-1 md:space-y-2">
                <label className="block text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min={3}
                  max={18}
                  className="w-full px-4 py-3 md:py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 text-gray-800 dark:text-white rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all outline-none text-sm md:text-base"
                  placeholder="Age"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-green-500/25 active:scale-95 flex items-center justify-center space-x-3 mt-4 md:mt-8"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" size={24} />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <UserPlus size={24} />
                <span>Join Now</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
