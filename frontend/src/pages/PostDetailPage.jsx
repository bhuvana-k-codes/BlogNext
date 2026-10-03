import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import ReadingModeHeader from '../components/ReadingModeHeader';
import {
  Clock,
  User,
  Calendar,
  Bookmark,
  BookOpen,
  Edit,
  Trash2,
  ArrowLeft,
  Share2,
  Check
} from 'lucide-react';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isPostSaved, toggleSavePost, addRecentlyViewedPost } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [readingMode, setReadingMode] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await postsAPI.getById(id);
      setPost(data);
      // Track as recently viewed
      addRecentlyViewedPost(data);
    } catch (err) {
      console.error('Failed to load post:', err);
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const isOwner = user && post && post.author && (
    (typeof post.author === 'object' && post.author._id === user._id) ||
    post.author === user._id
  );

  const saved = isPostSaved(post?._id);

  const handleSaveToggle = async () => {
    if (!post) return;
    const result = await toggleSavePost(post._id);
    if (result.requireLogin) {
      if (confirm('Please log in to save blog posts.')) {
        navigate('/login');
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await postsAPI.delete(post._id);
      navigate('/');
    } catch (err) {
      alert(err.message || 'Failed to delete post');
      setDeleting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 mb-4">
          <p className="font-semibold text-lg mb-1">Article Not Found</p>
          <p className="text-sm">{error || 'The requested blog post could not be found.'}</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className={readingMode ? 'bg-amber-50/20 min-h-screen pb-16' : 'pb-16'}>
      {/* Sticky Bar when Reading Mode is Active */}
      {readingMode && (
        <ReadingModeHeader onExit={() => setReadingMode(false)} />
      )}

      <div className={`mx-auto px-4 sm:px-6 transition-all duration-300 ${
        readingMode ? 'max-w-2xl pt-8' : 'max-w-3xl pt-8'
      }`}>
        {/* Back Link */}
        {!readingMode && (
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Posts</span>
          </Link>
        )}

        <article className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
          {/* Post Header */}
          <header className="space-y-4 pb-6 border-b border-slate-100">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {post.topic}
              </span>

              {/* Action Buttons Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReadingMode(!readingMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                    readingMode
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                  title="Toggle comfortable distraction-free reading mode"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{readingMode ? 'Reading Mode On' : 'Reading Mode'}</span>
                </button>

                <button
                  onClick={handleSaveToggle}
                  className={`p-2 rounded-lg text-xs font-semibold transition-colors border ${
                    saved
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                  title={saved ? 'Remove from saved' : 'Save post for later'}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-600' : ''}`} />
                </button>

                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                  title="Copy link to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className={`font-extrabold text-slate-900 tracking-tight leading-tight ${
              readingMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-4xl'
            }`}>
              {post.title}
            </h1>

            {/* Author & Meta Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {post.author?.name ? post.author.name[0].toUpperCase() : 'A'}
                  </div>
                  <span>{post.author?.name || 'Anonymous Author'}</span>
                </div>

                <span>•</span>

                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>

                <span>•</span>

                <div className="flex items-center gap-1 font-medium text-slate-700">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span>{post.readingTime || 1} min read</span>
                </div>
              </div>

              {/* Owner Actions (Edit / Delete) */}
              {isOwner && (
                <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                  <Link
                    to={`/edit-post/${post._id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Post Content Body */}
          <div className={`text-slate-800 font-sans whitespace-pre-wrap ${
            readingMode 
              ? 'text-lg leading-relaxed font-serif tracking-normal text-slate-900 space-y-6' 
              : 'text-base leading-relaxed space-y-4'
          }`}>
            {post.content}
          </div>
        </article>

        {/* Comments Section */}
        {!readingMode && (
          <CommentSection postId={post._id} />
        )}
      </div>
    </div>
  );
}
