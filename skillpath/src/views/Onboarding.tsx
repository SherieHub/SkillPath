import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, DetailedSkill, PortfolioItem } from '../types';
import { GoogleGenAI } from "@google/genai";
import { Zap, CheckCircle2, ArrowRight, Plus, X, FileText, Layout, Target, Rocket, Puzzle, Users } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: Partial<UserProfile>) => void;
  initialData?: Partial<UserProfile>;
  startStep?: number;
}

const ROLE_SUGGESTIONS = [
  'Software Engineer', 'Data Analyst', 'Product Designer', 'Creative Director', 
  'Customer Support Specialist', 'Project Manager', 'Virtual Assistant', 
  'Marketing Manager', 'Operations Manager', 'Accountant', 'Sales Representative', 
  'Video Editor', 'Content Strategist', 'Technical Architect'
];

const SKILL_CATALOG = [
  'Python', 'React', 'SQL', 'Figma', 'Adobe Premiere', 'After Effects',
  'Project Coordination', 'Strategic Planning', 'Agile Methodology',
  'Data Visualization', 'SEO Analysis', 'Copywriting', 'Financial Modeling',
  'CRM Management', 'Process Automation'
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialData, startStep = 0 }) => {
  const [step, setStep] = useState(startStep);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    role: initialData?.role || 'freelancer' as 'freelancer' | 'client',
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    availabilityTimeZone: initialData?.availabilityTimeZone || '',
    country: initialData?.country || '',
    bio: initialData?.bio || '',
    availability: initialData?.availability || '',
    profileImage: initialData?.profileImage || `https://picsum.photos/seed/${Math.random()}/200/200`,
    resumeName: '',
    skillsLearned: initialData?.skillsLearned || [] as string[],
    newSkillInput: '',
    pastRoles: initialData?.pastRoles || [] as string[],
    newRoleInput: '',
    portfolios: (initialData as any)?.portfolios || [
      { id: '1', workType: '', requirementsMet: '', imageSeeds: ['art1', 'art2'] },
      { id: '2', workType: '', requirementsMet: '', imageSeeds: ['work1', 'work2'] },
      { id: '3', workType: '', requirementsMet: '', imageSeeds: ['design1', 'design2'] },
    ] as PortfolioItem[],
    pathType: initialData?.pathType || 'Dream Role' as 'Dream Role' | 'Variety',
    selectedRoles: initialData?.targetRoles || [] as string[],
    // Client specific
    companyName: (initialData as any)?.companyName || '',
    industry: (initialData as any)?.industry || '',
    hiringFrequency: (initialData as any)?.hiringFrequency || 'Occasionally',
  });

  const [aiAnalysis, setAiAnalysis] = useState<{
    skills: DetailedSkill[],
    suggestions: {role: string, score: number}[]
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRoleDropdown(false);
        setShowSkillDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdatePortfolio = (id: string, field: keyof PortfolioItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      portfolios: prev.portfolios.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const addPortfolio = () => {
    const newId = (formData.portfolios.length + 1).toString();
    setFormData(prev => ({
      ...prev,
      portfolios: [...prev.portfolios, { id: newId, workType: '', requirementsMet: '', imageSeeds: [`p${newId}_1`] }]
    }));
  };

  const removePortfolio = (id: string) => {
    if (formData.portfolios.length <= 3) return;
    setFormData(prev => ({
      ...prev,
      portfolios: prev.portfolios.filter(p => p.id !== id)
    }));
  };

  const handleSelectRole = (role: string) => {
    setFormData(prev => ({ ...prev, newRoleInput: role }));
    setShowRoleDropdown(false);
  };

  const handleAddPastRole = () => {
    const roleToAdd = formData.newRoleInput.trim();
    if (roleToAdd && !formData.pastRoles.includes(roleToAdd)) {
      setFormData(prev => ({
        ...prev,
        pastRoles: [...prev.pastRoles, roleToAdd],
        newRoleInput: ''
      }));
    }
    setShowRoleDropdown(false);
  };

  const handleSelectSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, newSkillInput: skill }));
    setShowSkillDropdown(false);
  };

  const handleAddSkill = () => {
    const skillToAdd = formData.newSkillInput.trim();
    if (skillToAdd && !formData.skillsLearned.includes(skillToAdd)) {
      setFormData(prev => ({
        ...prev,
        skillsLearned: [...prev.skillsLearned, skillToAdd],
        newSkillInput: ''
      }));
    }
    setShowSkillDropdown(false);
  };

  const analyzeAbilitiesWithAI = async (selectedPath: 'Dream Role' | 'Variety') => {
    setIsAnalyzing(true);
    setFormData(prev => ({ ...prev, pathType: selectedPath }));
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = `
        Analyze this professional profile to identify a career growth trajectory.
        Path Choice: ${selectedPath}
        Current Roles Held: ${formData.pastRoles.join(', ')}
        Skills Noted: ${formData.skillsLearned.join(', ')}
        
        Portfolio Evidence:
        ${formData.portfolios.map((p, i) => `Portfolio ${i+1}: ${p.workType}. Complexity Details: ${p.requirementsMet}`).join('\n')}

        TASK:
        1. Extract specific skills from evidence and assign proficiency levels (Novice, Proficient, Expert).
        2. Based on "${selectedPath}":
           - "Dream Role": Identify vertical climbs (e.g., Support to Ops Manager, Designer to Product Lead).
           - "Variety": Identify high-value horizontal niches (e.g., General Videographer to Luxury Real Estate Videographer).
        3. Assign a Readiness Score (0-100) for each based on evidence complexity.

        Return ONLY a valid JSON object:
        {
          "skills": [{"name": "string", "level": "Novice"|"Proficient"|"Expert", "category": "string"}],
          "suggestions": [{"role": "string", "score": number}]
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || '{}');
      setAiAnalysis(result);
      setStep(3);
    } catch (error) {
      console.error("AI Analysis failed", error);
      // Fallback mock data if AI fails
      setAiAnalysis({
        skills: formData.skillsLearned.map(s => ({ name: s, level: 'Proficient', category: 'General' })),
        suggestions: [{ role: 'Senior Specialist', score: 75 }]
      });
      setStep(3);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinish = () => {
    const averageScore = aiAnalysis?.suggestions.length 
      ? Math.round(aiAnalysis.suggestions.filter(v => formData.selectedRoles.includes(v.role)).reduce((acc, curr) => acc + curr.score, 0) / (formData.selectedRoles.length || 1))
      : 35;

    onComplete({
      ...formData,
      role: formData.role,
      detailedSkills: aiAnalysis?.skills || initialData?.detailedSkills || [],
      currentSkills: (aiAnalysis?.skills || []).map(s => s.name).length > 0 ? (aiAnalysis?.skills || []).map(s => s.name) : (initialData?.currentSkills || []),
      targetRoles: formData.selectedRoles,
      readinessScore: averageScore
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-6">
      <div className="max-w-5xl w-full flex flex-col md:flex-row bg-white rounded-[40px] shadow-[0_32px_120px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden min-h-[700px]">
        
        {/* Sidebar */}
        <div className="md:w-[30%] bg-brand-teal p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none canvas-grid scale-150"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 bg-brand-neon rounded-xl flex items-center justify-center mb-6 rotate-3 shadow-lg">
              <Zap className="text-brand-teal fill-brand-teal" size={20} />
            </div>
            <h2 className="text-3xl font-black leading-tight mb-2 tracking-tighter italic text-white">Skill<span className="text-brand-neon">Path</span></h2>
            <p className="text-[11px] opacity-75 font-medium leading-relaxed">
              SkillPath transforms your existing work history into a verified growth trajectory, bridging the gap between survival freelancing and high-value professional mastery through proof-of-work protocols.
            </p>
          </div>
          
          <div className="space-y-8 relative z-10">
            {[0, 1, 2, 3].map((s) => (
              <div key={s} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step >= s ? 'bg-brand-neon text-brand-teal shadow-xl' : 'border border-white/20 text-white/40'}`}>
                  {s}
                </div>
                <div className="flex flex-col">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${step >= s ? 'text-white' : 'text-white/30'}`}>Protocol Phase {s}</span>
                  <span className={`text-xs font-bold ${step === s ? 'text-white' : 'text-white/30'}`}>
                    {s === 0 ? 'Role Selection' : s === 1 ? 'Identity' : s === 2 ? (formData.role === 'client' ? 'Company Info' : 'Capabilities') : (formData.role === 'client' ? 'Finalize' : 'Growth Path')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="md:w-[70%] p-10 lg:p-14 flex flex-col overflow-y-auto max-h-[85vh] scroll-hide relative">
          
          {step === 0 && (
            <div className="space-y-10 animate-in slide-in-from-bottom duration-500 h-full flex flex-col justify-center">
              <header className="text-center">
                <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Welcome to SkillPath</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">Choose your entry point into the SkillPath ecosystem. Our AI will tailor your experience based on your role.</p>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button 
                  onClick={() => { setFormData({...formData, role: 'freelancer'}); setStep(1); }}
                  className={`group relative p-8 border-4 rounded-[40px] text-left transition-all hover:scale-[1.02] ${formData.role === 'freelancer' ? 'border-brand-teal bg-brand-teal/5' : 'border-slate-100 hover:border-brand-teal/20'}`}
                >
                  <div className="w-16 h-16 bg-brand-teal rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-6 transition-transform">
                    <Users className="text-white" size={32} />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-2">I'm a Freelancer</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Transform your underemployment into a high-value career. Map your skills, bridge the gap, and land growth gigs.
                  </p>
                  <div className="mt-6 flex items-center text-[10px] font-black uppercase tracking-widest text-brand-teal">
                    Start Onboarding <ArrowRight size={14} className="ml-2" />
                  </div>
                </button>

                <button 
                  onClick={() => { setFormData({...formData, role: 'client'}); setStep(1); }}
                  className={`group relative p-8 border-4 rounded-[40px] text-left transition-all hover:scale-[1.02] ${formData.role === 'client' ? 'border-brand-teal bg-brand-teal/5' : 'border-slate-100 hover:border-brand-teal/20'}`}
                >
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:-rotate-6 transition-transform">
                    <Rocket className="text-white" size={32} />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-2">I'm a Client</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Hire vetted talent for growth-oriented projects. Use AI to map requirements and find the perfect match.
                  </p>
                  <div className="mt-6 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-900">
                    Hire Talent <ArrowRight size={14} className="ml-2" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
              <header>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Identity Profile</h3>
                <p className="text-xs text-slate-400 mt-1">Establishing your professional baseline.</p>
              </header>

              <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                <div className="relative shrink-0">
                  <div className="w-32 h-32 rounded-[32px] overflow-hidden border-4 border-slate-50 shadow-md group cursor-pointer">
                    <img src={formData.profileImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-brand-teal text-white p-1.5 rounded-lg shadow-lg">
                    <Plus size={16} />
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">First Name</label>
                    <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl border border-transparent focus:border-brand-neon outline-none font-bold text-sm" placeholder="Juan" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Last Name</label>
                    <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl border border-transparent focus:border-brand-neon outline-none font-bold text-sm" placeholder="Dela Cruz" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Time Zone</label>
                    <input type="text" value={formData.availabilityTimeZone} onChange={e => setFormData({...formData, availabilityTimeZone: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl border border-transparent focus:border-brand-neon outline-none font-bold text-sm" placeholder="GMT+8" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Country</label>
                    <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl border border-transparent focus:border-brand-neon outline-none font-bold text-sm" placeholder="Philippines" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Personal Bio</label>
                  <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl border border-transparent focus:border-brand-neon outline-none font-medium text-xs h-20" placeholder="Who are you outside of your work requirements?" />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Availability</label>
                  <input type="text" value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl border border-transparent focus:border-brand-neon outline-none font-bold text-sm" placeholder="e.g. Weekdays 6pm - 10pm" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && formData.role === 'client' && (
            <div className="space-y-10 animate-in slide-in-from-bottom duration-500">
              <header>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Company Profile</h3>
                <p className="text-xs text-slate-400 mt-1">Tell us about your organization and hiring needs.</p>
              </header>

              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Company Name</label>
                  <input 
                    type="text" 
                    value={formData.companyName} 
                    onChange={e => setFormData({...formData, companyName: e.target.value})} 
                    className="w-full bg-slate-50 p-3 rounded-xl border border-transparent focus:border-brand-neon outline-none font-bold text-sm" 
                    placeholder="e.g. Acme Corp" 
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Industry</label>
                  <select 
                    value={formData.industry} 
                    onChange={e => setFormData({...formData, industry: e.target.value})} 
                    className="w-full bg-slate-50 p-3 rounded-xl border border-transparent focus:border-brand-neon outline-none font-bold text-sm appearance-none"
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Creative Services">Creative Services</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Hiring Frequency</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Occasionally', 'Regularly', 'High Volume'].map(freq => (
                      <button
                        key={freq}
                        onClick={() => setFormData({...formData, hiringFrequency: freq})}
                        className={`p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${formData.hiringFrequency === freq ? 'border-brand-teal bg-brand-teal/5 text-brand-teal' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && formData.role === 'freelancer' && (
            <div className="space-y-10 animate-in slide-in-from-bottom duration-500">
              <header>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Capabilities</h3>
                <p className="text-xs text-slate-400 mt-1">Proof of your skills and history.</p>
              </header>

              <div className="w-full">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Resume Protocol</label>
                <div className="w-full border-2 border-dashed border-slate-100 rounded-3xl p-10 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-brand-neon transition-all cursor-pointer group flex flex-col items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FileText size={20} className="text-brand-teal" />
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{formData.resumeName || 'Click or Drag Resume'}</p>
                  <input type="file" className="hidden" onChange={(e) => setFormData({...formData, resumeName: e.target.files?.[0]?.name || ''})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8" ref={dropdownRef}>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Current / Past Roles</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={formData.newRoleInput} 
                        onChange={e => { setFormData({...formData, newRoleInput: e.target.value}); setShowRoleDropdown(true); }}
                        onFocus={() => setShowRoleDropdown(true)}
                        className="w-full bg-slate-50 p-3 rounded-xl border border-transparent focus:border-brand-neon outline-none font-bold text-sm" 
                        placeholder="e.g. Video Editor"
                      />
                      {showRoleDropdown && formData.newRoleInput && (
                        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-100 max-h-40 overflow-y-auto scroll-hide">
                          {ROLE_SUGGESTIONS.filter(s => s.toLowerCase().includes(formData.newRoleInput.toLowerCase())).map(r => (
                            <button key={r} onClick={() => handleSelectRole(r)} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 border-b border-slate-50 last:border-0">{r}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={handleAddPastRole} className="bg-brand-teal text-white px-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-teal/20 transition-transform active:scale-95">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.pastRoles.map(r => (
                      <span key={r} className="bg-brand-teal text-white px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center">
                        {r} <button onClick={() => setFormData({...formData, pastRoles: formData.pastRoles.filter(role => role !== r)})} className="ml-1.5 opacity-60 hover:opacity-100">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Skills Learned</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={formData.newSkillInput} 
                        onChange={e => { setFormData({...formData, newSkillInput: e.target.value}); setShowSkillDropdown(true); }}
                        onFocus={() => setShowSkillDropdown(true)}
                        className="w-full bg-slate-50 p-3 rounded-xl border border-transparent focus:border-brand-neon outline-none font-bold text-sm" 
                        placeholder="e.g. Adobe Premiere"
                      />
                      {showSkillDropdown && formData.newSkillInput && (
                        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-100 max-h-40 overflow-y-auto scroll-hide">
                          {SKILL_CATALOG.filter(s => s.toLowerCase().includes(formData.newSkillInput.toLowerCase())).map(s => (
                            <button key={s} onClick={() => handleSelectSkill(s)} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 border-b border-slate-50 last:border-0">{s}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={handleAddSkill} className="bg-brand-teal text-white px-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-teal/20 transition-transform active:scale-95">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.skillsLearned.map(s => (
                      <span key={s} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-200 flex items-center">
                        {s} <button onClick={() => setFormData({...formData, skillsLearned: formData.skillsLearned.filter(sk => sk !== s)})} className="ml-1.5 text-slate-400 hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-slate-50">
                <div className="flex items-center justify-between">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portfolio Reference (min 3)</h4>
                   <button onClick={addPortfolio} className="text-[10px] font-black text-brand-teal uppercase tracking-widest bg-brand-neon/20 px-3 py-1 rounded-full hover:bg-brand-neon/40 transition-all">+ Add Project</button>
                </div>
                <div className="space-y-4">
                  {formData.portfolios.map((p, idx) => (
                    <div key={p.id} className="bg-white border border-slate-100 rounded-[24px] p-6 flex flex-col sm:flex-row gap-6 relative group hover:border-brand-neon transition-all shadow-sm">
                      <button onClick={() => removePortfolio(p.id)} className={`absolute top-4 right-4 text-slate-200 hover:text-red-400 transition-colors ${formData.portfolios.length <= 3 ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}>
                        <X size={16} />
                      </button>
                      
                      <div className="grid grid-cols-2 gap-2 w-28 shrink-0">
                        {p.imageSeeds.map((seed, i) => (
                          <div key={i} className="aspect-square bg-slate-50 rounded-lg overflow-hidden border border-slate-100 relative group/img shadow-inner">
                            <img src={`https://picsum.photos/seed/${seed}/200/200`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                        <button 
                          onClick={() => handleUpdatePortfolio(p.id, 'imageSeeds', [...p.imageSeeds, `new_${Math.random()}`].slice(0, 4))}
                          className="aspect-square rounded-lg border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300 hover:border-brand-neon hover:text-brand-teal transition-all text-xs font-black"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex-1 space-y-3">
                        <input 
                          type="text" 
                          placeholder="Project Type (e.g. Wedding Highlight Film)" 
                          value={p.workType} 
                          onChange={e => handleUpdatePortfolio(p.id, 'workType', e.target.value)}
                          className="w-full bg-slate-50 p-3 rounded-xl text-xs font-black outline-none border border-transparent focus:border-brand-neon"
                        />
                        <textarea 
                          placeholder="Identify specific complexity achieved. What requirements were met?" 
                          value={p.requirementsMet}
                          onChange={e => handleUpdatePortfolio(p.id, 'requirementsMet', e.target.value)}
                          className="w-full bg-slate-50 p-3 rounded-xl text-[11px] font-medium outline-none border border-transparent focus:border-brand-neon h-16"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in slide-in-from-bottom duration-500 h-full flex flex-col">
              <header>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Growth Strategy</h3>
                <p className="text-xs text-slate-400 mt-1">Select your trajectory. AI will synthesize your verified potential.</p>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <button 
                  onClick={() => analyzeAbilitiesWithAI('Dream Role')}
                  className={`relative p-6 border-2 rounded-[32px] text-left transition-all ${formData.pathType === 'Dream Role' && aiAnalysis ? 'border-brand-teal bg-brand-teal/5 ring-4 ring-brand-teal/10' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <div className="text-2xl mb-3">
                    <Rocket className="text-brand-teal" />
                  </div>
                  <h4 className="text-base font-black text-slate-900 mb-2">Dream Role</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    Ascend vertically. Transition from a specialist to a strategist or pivot into a higher-tier management or engineering domain. We map the technical bridge to get you there.
                  </p>
                  {formData.pathType === 'Dream Role' && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-teal"></div>}
                </button>

                <button 
                  onClick={() => analyzeAbilitiesWithAI('Variety')}
                  className={`relative p-6 border-2 rounded-[32px] text-left transition-all ${formData.pathType === 'Variety' && aiAnalysis ? 'border-brand-neon bg-brand-neon/5 ring-4 ring-brand-neon/10' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <div className="text-2xl mb-3">
                    <Puzzle className="text-brand-teal" />
                  </div>
                  <h4 className="text-base font-black text-slate-900 mb-2">Variety Scaling</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    Scale horizontally. Master high-value niches within your current craft. Transition from a generalist to an industry-specific expert with a premium rate floor.
                  </p>
                  {formData.pathType === 'Variety' && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-neon"></div>}
                </button>
              </div>

              {aiAnalysis && (
                <div className="space-y-8 animate-in fade-in duration-700 flex-1 flex flex-col">
                  <div className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100">
                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">AI Talent Diagnosis</h5>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.skills.map(s => (
                        <div key={s.name} className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                          <span className="text-[11px] font-black text-slate-800 block">{s.name}</span>
                          <span className={`text-[8px] font-black uppercase tracking-widest ${s.level === 'Expert' ? 'text-brand-teal' : s.level === 'Proficient' ? 'text-brand-teal/70' : 'text-slate-400'}`}>{s.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Growth Trajectory Options</h5>
                    <div className="grid grid-cols-1 gap-3">
                      {aiAnalysis.suggestions.map((item, idx) => {
                        const isSelected = formData.selectedRoles.includes(item.role);
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                selectedRoles: isSelected ? prev.selectedRoles.filter(r => r !== item.role) : [...prev.selectedRoles, item.role]
                              }));
                            }}
                            className={`group w-full p-5 rounded-[24px] border-2 flex items-center justify-between transition-all text-left ${isSelected ? 'bg-brand-teal border-brand-teal text-white shadow-xl translate-x-1' : 'bg-white border-slate-100 hover:border-brand-teal/30 text-slate-800'}`}
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-brand-neon/20' : 'bg-slate-50'}`}>
                                {isSelected ? '✅' : '🎯'}
                              </div>
                              <div>
                                <span className="text-sm font-black block tracking-tight">{item.role}</span>
                                <div className="flex items-center space-x-2 mt-1">
                                   <div className="w-20 h-1 bg-black/10 rounded-full overflow-hidden">
                                      <div className={`h-full transition-all duration-1000 ${isSelected ? 'bg-brand-neon' : 'bg-brand-teal'}`} style={{ width: `${item.score}%` }}></div>
                                   </div>
                                   <span className={`text-[9px] font-bold ${isSelected ? 'text-brand-neon' : 'opacity-60'}`}>{item.score}% Readiness</span>
                                </div>
                              </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${isSelected ? 'bg-white text-brand-teal' : 'bg-slate-50 text-slate-400 group-hover:bg-brand-teal group-hover:text-white'}`}>
                              {isSelected ? 'Selected' : 'Pick Path'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100 mt-auto flex gap-4">
                    <button 
                      onClick={() => setStep(2)}
                      className="px-10 py-6 rounded-[32px] font-black uppercase tracking-widest text-[11px] border-2 border-slate-100 text-slate-400 hover:bg-slate-50 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleFinish}
                      disabled={formData.selectedRoles.length === 0}
                      className="flex-1 bg-slate-900 hover:bg-black text-white py-6 rounded-[32px] font-black uppercase tracking-widest text-[11px] transition-all shadow-2xl disabled:opacity-30 disabled:grayscale active:scale-95"
                    >
                      Finalize Growth Map
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Footer */}
          {(!aiAnalysis || step < 3) && (
            <div className="mt-auto pt-8 border-t border-slate-100 flex justify-end items-center space-x-4">
              {step > 1 && (
                 <button onClick={() => setStep(step - 1)} className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-600 transition-colors">
                   Back
                 </button>
              )}
              <button 
                onClick={step === 1 ? () => setStep(2) : step === 2 ? (formData.role === 'client' ? handleFinish : () => setStep(3)) : handleFinish}
                disabled={isAnalyzing || (step === 1 && (!formData.firstName || !formData.lastName)) || (step === 2 && formData.role === 'freelancer' && formData.portfolios.length < 3) || (step === 2 && formData.role === 'client' && !formData.companyName)}
                className="bg-brand-teal hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-brand-teal/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Mapping...
                  </>
                ) : 'Next Phase'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
