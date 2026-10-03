import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Feather, PlusCircle, Bookmark, LogOut, User, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-indigo-700 transition-colors">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                BlogNest
              </span>
              <span className="hidden md:inline-block ml-2 text-xs font-normal text-slate-500 border-l border-slate-200 pl-2">
                A simple space to write, read and share.
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to="/create-post"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    isActive('/create-post')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Post</span>
                </Link>

                <Link
                  to="/saved-posts"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    isActive('/saved-posts')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Saved Posts</span>
                </Link>

                <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                <div className="flex items-center gap-3 pl-1">
                  <div className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                    <User className="w-4 h-4 text-indigo-600" />
                    <span>Hi, {user.name}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 pl-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1 shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
