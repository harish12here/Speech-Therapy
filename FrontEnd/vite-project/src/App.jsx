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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
          <Routes>
            {/* ... routes remain same ... */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/therapy" 
              element={
                <ProtectedRoute>
                  <TherapySession />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/progress" 
              element={
                <ProtectedRoute>
                  <ProgressReports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/exercises" 
              element={
                <ProtectedRoute>
                  <ExerciseLibrary />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/video-analysis" 
              element={
                <ProtectedRoute>
                  <VideoActivityAnalysis />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App