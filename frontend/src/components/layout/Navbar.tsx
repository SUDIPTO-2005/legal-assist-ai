import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, LogOut, User as UserIcon, Shield, FileText, GitCompare, MessageSquare, History } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="p-2 bg-legal-navy text-legal-gold rounded-xl shadow-md group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5 text-legal-gold" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-legal-navy flex items-center gap-1">
                LexAssist <span className="text-legal-gold">AI</span>
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-slate-400 block -mt-1 uppercase">
                Legal Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated ? (
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-legal-navy hover:bg-slate-100/80 rounded-lg transition-colors">
                Dashboard
              </Link>
              <Link to="/documents" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-legal-navy hover:bg-slate-100/80 rounded-lg transition-colors">
                Documents
              </Link>
              <Link to="/compare" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-legal-navy hover:bg-slate-100/80 rounded-lg transition-colors">
                Compare
              </Link>
              <Link to="/chat" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-legal-navy hover:bg-slate-100/80 rounded-lg transition-colors">
                AI Assistant
              </Link>
              <Link to="/audit" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-legal-navy hover:bg-slate-100/80 rounded-lg transition-colors">
                Audit Trail
              </Link>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-legal-navy transition-colors">Features</a>
              <a href="#security" className="hover:text-legal-navy transition-colors">Safety & Security</a>
              <a href="#how-it-works" className="hover:text-legal-navy transition-colors">How It Works</a>
            </div>
          )}

          {/* Auth Controls */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-full transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-legal-navy text-white text-xs font-bold flex items-center justify-center">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {user?.full_name || user?.email}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-legal-navy transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-legal-navy hover:bg-slate-800 rounded-xl shadow-sm hover:shadow transition-all"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
