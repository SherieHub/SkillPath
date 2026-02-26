import React from 'react';
import { Zap, Users, CheckCircle2, PlusCircle, FileText, DollarSign, Clock, ChevronRight } from 'lucide-react';

interface Gig {
  id: string;
  title: string;
  rate: string;
  matches: number;
  status: 'active' | 'draft';
  postedDate: string;
}

const MOCK_GIGS: Gig[] = [
  { id: '1', title: 'Executive Virtual Assistant for E-commerce', rate: '$12/hr', matches: 8, status: 'active', postedDate: '2 days ago' },
  { id: '2', title: 'Short-form Video Editor (TikTok/Reels)', rate: '$15/hr', matches: 12, status: 'active', postedDate: '5 hours ago' },
  { id: '3', title: 'Technical Customer Success Specialist', rate: '$18/hr', matches: 4, status: 'active', postedDate: '1 week ago' },
];

const MetricCard = ({ icon: Icon, label, value, trend }: { icon: any, label: string, value: string, trend?: string }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <div className="p-3 bg-brand-teal/5 rounded-2xl text-brand-teal">
        <Icon size={24} />
      </div>
      {trend && (
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
  </div>
);

export const ClientDashboard = ({ onSelectGig, onCreateGig }: { onSelectGig: () => void, onCreateGig: () => void }) => (
  <div className="space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Talent Pipeline</h1>
        <p className="text-slate-500 mt-2 text-lg">Manage your active growth gigs and AI-vetted matches.</p>
      </div>
      <button 
        onClick={onCreateGig}
        className="bg-brand-teal text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-teal/90 transition-all shadow-lg shadow-brand-teal/20 active:scale-95"
      >
        <PlusCircle size={20} />
        Post New Growth Gig
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard icon={Zap} label="Active Growth Gigs" value="3" trend="+1 this week" />
      <MetricCard icon={Users} label="AI Matches Ready" value="24" trend="94% Avg Match" />
      <MetricCard icon={CheckCircle2} label="Outcomes Verified" value="142" trend="100% Success" />
    </div>

    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
        Active Gigs
        <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">3</span>
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {MOCK_GIGS.map((gig) => (
          <div 
            key={gig.id}
            onClick={onSelectGig}
            className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-brand-teal/30 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors">
                <FileText size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-teal transition-colors">{gig.title}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><DollarSign size={14} /> {gig.rate}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> Posted {gig.postedDate}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-2xl font-bold text-brand-teal">{gig.matches}</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">AI Verified Matches</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-neon group-hover:text-brand-teal transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
