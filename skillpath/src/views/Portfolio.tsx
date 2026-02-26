import React from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface PortfolioProps {
  user: UserProfile;
  onNavigate: (view: any) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ user, onNavigate }) => {
  const displayRoles = user.targetRoles.length > 0 
    ? user.targetRoles.join(' & ') 
    : 'Operations Specialist';

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Juan dela Cruz';
  const urlSafeName = fullName.toLowerCase().replace(/\s+/g, '-') || 'talent';

  return (
    <div className="flex-1 bg-white overflow-y-auto scroll-hide animate-in fade-in duration-500">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
         <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-slate-400">
           <span>Your Public Link:</span>
           <span className="text-brand-teal lowercase font-bold">skillpath.io/{urlSafeName}</span>
         </div>
         <button className="bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
           Copy Portfolio Link
         </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 lg:py-16">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-20">
          <div className="relative group shrink-0">
            <div className="absolute -inset-4 bg-brand-teal/10 rounded-[60px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-40 h-40 rounded-[50px] bg-brand-neon/20 overflow-hidden shadow-2xl relative z-10 border-4 border-white rotate-3 group-hover:rotate-0 transition-transform">
              <img src={`https://picsum.photos/seed/${user.firstName || 'path'}/400/400`} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-brand-teal text-white p-2 rounded-2xl shadow-lg z-20 border-4 border-white">
              <ShieldCheck size={20} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left pt-2">
             <div className="inline-flex items-center space-x-2 bg-brand-teal/5 text-brand-teal px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
               SkillPath Verified Talent
             </div>
             <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight mb-4 tracking-tighter">
               {fullName}
             </h1>
             <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
               Specialized in <span className="text-slate-900 underline decoration-brand-neon decoration-4 underline-offset-8">{displayRoles}</span> and Outcome-Driven Data Management.
             </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-16">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Verified Outcomes</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  { title: 'Data Synthesis', icon: '📊', stats: '99.8% Accuracy', desc: 'Managed 50k+ product units across multi-channel CRM systems with perfect data integrity.' },
                  { title: 'Workflow Automation', icon: '⚡', stats: '20hrs Saved/Wk', desc: 'Implemented complex SQL-based automation protocols for critical financial reporting flows.' },
                  { title: 'Customer Success', icon: '🤝', stats: '4.9/5 Rating', desc: 'Guided over 200 enterprise stakeholders through multi-stage technical onboarding processes.' },
                  { title: 'Tech Strategy', icon: '🎯', stats: 'Growth Path', desc: 'Successfully bridged general support operations into specialized technical engineering roles.' }
                ].map((item, i) => (
                  <div key={i} className="bg-white border-2 border-slate-100 p-10 rounded-[48px] hover:border-brand-teal/20 transition-all group hover:shadow-xl">
                    <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                    <div className="flex items-center justify-between mb-3">
                       <h4 className="text-2xl font-black text-slate-900 tracking-tight">{item.title}</h4>
                       <span className="text-[10px] font-black text-brand-teal bg-brand-teal/5 px-2.5 py-1 rounded uppercase">{item.stats}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Verified Mastery</h3>
              <div className="space-y-8 bg-slate-50/50 p-10 rounded-[48px] border border-slate-100">
                {[
                  { name: 'Advanced SQL & Logic', progress: 92 },
                  { name: 'Financial Modelling', progress: 85 },
                  { name: 'Cross-Team Operations', progress: 98 }
                ].map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-lg font-bold text-slate-800">{skill.name}</span>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{skill.progress}% Verified Mastery</span>
                    </div>
                    <div className="w-full bg-slate-200/50 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-brand-teal h-full rounded-full transition-all duration-1000" style={{ width: `${skill.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-900 text-white p-8 lg:p-10 rounded-[48px] shadow-2xl sticky top-24">
              <h4 className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em] mb-8">Direct Access</h4>
              <p className="text-2xl font-black mb-6 leading-tight">Secure this outcome-verified talent today.</p>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-center space-x-3 text-[11px] font-medium opacity-70">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-neon"></div>
                   <span>Verified via Performance AI</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] font-medium opacity-70">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-neon"></div>
                   <span>Funds secured in Escrow</span>
                </div>
              </div>

              <button className="w-full bg-brand-teal text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-teal/20 hover:scale-[1.02] transition-all">
                Hire Now
              </button>
              <button className="w-full bg-white/5 border border-white/10 text-white mt-3 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                Outcome-CV
              </button>
            </div>
          </div>
        </div>

        <footer className="text-center py-20 mt-12 border-t border-slate-50">
           <div className="flex items-center justify-center space-x-2 text-slate-300">
             <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
               <div className="w-3 h-3 bg-slate-200 rotate-45 rounded-sm"></div>
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">SkillPath Protocol</span>
           </div>
        </footer>
      </div>
    </div>
  );
};
