import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Bookmark, ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SavedPostsPage() {
  const { user, savedPostIds } = useAuth();
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSavedPosts();
  }, [savedPostIds]);

  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userAPI.getSavedPosts();
      setSavedPosts(data);
    } catch (err) {
      console.error('Failed to fetch saved posts:', err);
      setError('Failed to load saved posts.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Posts</span>
      </Link>

      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
            <Bookmark className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Saved Posts</h1>
            <p className="text-xs text-slate-500">
              Articles you have bookmarked to read later.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading your saved posts...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm border border-red-200">
          {error}
        </div>
      ) : savedPosts.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8 max-w-lg mx-auto">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            “Nothing saved yet. Find something interesting and save it for later.”
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            Click the bookmark icon on any post card or article page to save it here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Posts</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
