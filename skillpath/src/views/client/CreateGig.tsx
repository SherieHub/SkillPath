import React, { useState } from 'react';
import { Zap, DollarSign, CheckCircle2 } from 'lucide-react';

export const CreateGigView = ({ onCancel }: { onCancel: () => void }) => {
  const [step, setStep] = useState(1);
  const [requirements, setRequirements] = useState('');

  return (
    <div className="max-w-3xl mx-auto py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-brand-teal p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-neon/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight">Post a Growth Gig</h2>
            <p className="text-white/70 mt-2">Our AI will map your requirements into Comfort and Stretch zones.</p>
          </div>
          
          <div className="flex gap-2 mt-8">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-brand-neon' : 'bg-white/20'}`} 
              />
            ))}
          </div>
        </div>

        <div className="p-10 space-y-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Gig Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Operations Assistant"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-teal transition-all text-lg font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Hourly Rate (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="number" 
                      placeholder="15"
                      className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-teal transition-all text-lg font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Estimated Hours/Week</label>
                  <input 
                    type="number" 
                    placeholder="40"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-teal transition-all text-lg font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Job Description & Requirements</label>
                <textarea 
                  rows={6}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Describe the role and the specific skills needed. Our AI will automatically identify growth opportunities..."
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-teal transition-all text-lg font-medium resize-none"
                />
              </div>

              {requirements.length > 20 && (
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="text-brand-teal fill-brand-teal" size={18} />
                    <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">AI Skill Mapper (Real-time)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">80% Comfort Zone (Mastery)</p>
                      <div className="flex flex-wrap gap-2">
                        {['CRM Management', 'Email Marketing', 'Lead Gen'].map(s => (
                          <span key={s} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-brand-neon/5 p-4 rounded-2xl border border-brand-neon/20">
                      <p className="text-[10px] font-bold text-brand-teal uppercase tracking-widest mb-2">20% Stretch Zone (Growth)</p>
                      <div className="flex flex-wrap gap-2">
                        {['Advanced Automation', 'Data Analytics'].map(s => (
                          <span key={s} className="px-3 py-1 bg-brand-neon text-brand-teal rounded-full text-xs font-bold">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in-95">
              <div className="w-24 h-24 bg-brand-neon rounded-full flex items-center justify-center mx-auto shadow-lg shadow-brand-neon/20">
                <CheckCircle2 size={48} className="text-brand-teal" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900">Ready to Launch?</h3>
                <p className="text-slate-500 mt-2 max-w-sm mx-auto">Your growth gig is mapped and ready to be matched with top-tier Filipino talent.</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button 
              onClick={step === 1 ? onCancel : () => setStep(s => s - 1)}
              className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button 
              onClick={step === 3 ? onCancel : () => setStep(s => s + 1)}
              className="bg-brand-teal text-white px-10 py-4 rounded-2xl font-bold hover:bg-brand-teal/90 transition-all shadow-lg shadow-brand-teal/20 active:scale-95"
            >
              {step === 3 ? 'Publish Gig' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
