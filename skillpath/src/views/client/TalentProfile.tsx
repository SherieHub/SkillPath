import React from 'react';
import { ArrowRight, Zap, ShieldCheck, Target, Award, TrendingUp } from 'lucide-react';

const MOCK_TALENT = {
  id: 'talent-1',
  name: 'Maria Clara Santos',
  title: 'Senior Executive Assistant & Operations Specialist',
  matchScore: 94.2,
  isEscrowVerified: true,
  isOptimalMatch: true,
  outcomes: [
    { label: 'Data Synthesis', value: '99.8% Accuracy' },
    { label: 'Inbox Zero', value: '4hr Avg Response' },
    { label: 'Project Management', value: '15+ Tools Mastered' },
    { label: 'Client Retention', value: '100% Satisfaction' },
  ],
  comfortSkills: ['Calendar Management', 'Email Correspondence', 'Travel Logistics', 'CRM Data Entry', 'Basic Bookkeeping', 'Meeting Minutes'],
  stretchSkills: ['Strategic Operations', 'Workflow Automation', 'Executive Decision Support', 'KPI Dashboarding'],
};

export const TalentProfileView = ({ onBack }: { onBack: () => void }) => (
  <div className="max-w-5xl mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <button 
      onClick={onBack}
      className="flex items-center gap-2 text-slate-500 font-bold hover:text-brand-teal transition-colors group"
    >
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:-translate-x-1 transition-transform">
        <ArrowRight className="rotate-180" size={16} />
      </div>
      Back to Pipeline
    </button>

    <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
      {/* Banner */}
      <div className="bg-brand-teal p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-neon/10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <img 
              src="https://picsum.photos/seed/talent/200/200" 
              alt="Talent" 
              className="w-32 h-32 rounded-3xl border-4 border-brand-neon/40 shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-brand-neon text-brand-teal rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-brand-neon/20">
                  <Zap size={12} className="fill-brand-teal" /> AI Optimal Match
                </span>
                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-white/20">
                  <ShieldCheck size={12} /> Escrow Verified
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">{MOCK_TALENT.name}</h1>
              <p className="text-white/70 text-lg mt-1">{MOCK_TALENT.title}</p>
            </div>
          </div>

          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeDasharray="100, 100"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-brand-neon"
                  strokeDasharray={`${MOCK_TALENT.matchScore}, 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-black text-brand-neon">{MOCK_TALENT.matchScore}%</span>
              </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-3 text-white">Path Readiness</p>
            <p className="text-[9px] text-white/50 mt-1">AI-Driven Prediction Analysis</p>
          </div>
        </div>
      </div>

      <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          {/* Skill Zones */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="text-brand-teal" size={20} />
              Skill Mapping Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">80% Comfort Zone</h4>
                  <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-2 py-1 rounded-full">Mastery</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {MOCK_TALENT.comfortSkills.map(skill => (
                    <span key={skill} className="px-4 py-2 bg-white text-slate-700 rounded-2xl text-sm font-bold shadow-sm border border-slate-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-brand-neon/5 p-8 rounded-[2rem] border border-brand-neon/20">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-bold text-brand-teal uppercase tracking-widest">20% Stretch Zone</h4>
                  <span className="text-[10px] font-bold bg-brand-neon text-brand-teal px-2 py-1 rounded-full">Growth</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {MOCK_TALENT.stretchSkills.map(skill => (
                    <span key={skill} className="px-4 py-2 bg-brand-neon text-brand-teal rounded-2xl text-sm font-bold shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Verified Outcomes */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="text-brand-teal" size={20} />
              Verified Outcomes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MOCK_TALENT.outcomes.map((outcome, idx) => (
                <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{outcome.label}</p>
                  <p className="text-sm font-black text-slate-900">{outcome.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Hiring Summary</p>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-600">Hourly Rate</span>
                <span className="font-bold text-slate-900">$15.00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-600">Escrow Required</span>
                <span className="font-bold text-slate-900">$600.00</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">Platform Fee</span>
                <span className="font-bold text-slate-900">$0.00 (Pro)</span>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-brand-teal text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-teal/90 transition-all shadow-xl shadow-brand-teal/20 active:scale-95 flex items-center justify-center gap-2">
                Approve & Escrow <ArrowRight size={20} />
              </button>
              <button className="w-full bg-white text-brand-teal border-2 border-brand-teal/20 py-5 rounded-2xl font-bold text-lg hover:bg-brand-teal/5 transition-all active:scale-95">
                View Full Skill Tree
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              By clicking Approve, you initiate the SkillPath Escrow Protection. Funds are released based on verified growth milestones.
            </p>
          </div>

          <div className="bg-brand-teal/5 p-6 rounded-3xl border border-brand-teal/10 flex items-start gap-4">
            <div className="p-2 bg-brand-teal rounded-xl text-white">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-brand-teal uppercase tracking-wider">Growth Prediction</p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Maria is predicted to master <strong>Workflow Automation</strong> within 14 days based on her current trajectory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
