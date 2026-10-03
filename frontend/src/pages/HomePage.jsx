import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import TopicFilter from '../components/TopicFilter';
import { Sparkles, Clock, ArrowRight, BookOpen, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { user, recentlyViewed } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts(selectedTopic);
  }, [selectedTopic]);

  const fetchPosts = async (topic) => {
    try {
      setLoading(true);
      setError('');
      const data = await postsAPI.getAll(topic);
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Welcome Hero Banner */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to BlogNest</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white leading-tight">
            Share your ideas. <br className="hidden sm:inline" />
            <span className="text-indigo-200">Discover something new.</span>
          </h1>

          <p className="text-indigo-100 text-base mb-6 leading-relaxed">
            A simple space to write, read and share. Explore insightful articles on technology, career, lifestyle, and education.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <Link
                to="/create-post"
                className="px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Write a Post</span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-semibold text-sm transition-all shadow-md flex items-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Continue Reading Section (if recently viewed posts exist) */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Continue Reading</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyViewed.slice(0, 3).map((recentPost) => (
              <Link
                key={recentPost._id}
                to={`/post/${recentPost._id}`}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
                    {recentPost.topic || 'Article'}
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 line-clamp-1 transition-colors">
                    {recentPost.title}
                  </h4>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{recentPost.readingTime || 1} min read</span>
                  <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                    Resume →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Main Blog Posts Feed */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Latest Posts</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Explore recent articles from our community.
            </p>
          </div>

          {/* Topic Filter */}
          <TopicFilter
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
          />
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm border border-red-200">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8 max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">
              “No posts yet. Be the first to share something.”
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {selectedTopic !== 'All' 
                ? `There are currently no posts under the "${selectedTopic}" topic.`
                : 'Start the blog community by sharing your first article!'}
            </p>
            {user ? (
              <Link
                to="/create-post"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create a Post</span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <span>Register to Create Post</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
