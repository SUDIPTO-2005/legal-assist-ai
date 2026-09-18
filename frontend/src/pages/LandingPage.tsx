import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  GitCompare, 
  MessageSquare, 
  Lock, 
  Globe2, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-legal-gold selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-legal-navy via-slate-900 to-slate-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-legal-gold text-xs font-bold tracking-wide uppercase shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Legal Document Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Understand legal documents with <span className="text-transparent bg-clip-text bg-gradient-to-r from-legal-gold via-amber-300 to-amber-100">absolute confidence.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Transform complex legal terminology, hidden obligations, and financial risk clauses into plain, actionable insights before you sign.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-legal-gold to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-base backdrop-blur-sm"
            >
              <span>Sign In to Workspace</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit Bank-Grade Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-legal-gold" />
              <span>Strict Privacy & Non-Retention</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Responsible AI Safety Guardrails</span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Disclaimer */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20 w-full">
        <DisclaimerBanner />
      </div>

      {/* Core Features Grid */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Built for Real-World Legal Challenges
          </h2>
          <p className="text-slate-600 text-base">
            Everything you need to navigate contracts, leases, NDAs, and agreements without expensive consultation fees for routine reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: FileText,
              title: "AI Document Analyzer",
              desc: "Instant breakdown of key points, obligations, payment terms, and critical renewal deadlines in seconds.",
              badge: "RAG Powered"
            },
            {
              icon: ShieldCheck,
              title: "Clause Intelligence Engine",
              desc: "Automatically classifies indemnity, termination, non-compete, and financial risk clauses with risk indicators.",
              badge: "Risk Scoring"
            },
            {
              icon: GitCompare,
              title: "Contract Comparison Engine",
              desc: "Side-by-side diff highlighting added, removed, or modified obligations with substantive legal impact assessments.",
              badge: "Diff Matrix"
            },
            {
              icon: MessageSquare,
              title: "Document-Aware Chat Assistant",
              desc: "Ask any question about your document and receive citations referencing exact clauses with safety boundaries.",
              badge: "Grounding"
            },
            {
              icon: BookOpen,
              title: "'Explain Like I'm New' Mode",
              desc: "Toggle effortlessly between simple everyday language and professional legalese for maximum comprehension.",
              badge: "Plain English"
            },
            {
              icon: Globe2,
              title: "Multilingual Legal Support",
              desc: "Translate and analyze legal documents across English, Hindi, and regional languages while preserving exact legal intent.",
              badge: "Multilingual"
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all space-y-4 group">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-slate-100 text-legal-navy group-hover:bg-legal-navy group-hover:text-legal-gold rounded-2xl transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg uppercase">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-legal-navy">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section id="security" className="bg-legal-navy text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-legal-gold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Responsible AI Framework</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              A safety-first approach to legal assistance.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              LexAssist AI is engineered specifically to prevent hallucinated advice, reject unauthorized legal claims, and detect situations requiring certified human counsel.
            </p>
            <div className="space-y-3">
              {[
                "Strict non-advice boundaries with automatic human escalation triggers",
                "Isolated multi-tenant data storage preventing cross-user data leakage",
                "Full AI Audit Trail tracking queries, models, and token provenance",
                "Zero training on user uploaded legal documents"
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-legal-gold shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm space-y-4">
            <h3 className="text-lg font-bold text-legal-gold">
              What LexAssist AI Does & Does NOT Do
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>DO:</strong> Summarize agreements, flag risky clauses, calculate financial exposure, prepare questions for your lawyer.</span>
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong>DO NOT:</strong> Issue legal judgments, guarantee court outcomes, impersonate attorneys, or give binding advice.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-legal-gold" />
            <span className="font-bold text-white">LexAssist AI</span>
            <span>— Legal Information Companion</span>
          </div>
          <p>© {new Date().getFullYear()} LexAssist AI. All rights reserved. Non-lawyer legal technology platform.</p>
        </div>
      </footer>
    </div>
  );
};
