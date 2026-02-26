import React, { useState } from 'react';
import { UserProfile, Gig } from '../types';
import { ArrowLeft, Zap, DollarSign, Clock, CheckCircle2, Star } from 'lucide-react';

const MOCK_GIGS: Gig[] = [
  {
    id: '1',
    title: 'Data Flow Orchestrator',
    company: 'Nexus Logistics',
    rate: '$28/hr',
    comfortRatio: 0.8,
    growthRatio: 0.2,
    comfortSkills: ['Data Entry', 'Email Support'],
    stretchSkills: ['Advanced Excel', 'Pivot Tables'],
    description: 'Looking for a detail-oriented freelancer to manage daily shipping manifests and synthesize them into weekly reports.',
    escrowVerified: true,
    type: 'Stretch',
    comfortRequirements: 'Must have high-speed data processing capabilities and proficiency in basic spreadsheet management. Your background in Data Analytics fulfills 100% of this baseline.',
    stretchRequirements: 'You will need to learn how to design dynamic dashboards that update in real-time. This requires bridge-knowledge from your existing SQL skills to Pivot Logic.',
    suitabilityReason: 'This project is suited for you because it leverages your high-accuracy "Survival" skills for 80% of the workload, providing a risk-free environment to practice "Strategy" level reporting.',
    clientName: 'Alexander Vance',
    clientRating: 4.9,
    deadline: 'October 25, 2024',
    duration: '3 Months (Fixed)',
    fullProjectBrief: 'Nexus Logistics is scaling their regional operations and requires a consistent data flow between the warehouse and the management team. You will act as the primary node for manifest auditing. Success in this role leads to a full-time "Operations Analyst" position.',
    detailedRequirements: [
      'Audit 500+ daily manifest entries',
      'Resolve inventory discrepancies with warehouse leads',
      'Build automated weekly volume reports',
      'Provide monthly trend analysis to the CEO'
    ]
  },
  {
    id: '2',
    title: 'Customer Success Specialist',
    company: 'FinTech Hub',
    rate: '$35/hr',
    comfortRatio: 0.75,
    growthRatio: 0.25,
    comfortSkills: ['Email Support', 'Scheduling'],
    stretchSkills: ['Account Management', 'CRM Logic'],
    description: 'Guide new clients through onboarding. You’ll use your support skills 80% of the time, with 20% dedicated to client growth mapping.',
    escrowVerified: true,
    type: 'Stretch',
    comfortRequirements: 'Exceptional written communication and scheduling discipline. Your history as a Virtual Assistant makes you an expert in these areas already.',
    stretchRequirements: 'You will be expected to utilize CRM automation to trigger client health checks. You should be ready to learn "Proactive Engagement" protocols.',
    suitabilityReason: 'FinTech Hub needs a reliable support anchor who can transition into account management. Your high soft-skill rating from previous gigs makes you the ideal candidate for this pivot.',
    clientName: 'Sarah Chen',
    clientRating: 5.0,
    deadline: 'November 10, 2024',
    duration: 'Ongoing (Retainer)',
    fullProjectBrief: 'FinTech Hub provides micro-loans to digital creators. We need a Success Specialist who doesn\'t just answer emails, but helps our clients understand how to grow their revenue using our tools. This is a high-impact role with direct visibility to the founding team.',
    detailedRequirements: [
      'Onboard 15 new accounts weekly',
      'Manage CRM hygiene for 200+ active clients',
      'Conduct monthly check-in calls with Tier-1 partners',
      'Identify and report upsell opportunities for the sales team'
    ]
  }
];

interface GigFeedProps {
  user: UserProfile;
  onNavigate: (view: any) => void;
}

