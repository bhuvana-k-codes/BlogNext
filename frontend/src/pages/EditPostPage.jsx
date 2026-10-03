import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Edit, ArrowLeft, Clock, AlertCircle } from 'lucide-react';

const TOPICS = ['Technology', 'Education', 'Career', 'Lifestyle', 'Ideas', 'Other'];

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    topic: 'Technology',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const post = await postsAPI.getById(id);

      // Check ownership
      const authorId = typeof post.author === 'object' ? post.author._id : post.author;
      if (!user || user._id !== authorId) {
        setError('You are not authorized to edit this post.');
        setLoading(false);
        return;
      }

      setFormData({
        title: post.title,
        topic: post.topic,
        content: post.content
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch post details');
    } finally {
      setLoading(false);
    }
  };

  const calculatePreviewReadingTime = (text) => {
    if (!text || !text.trim()) return 1;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in both post title and content.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await postsAPI.update(id, formData);
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update post');
      setSubmitting(false);
    }
  };

  const estimatedReadingTime = calculatePreviewReadingTime(formData.content);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading post data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to={`/post/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel & Return to Post</span>
      </Link>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Edit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Post</h1>
            <p className="text-xs text-slate-500">
              Update your post content and details.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Post Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
            />
          </div>

          {/* Topic Select */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Topic <span className="text-red-500">*</span>
            </label>
            <select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
            >
              {TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {/* Post Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700">
                Content <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5" />
                <span>Est. Reading Time: ~{estimatedReadingTime} min read</span>
              </div>
            </div>

            <textarea
              name="content"
              rows={12}
              value={formData.content}
              onChange={handleChange}
              required
              className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm leading-relaxed resize-y"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to={`/post/${id}`}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
