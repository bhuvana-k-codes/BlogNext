import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, User, Bookmark, ArrowRight, Calendar } from 'lucide-react';

export default function PostCard({ post }) {
  const { isPostSaved, toggleSavePost } = useAuth();
  const navigate = useNavigate();
  const saved = isPostSaved(post._id);

  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await toggleSavePost(post._id);
    if (result.requireLogin) {
      if (confirm('Please log in to save blog posts.')) {
        navigate('/login');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const topicColors = {
    Technology: 'bg-blue-50 text-blue-700 border-blue-200',
    Education: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Career: 'bg-purple-50 text-purple-700 border-purple-200',
    Lifestyle: 'bg-amber-50 text-amber-700 border-amber-200',
    Ideas: 'bg-rose-50 text-rose-700 border-rose-200',
    Other: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const badgeClass = topicColors[post.topic] || topicColors.Other;

  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Badge & Save Button */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
              {post.topic}
            </span>

            <button
              onClick={handleSaveClick}
              className={`p-2 rounded-full transition-colors ${
                saved
                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title={saved ? 'Remove from saved' : 'Save for later'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-600' : ''}`} />
            </button>
          </div>

          {/* Title */}
          <Link to={`/post/${post._id}`}>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2.5 leading-snug">
              {post.title}
            </h3>
          </Link>

          {/* Content Preview */}
          <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Footer Meta Details */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.author?.name || 'Anonymous'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.readingTime || 1} min read</span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(post.createdAt)}</span>
            </div>

            <Link
              to={`/post/${post._id}`}
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <span>Read</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