export const GigFeed: React.FC<GigFeedProps> = ({ user, onNavigate }) => {
  const [viewState, setViewState] = useState<{ mode: 'list' | 'detail'; selectedGig: Gig | null }>({
    mode: 'list',
    selectedGig: null
  });

  const handleExploreMore = (gig: Gig) => {
    setViewState({ mode: 'detail', selectedGig: gig });
  };

  const handleBackToList = () => {
    setViewState({ mode: 'list', selectedGig: null });
  };

  if (viewState.mode === 'detail' && viewState.selectedGig) {
    const gig = viewState.selectedGig;
    return (
      <div className="flex-1 bg-white overflow-y-auto scroll-hide">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4">
          <button 
            onClick={handleBackToList}
            className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-brand-teal transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Mission Feed</span>
          </button>

          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <header>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="bg-brand-neon text-brand-teal px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {gig.comfortRatio * 100}/{gig.growthRatio * 100} Optimal Split
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <span className="mr-1">🎯</span> Project Ref: {gig.id}
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter mb-4">{gig.title}</h1>
                <p className="text-2xl text-brand-teal font-black">{gig.rate}</p>
              </header>

              <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Project Brief</h3>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">{gig.fullProjectBrief}</p>
              </section>

              <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Core Mission Requirements</h3>
                <div className="space-y-4">
                  {gig.detailedRequirements.map((req, i) => (
                    <div key={i} className="flex items-start space-x-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-brand-teal/20 transition-all">
                      <div className="w-6 h-6 rounded-full bg-brand-teal text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{i+1}</div>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed">{req}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[48px] shadow-2xl sticky top-24 space-y-8">
                <div>
                  <h4 className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em] mb-6">Client Data</h4>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl">👤</div>
                    <div>
                      <p className="text-sm font-black">{gig.clientName}</p>
                      <p className="text-[10px] font-bold text-brand-neon">{gig.clientRating} ★ Rating</p>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{gig.company}</p>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-sm font-bold">{gig.duration}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Apply By</p>
                    <p className="text-sm font-bold text-brand-neon">{gig.deadline}</p>
                  </div>
                </div>

                <div className="pt-6">
                  <button className="w-full bg-brand-teal text-white py-5 rounded-[28px] font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                    Initiate Mission
                  </button>
                  <p className="text-center text-[9px] opacity-40 mt-4 font-black uppercase tracking-widest">
                    Funds Secured via SkillPath Escrow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-hide">
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          <header className="mb-16 text-center">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter italic">Stretch<span className="text-brand-teal">Gigs</span></h2>
            <p className="text-slate-500 mt-4 text-lg font-medium">Income now. Growth always. 80/20 Optimal Matching.</p>
          </header>

          <div className="space-y-12">
            {MOCK_GIGS.map(gig => (
              <div 
                key={gig.id} 
                className="group relative bg-white border-2 border-slate-100 rounded-[60px] p-8 md:p-12 transition-all hover:shadow-2xl hover:border-brand-teal/10"
              >
                <div className="flex flex-col md:flex-row justify-between items-start mb-10">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-5">
                      <span className="bg-brand-neon text-brand-teal px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                        AI Optimal Match
                      </span>
                      {gig.escrowVerified && (
                         <span className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                           <CheckCircle2 className="w-3 h-3 text-brand-teal mr-1" />
                           Escrow Verified
                         </span>
                      )}
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 group-hover:text-brand-teal transition-colors tracking-tight leading-tight">{gig.title}</h3>
                    <p className="text-xl text-slate-500 mt-1 font-medium">{gig.company} • <span className="text-brand-teal font-black">{gig.rate}</span></p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 mb-10">
                  {/* Comfort Zone Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Comfort Zone (80%)</span>
                       <div className="h-0.5 flex-1 bg-slate-50"></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {gig.comfortSkills.map(s => <span key={s} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold">{s}</span>)}
                    </div>
                    <div className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100">
                       <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">
                         {gig.comfortRequirements}
                       </p>
                    </div>
                  </div>

                  {/* Stretch Zone Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                       <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.2em]">Stretch Zone (20%)</span>
                       <div className="h-0.5 flex-1 bg-brand-neon/20"></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {gig.stretchSkills.map(s => <span key={s} className="px-3 py-1 bg-brand-neon text-brand-teal rounded-xl text-[10px] font-black">{s}</span>)}
                    </div>
                    <div className="bg-brand-neon/5 p-6 rounded-[32px] border border-brand-neon/10">
                       <p className="text-[11px] text-brand-teal leading-relaxed font-bold">
                         {gig.stretchRequirements}
                       </p>
                    </div>
                  </div>
                </div>

                {/* Suitability Explanation */}
                <div className="bg-brand-teal/5 p-8 rounded-[40px] border border-brand-teal/10 mb-10">
                   <h4 className="text-[10px] font-black text-brand-teal uppercase tracking-widest mb-3 flex items-center">
                     <Zap size={14} className="mr-2 fill-brand-teal" /> AI Suitability Diagnosis
                   </h4>
                   <p className="text-sm font-bold text-slate-700 leading-relaxed">
                     {gig.suitabilityReason}
                   </p>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                  <p className="text-sm text-slate-400 line-clamp-1 max-w-md font-medium">{gig.description}</p>
                  <button 
                    onClick={() => handleExploreMore(gig)}
                    className="text-[11px] font-black text-brand-teal uppercase tracking-widest bg-brand-neon/20 px-6 py-3 rounded-2xl hover:bg-brand-neon/40 hover:translate-x-1 transition-all"
                  >
                    Explore Project Brief →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
