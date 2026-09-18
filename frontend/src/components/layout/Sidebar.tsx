import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  GitCompare, 
  MessageSquare, 
  History, 
  User, 
  ShieldCheck, 
  FileCheck2 
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Workspace', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Legal Documents', path: '/documents', icon: FileText },
  { label: 'Contract Compare', path: '/compare', icon: GitCompare },
  { label: 'AI Legal Chat', path: '/chat', icon: MessageSquare },
  { label: 'Audit Trail', path: '/audit', icon: History },
  { label: 'Account', path: '/profile', icon: User },
];

export const Sidebar: React.FC = () => {
  return (
    <aside aria-label="Application sidebar" className="w-64 bg-legal-navy text-slate-300 min-h-screen p-4 flex flex-col justify-between shrink-0 hidden lg:flex">
      <div>
        <div className="px-3 py-4 mb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-legal-gold" />
            <span className="font-semibold text-sm text-white tracking-wide">
              LexAssist Portal
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Enterprise Legal Safety Guard
          </span>
        </div>

        <nav aria-label="Sidebar navigation" className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold shadow-sm border border-white/10'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-legal-gold" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
        <div className="flex items-center gap-2 mb-1.5">
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-white">
            Information Mode Active
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Non-advice legal information system. Always review major actions with licensed counsel.
        </p>
      </div>
    </aside>
  );
};
