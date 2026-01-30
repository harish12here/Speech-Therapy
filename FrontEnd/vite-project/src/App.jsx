//src/components/pages/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import Dashboard from './components/pages/Dashboard'
import TherapySession from './components/pages/TherapySession'
import ProgressReports from './components/pages/ProgressReports'
import ExerciseLibrary from './components/pages/ExerciseLibrary'
import Settings from './components/pages/Settings'
import VideoActivityAnalysis from './components/pages/VideoActivityAnalysis'
import Layout from './components/common/Layout'
import { ThemeProvider } from './context/ThemeContext'
import './App.css'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/therapy" 
            element={
              <ProtectedRoute>
                <Layout><TherapySession /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/progress" 
            element={
              <ProtectedRoute>
                <Layout><ProgressReports /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/exercises" 
            element={
              <ProtectedRoute>
                <Layout><ExerciseLibrary /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Layout><Settings /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/video-analysis" 
            element={
              <ProtectedRoute>
                <Layout><VideoActivityAnalysis /></Layout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App