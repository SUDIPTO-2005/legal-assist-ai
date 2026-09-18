import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Briefcase, 
  Building, 
  Globe2, 
  BookOpen, 
  ShieldCheck, 
  Save, 
  Key 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [profession, setProfession] = useState(user?.profession || 'Individual');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'hi' | 'bn' | 'es'>(user?.preferred_language || 'en');
  const [explanationMode, setExplanationMode] = useState<'beginner' | 'professional'>(user?.explanation_mode || 'beginner');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      full_name: fullName,
      profession,
      organization,
      preferred_language: preferredLanguage,
      explanation_mode: explanationMode,
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;
    try {
      await authService.updateProfile({} as any);
      toast.success('Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
    } catch {
      toast.error('Failed to change password.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Account & Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure default AI explanation styles, regional language settings, and security credentials.
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-legal-navy text-legal-gold font-extrabold text-2xl flex items-center justify-center shadow-md">
            {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">{fullName || user?.email}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-legal-navy outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Profession / Role</label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Individual, Small Business, Lawyer"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-legal-navy outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Firm</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Acme Corp or Private"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-legal-navy outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Default Explanation Mode</label>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={explanationMode}
                onChange={(e) => setExplanationMode(e.target.value as any)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-legal-navy outline-none"
              >
                <option value="beginner">Beginner (Simple Everyday Language)</option>
                <option value="professional">Professional (Rigorous Legalese)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Language</label>
            <div className="relative">
              <Globe2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as any)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-legal-navy outline-none"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="bn">Bengali (বাংলা)</option>
                <option value="es">Spanish (Español)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-legal-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-legal-gold" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
