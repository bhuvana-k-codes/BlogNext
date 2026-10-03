import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { PenTool, ArrowLeft, Clock, AlertCircle } from 'lucide-react';

const TOPICS = ['Technology', 'Education', 'Career', 'Lifestyle', 'Ideas', 'Other'];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    topic: 'Technology',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
    const { title, topic, content } = formData;

    if (!title.trim() || !content.trim()) {
      setError('Please fill in both post title and content.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const newPost = await postsAPI.create(formData);
      navigate(`/post/${newPost._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create blog post');
      setSubmitting(false);
    }
  };

  const estimatedReadingTime = calculatePreviewReadingTime(formData.content);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel & Return</span>
      </Link>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create New Post</h1>
            <p className="text-xs text-slate-500">
              Share your knowledge and ideas with the BlogNest community.
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
              placeholder="e.g. Understanding Modern Web Architecture"
              required
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
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
              placeholder="Write your article content here..."
              required
              className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm leading-relaxed resize-y"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              {submitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
