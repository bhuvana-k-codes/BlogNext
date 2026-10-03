import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import SavedPostsPage from './pages/SavedPostsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { BookOpen, ArrowLeft } from 'lucide-react';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Verifying authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-post/:id"
            element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-posts"
            element={
              <ProtectedRoute>
                <SavedPostsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* 404 Fallback Route */}
          <Route
            path="*"
            element={
              <div className="max-w-md mx-auto px-4 py-20 text-center">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h1>
                <p className="text-sm text-slate-500 mb-6">
                  The page you are looking for does not exist or has been moved.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Home</span>
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
