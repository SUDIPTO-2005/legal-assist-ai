import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Scale, Lock, Mail, User, Briefcase, Building, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();

  const [isRegister, setIsRegister] = useState(location.pathname === '/register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('Individual');
  const [organization, setOrganization] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [explanationMode, setExplanationMode] = useState('beginner');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      await register({
        email,
        password,
        password_confirm: passwordConfirm,
        full_name: fullName,
        profession,
        organization,
        preferred_language: preferredLanguage,
        explanation_mode: explanationMode,
      });
    } else {
      await login({ email, password });
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="p-2.5 bg-legal-navy text-legal-gold rounded-2xl shadow-md">
            <Scale className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-legal-navy">
            LexAssist <span className="text-legal-gold">AI</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          {isRegister ? 'Create your legal workspace' : 'Welcome back'}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {isRegister ? 'Join millions navigating legal documents with clarity' : 'Sign in to access your analyzed documents'}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200 rounded-3xl sm:px-10">
          {/* Tab switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                !isRegister ? 'bg-white text-legal-navy shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                isRegister ? 'bg-white text-legal-navy shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Advocate Sarah Jenkins"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-legal-navy focus:ring-1 focus:ring-legal-navy outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-legal-navy focus:ring-1 focus:ring-legal-navy outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-legal-navy focus:ring-1 focus:ring-legal-navy outline-none transition-all"
                />
              </div>
            </div>

            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-legal-navy focus:ring-1 focus:ring-legal-navy outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Role / Profession</label>
                    <select
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                    >
                      <option value="Individual">Individual Consumer</option>
                      <option value="Business Owner">Small Business Owner</option>
                      <option value="Legal Counsel">Lawyer / Legal Counsel</option>
                      <option value="HR Professional">HR Professional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Language</label>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi (हिंदी)</option>
                      <option value="bn">Bengali (বাংলা)</option>
                      <option value="es">Spanish (Español)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-legal-navy hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <span>{isRegister ? 'Create Free Workspace' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 text-legal-gold" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <DisclaimerBanner compact />
          </div>
        </div>
      </div>
    </div>
  );
};
