import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, postsAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('blognest_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('blognest_token') || null;
  });

  const [loading, setLoading] = useState(true);
  const [savedPostIds, setSavedPostIds] = useState(user?.savedPosts || []);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('blognest_recent');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
          setSavedPostIds(userData.savedPosts || []);
          localStorage.setItem('blognest_user', JSON.stringify(userData));

          // Fetch recently viewed from backend
          try {
            const recents = await userAPI.getRecentlyViewed();
            setRecentlyViewed(recents);
          } catch (e) {
            console.error('Failed to load recent posts', e);
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          logout();
        }
      } else {
        setUser(null);
        setSavedPostIds([]);
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    setToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
    setSavedPostIds(data.savedPosts || []);
    localStorage.setItem('blognest_token', data.token);
    localStorage.setItem('blognest_user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authAPI.register(name, email, password);
    setToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
    setSavedPostIds([]);
    localStorage.setItem('blognest_token', data.token);
    localStorage.setItem('blognest_user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSavedPostIds([]);
    localStorage.removeItem('blognest_token');
    localStorage.removeItem('blognest_user');
  };

  const isPostSaved = (postId) => {
    if (!postId) return false;
    return savedPostIds.some(id => 
      typeof id === 'object' ? id._id === postId || id === postId : id === postId
    );
  };

  const toggleSavePost = async (postId) => {
    if (!user) {
      return { success: false, requireLogin: true };
    }

    try {
      const res = await postsAPI.toggleSave(postId);
      setSavedPostIds(res.savedPosts);
      setUser(prev => ({ ...prev, savedPosts: res.savedPosts }));
      return { success: true, isSaved: res.isSaved, message: res.message };
    } catch (error) {
      console.error('Save post error:', error);
      return { success: false, error: error.message };
    }
  };

  const addRecentlyViewedPost = async (post) => {
    if (!post || !post._id) return;
    
    // Update local state immediately
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p._id !== post._id);
      const updated = [post, ...filtered].slice(0, 6);
      localStorage.setItem('blognest_recent', JSON.stringify(updated));
      return updated;
    });

    // If logged in, sync with backend
    if (user && token) {
      try {
        await userAPI.addRecentlyViewed(post._id);
      } catch (e) {
        // Silent failure for recents sync
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        savedPostIds,
        isPostSaved,
        toggleSavePost,
        recentlyViewed,
        addRecentlyViewedPost
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
