import React, { useState, useEffect } from 'react';
import { Onboarding } from './views/Onboarding';
import { Dashboard as FreelancerDashboard } from './views/Dashboard';
import { GigFeed } from './views/GigFeed';
import { Portfolio } from './views/Portfolio';
import { ClientDashboard } from './views/client/Dashboard';
import { CreateGigView } from './views/client/CreateGig';
import { TalentProfileView } from './views/client/TalentProfile';
import { Navbar } from './components/Navbar';
import { UserProfile } from './types';
import { AnimatePresence, motion } from 'motion/react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('onboarding');
  const [onboardingStartStep, setOnboardingStartStep] = useState<number>(0);
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('skillpath_user');
    return saved ? JSON.parse(saved) : {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      availabilityTimeZone: '',
      country: '',
      bio: '',
      availability: '',
      skillsLearned: [],
      pastRoles: [],
      detailedSkills: [],
      currentSkills: [],
      targetRoles: [],
      readinessScore: 0,
      incomeGoal: 0,
      tier: 'Standard',
      completedStretchGigs: 0,
      pathType: 'Dream Role',
      role: undefined
    };
  });

  useEffect(() => {
    if (user.role && currentView === 'onboarding') {
      setCurrentView('dashboard');
    }
  }, [user.role, currentView]);

  useEffect(() => {
    if (user.role) {
      localStorage.setItem('skillpath_user', JSON.stringify(user));
    }
  }, [user]);

  const handleOnboardingComplete = (data: Partial<UserProfile>) => {
    const updatedUser = { ...user, ...data } as UserProfile;
    setUser(updatedUser);
    setCurrentView('dashboard');
  };

  const handleNavigate = (view: string, startStep?: number) => {
    if (startStep !== undefined) {
      setOnboardingStartStep(startStep);
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('skillpath_user');
    setUser({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      availabilityTimeZone: '',
      country: '',
      bio: '',
      availability: '',
      skillsLearned: [],
      pastRoles: [],
      detailedSkills: [],
      currentSkills: [],
      targetRoles: [],
      readinessScore: 0,
      incomeGoal: 0,
      tier: 'Standard',
      completedStretchGigs: 0,
      pathType: 'Dream Role',
      role: undefined
    });
    setCurrentView('onboarding');
    setOnboardingStartStep(0);
  };

  const renderView = () => {
    if (currentView === 'onboarding') {
      return <Onboarding onComplete={handleOnboardingComplete} initialData={user} startStep={onboardingStartStep} />;
    }

    if (user.role === 'client') {
      switch (currentView) {
        case 'dashboard':
          return <ClientDashboard onSelectGig={() => setCurrentView('talent-profile')} onCreateGig={() => setCurrentView('create-gig')} />;
        case 'create-gig':
          return <CreateGigView onCancel={() => setCurrentView('dashboard')} />;
        case 'talent-profile':
          return <TalentProfileView onBack={() => setCurrentView('dashboard')} />;
        default:
          return <ClientDashboard onSelectGig={() => setCurrentView('talent-profile')} onCreateGig={() => setCurrentView('create-gig')} />;
      }
    }

    // Freelancer Views
    switch (currentView) {
      case 'dashboard':
        return <FreelancerDashboard user={user} onNavigate={handleNavigate} />;
      case 'gigs':
        return <GigFeed user={user} onNavigate={handleNavigate} />;
      case 'portfolio':
        return <Portfolio user={user} onNavigate={handleNavigate} />;
      default:
        return <FreelancerDashboard user={user} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-neon selection:text-brand-teal flex flex-col">
      {currentView !== 'onboarding' && (
        <Navbar currentView={currentView} onNavigate={handleNavigate} onLogout={handleLogout} user={user} />
      )}
      
      <main className={`flex-grow ${currentView === 'onboarding' ? '' : (currentView === 'dashboard' && user.role !== 'client') ? 'h-[calc(100vh-64px)] overflow-hidden' : 'max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-20'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {currentView !== 'onboarding' && (currentView !== 'dashboard' || user.role === 'client') && (
        <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-brand-neon rotate-45 rounded-sm"></div>
              </div>
              <span className="text-xl font-bold tracking-tighter text-slate-900">SkillPath</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              © 2025 SkillPath Protocol. AI-Powered Career Engine for the Next Billion Professionals.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-brand-teal transition-colors text-sm font-bold uppercase tracking-widest">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-brand-teal transition-colors text-sm font-bold uppercase tracking-widest">Terms</a>
              <a href="#" className="text-slate-400 hover:text-brand-teal transition-colors text-sm font-bold uppercase tracking-widest">Support</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
