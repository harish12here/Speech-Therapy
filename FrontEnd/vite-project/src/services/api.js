//src/services/api.js
import axios from 'axios';

// Base URL for the FastAPI Backend
const API_URL = 'http://127.0.0.1:8000/api';

// Create Axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 Unauthorized (token expired)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login handled by React Router (state change)
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

// --- Auth Services ---

export const loginUser = async (email, password) => {
    try {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        const response = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            // Fetch user details immediately after login
            const userResponse = await api.get('/auth/me');
            localStorage.setItem('user', JSON.stringify(userResponse.data));
            return { token: response.data.access_token, user: userResponse.data };
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getUserStats = async () => {
    const response = await api.get('/auth/stats');
    return response.data;
};

export const analyzeSpeech = async (audioBlob, exerciseId) => {
    const formData = new FormData();
    const filename = audioBlob.name || 'recording.wav';
    formData.append('audio', audioBlob, filename);
    
    if (exerciseId) {
        formData.append('exercise_id', exerciseId);
    }
    
    const response = await api.post('/speech/analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const updateUserProfile = async (updateData) => {
    const response = await api.put('/auth/me', updateData);
    return response.data;
};

// --- Exercise Services ---

export const getExercises = async (filters = {}) => {
    // filters can be { language: 'ta', difficulty: 'easy' }
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/exercises/?${params}`);
    return response.data;
};

export const getExerciseById = async (id) => {
    const response = await api.get(`/exercises/${id}`);
    return response.data;
};


export const analyzeVideo = async (videoFile) => {
    console.log('Uploading video for analysis...', videoFile.name);
    const formData = new FormData();
    formData.append('video', videoFile);
    
    const response = await api.post('/video/analyze', formData, {
        headers: {
            'Content-Type': undefined, 
        },
    });
    console.log('Analysis response:', response.data);
    return response.data;
};

// --- Progress Services ---

export const getProgressStats = async () => {
    const response = await api.get('/progress/stats');
    return response.data;
};

export const getWeeklyProgress = async () => {
    const response = await api.get('/progress/weekly');
    return response.data;
};

export const getPhonemeMastery = async () => {
    const response = await api.get('/progress/phonemes');
    return response.data;
};

export const getSessionHistory = async () => {
    const response = await api.get('/progress/history');
    return response.data;
};

export const getRecommendations = async () => {
    const response = await api.get('/progress/recommendations');
    return response.data;
};

export default api;
