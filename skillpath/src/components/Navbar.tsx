import React from 'react';
import { UserProfile } from '../types';
import { LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  onLogout: () => void;
  user: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onLogout, user }) => {
  const isClient = user.role === 'client';

  return (
    <nav className="bg-brand-teal text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
      <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => onNavigate('dashboard')}>
        <div className="w-10 h-10 bg-brand-neon rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
          <div className="w-5 h-5 bg-brand-teal rotate-45 rounded-sm"></div>
        </div>
        <span className="text-2xl font-bold tracking-tighter">SkillPath</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        {isClient ? (
          <>
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`text-sm font-bold uppercase tracking-widest hover:text-brand-neon transition-colors ${currentView === 'dashboard' ? 'text-brand-neon border-b-2 border-brand-neon' : 'text-white/70'}`}
            >
              Pipeline
            </button>
            <button 
              onClick={() => onNavigate('create-gig')}
              className={`text-sm font-bold uppercase tracking-widest hover:text-brand-neon transition-colors ${currentView === 'create-gig' ? 'text-brand-neon border-b-2 border-brand-neon' : 'text-white/70'}`}
            >
              Post Gig
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`text-sm font-bold uppercase tracking-widest hover:text-brand-neon transition-colors ${currentView === 'dashboard' ? 'text-brand-neon border-b-2 border-brand-neon' : 'text-white/70'}`}
            >
              Skill Map
            </button>
            <button 
              onClick={() => onNavigate('gigs')}
              className={`text-sm font-bold uppercase tracking-widest hover:text-brand-neon transition-colors ${currentView === 'gigs' ? 'text-brand-neon border-b-2 border-brand-neon' : 'text-white/70'}`}
            >
              Stretch Gigs
            </button>
            <button 
              onClick={() => onNavigate('portfolio')}
              className={`text-sm font-bold uppercase tracking-widest hover:text-brand-neon transition-colors ${currentView === 'portfolio' ? 'text-brand-neon border-b-2 border-brand-neon' : 'text-white/70'}`}
            >
              Portfolio
            </button>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
            {isClient ? 'Pro Partner' : 'Current Tier'}
          </p>
          <p className="text-xs font-bold text-brand-neon">
            {isClient ? 'Founders Circle' : 'Standard (15% Fee)'}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/10 border-2 border-white/20 overflow-hidden shadow-inner">
          <img 
            src={`https://picsum.photos/seed/${user.firstName || 'user'}/100/100`} 
            alt="Avatar" 
            referrerPolicy="no-referrer"
          />
        </div>
        <button 
          onClick={onLogout}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};
