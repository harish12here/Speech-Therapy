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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-white/5">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Login</span>
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
            <UserPlus className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Join SpeechTherapy today</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative text-sm text-center">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Create a password"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="child">Child</option>
                <option value="parent">Parent</option>
                <option value="therapist">Therapist</option>
              </select>
            </div>
            
            {formData.role === 'child' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min={3}
                  max={18}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Age"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 mt-6"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus size={20} />
                <span>Sign Up</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
