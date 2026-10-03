import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { commentsAPI } from '../services/api';
import { MessageSquare, Send, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MAX_CHARS = 300;

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentsAPI.getByPost(postId);
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (content.length > MAX_CHARS) {
      setError(`Comment cannot exceed ${MAX_CHARS} characters`);
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccessMessage('');

      const newComment = await commentsAPI.create(postId, content.trim());
      setComments([newComment, ...comments]);
      setContent('');
      setSuccessMessage('Comment added successfully!');

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const remainingChars = MAX_CHARS - content.length;

  return (
    <section className="mt-12 pt-8 border-t border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-indigo-600" />
        <h3 className="text-xl font-bold text-slate-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Leave a comment as <span className="text-indigo-600">{user.name}</span>:
          </label>

          <div className="relative mb-2">
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are your thoughts on this post?"
              maxLength={MAX_CHARS}
              className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className={`font-mono ${remainingChars < 30 ? 'text-red-500 font-semibold' : 'text-slate-400'}`}>
              {remainingChars} / {MAX_CHARS} characters remaining
            </span>

            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
            </button>
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </form>
      ) : (
        <div className="mb-8 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center">
          <p className="text-slate-700 text-sm mb-2">
            Want to join the conversation?
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Log in to post a comment →
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div className="py-10 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 p-6">
          <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-600 font-medium text-sm">
            “No comments yet. Start the conversation.”
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {comment.author?.name ? comment.author.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="font-semibold text-sm text-slate-900">
                    {comment.author?.name || 'Anonymous User'}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed pl-9">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
