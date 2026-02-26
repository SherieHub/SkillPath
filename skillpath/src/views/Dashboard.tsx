import React, { useState, useMemo, useRef } from 'react';
import { UserProfile, SkillNode } from '../types';
import { Zap, Target, TrendingUp, ArrowRight } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (view: any, startStep?: number) => void;
}

interface SkillGap {
  name: string;
  explanation: string;
  direction: string;
  topics: string[];
}

const GAP_LIBRARY: Record<string, SkillGap> = {
  'System Design': {
    name: 'System Design',
    explanation: 'The ability to architect scalable, reliable, and maintainable software infrastructures.',
    direction: 'Focus on distributed systems theory and practical high-level architecture patterns.',
    topics: ['Microservices', 'Load Balancing', 'Database Sharding', 'CAP Theorem']
  },
  'Technical Strategy': {
    name: 'Technical Strategy',
    explanation: 'Aligning engineering decisions with long-term business goals and ROI analysis.',
    direction: 'Learn to evaluate tech stacks against business constraints and lead roadmap planning.',
    topics: ['Build vs Buy Analysis', 'Tech Debt Management', 'Resource Allocation', 'RFC Creation']
  },
  'MLOps': {
    name: 'MLOps',
    explanation: 'Applying DevOps principles to automate and scale the machine learning lifecycle.',
    direction: 'Study pipeline automation and model monitoring frameworks.',
    topics: ['MLflow', 'Kubeflow', 'CI/CD for ML', 'Feature Stores']
  },
  'User Research': {
    name: 'User Research',
    explanation: 'Systematic study of target users to add realistic context to design processes.',
    direction: 'Practice conducting usability tests and synthesizing quantitative/qualitative data.',
    topics: ['Ethnographic Studies', 'A/B Testing', 'Heatmap Analysis', 'Persona Validation']
  },
  'Strategic Scaling': {
    name: 'Strategic Scaling',
    explanation: 'The science of growing operational capacity without losing efficiency or quality.',
    direction: 'Explore change management frameworks and operational bottleneck analysis.',
    topics: ['Unit Economics', 'Operational Rigor', 'LTV/CAC Analysis', 'FTE Modeling']
  }
};

const POTENTIAL_GAPS_BY_ROLE: Record<string, string[]> = {
  'Software Engineer': ['System Design', 'Technical Strategy'],
  'Data Scientist': ['MLOps', 'Technical Strategy'],
  'Product Designer': ['User Research', 'Technical Strategy'],
  'ML Engineer': ['MLOps', 'System Design'],
  'Operations Manager': ['Strategic Scaling', 'Technical Strategy']
};

const generateDynamicGraph = (user: UserProfile): SkillNode[] => {
  const nodes: SkillNode[] = [];
  const startY = 500;
  const roleKey = user.targetRoles[0] || 'Software Engineer';
  
  nodes.push({
    id: 'node-current-role',
    name: user.pastRoles[0] || 'Base Level',
    category: 'Verified History',
    level: 'Verified',
    x: 100,
    y: startY,
    connections: []
  });

  const verifiedSkills = user.detailedSkills.filter(s => s.level === 'Expert');
  const growthSkills = user.detailedSkills.filter(s => s.level !== 'Expert');
  
  const allCurrentSkills = [...verifiedSkills, ...growthSkills];
  allCurrentSkills.forEach((skill, i) => {
    const isExpert = skill.level === 'Expert';
    nodes.push({
      id: `node-skill-current-${i}`,
      name: skill.name,
      category: 'Current Skill',
      level: isExpert ? 'Verified' : 'Growth',
      x: 350,
      y: startY + (i * 120 - (allCurrentSkills.length - 1) * 60),
      readinessScore: isExpert ? 100 : 65,
      connections: []
    });
    nodes[0].connections.push(`node-skill-current-${i}`);
  });

  const currentSkillNames = user.detailedSkills.map(s => s.name.toLowerCase());
  const gaps = (POTENTIAL_GAPS_BY_ROLE[roleKey] || ['Technical Strategy', 'Lead Experience'])
    .filter(g => !currentSkillNames.includes(g.toLowerCase()));

  gaps.forEach((gapName, i) => {
    nodes.push({
      id: `node-skill-gap-${i}`,
      name: gapName,
      category: 'Needed Mastery',
      level: 'Locked',
      x: 650,
      y: startY + (i * 150 - (gaps.length - 1) * 75),
      connections: [`node-target-role`]
    });
    
    let hasGrowthConnection = false;
    nodes.forEach(n => {
      if (n.level === 'Growth') {
        n.connections.push(`node-skill-gap-${i}`);
        hasGrowthConnection = true;
      }
    });
    
    // Fallback: connect base role directly to gaps if no intermediate growth skills exist
    if (!hasGrowthConnection && nodes[0]) {
      nodes[0].connections.push(`node-skill-gap-${i}`);
    }
  });

  nodes.push({
    id: 'node-target-role',
    name: roleKey,
    category: user.pathType,
    level: 'Locked',
    x: 900,
    y: startY,
    connections: [],
    salaryBump: user.pathType === 'Dream Role' ? '+85%' : '+45%'
  });

  return nodes;
};

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [activeGap, setActiveGap] = useState<string | null>(null);
  const [viewOffset, setViewOffset] = useState({ x: 50, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(0.85);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const graphNodes = useMemo(() => generateDynamicGraph(user), [user]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedNode) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - viewOffset.x, y: e.clientY - viewOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setViewOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(Math.max(0.4, prev + delta), 2.0));
  };

  const getPathColor = (level: string) => {
    if (level === 'Verified') return '#0D7A5F'; 
    if (level === 'Growth') return '#B2FF05'; 
    return 'greenyellow'; 
  };

  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  const skillGaps = useMemo<SkillGap[]>(() => {
    const current = user.detailedSkills.map(s => s.name.toLowerCase());
    const roleKey = user.targetRoles[0] || 'Software Engineer';
    const targetGaps = POTENTIAL_GAPS_BY_ROLE[roleKey] || ['Technical Strategy', 'System Design'];
    
    return targetGaps
      .filter(g => !current.includes(g.toLowerCase()))
      .map(g => GAP_LIBRARY[g] || {
        name: g,
        explanation: 'Advanced domain mastery required for seniority.',
        direction: 'Engage in complex project leadership and architectural decision-making.',
        topics: ['Advanced Logic', 'Niche Frameworks', 'Lead Protocols']
      });
  }, [user.targetRoles, user.detailedSkills]);

  return (
    <div className="h-full w-full flex flex-col md:flex-row bg-white overflow-hidden animate-in fade-in duration-500">
      <div className="w-full md:w-64 lg:w-72 border-r border-slate-50 p-6 lg:p-8 flex flex-col gap-6 bg-white shrink-0 z-30 shadow-sm overflow-hidden md:sticky md:top-0">
        <div className="shrink-0">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Path Readiness Index</h4>
          <div className="relative w-28 h-28 mx-auto">
            <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 144 144">
              <circle cx="72" cy="72" r={radius} stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
              <circle 
                cx="72" cy="72" r={radius} 
                stroke="#0D7A5F" strokeWidth="10" fill="transparent" 
                strokeDasharray={circumference} 
                strokeDashoffset={circumference * (1 - user.readinessScore / 100)} 
                strokeLinecap="round" 
                className="transition-all duration-1000 ease-out" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-black text-slate-900">{user.readinessScore}%</span>
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Aggregate</span>
            </div>
          </div>
          <p className="text-[9px] text-slate-400 mt-4 text-center font-black uppercase tracking-widest">
            Trajectory: <span className="text-brand-teal truncate block max-w-full">{user.targetRoles[0] || 'Unmapped'}</span>
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 space-y-3">
          <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol Intelligence</h5>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
             High affinity for <strong>{user.targetRoles[0]}</strong>. AI mapped bridge skills to your {user.pathType.toLowerCase()} goal.
          </p>
          <div className="space-y-2">
            <button 
              onClick={() => onNavigate('gigs')}
              className="w-full bg-brand-teal text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-brand-teal/10"
            >
              Bridge the Gap
            </button>
            <button 
              onClick={() => onNavigate('onboarding', 2)}
              className="w-full bg-white border border-brand-teal text-brand-teal py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-neon/10 transition-all"
            >
              Update Path
            </button>
          </div>
        </div>

        <div className="mt-auto space-y-2 pt-4 border-t border-slate-50">
           <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
             <span>Path Progress</span>
             <span>Phase 1/3</span>
           </div>
           <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
             <div className="bg-brand-teal h-full rounded-full" style={{ width: `${user.readinessScore}%` }}></div>
           </div>
        </div>
      </div>

      <div className="flex-1 relative flex flex-col bg-slate-50/20 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto scroll-hide">
          <div className="p-6 lg:p-10 shrink-0">
            <header className="mb-6 px-2 flex justify-between items-end shrink-0">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Growth<span className="text-brand-teal">Canvas</span></h1>
                <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest opacity-60">Verified Trajectory: {user.pastRoles[0] || 'Base'} → {user.targetRoles[0] || 'Unmapped'}</p>
              </div>
              <div className="hidden sm:flex space-x-2">
                <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-brand-teal"></div>
                  <span className="text-[8px] font-black text-slate-500 uppercase">Verified</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-brand-neon"></div>
                  <span className="text-[8px] font-black text-slate-500 uppercase">Acquiring</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm opacity-50">
                  <div className="w-2 h-2 rounded-full bg-slate-200 border border-slate-300"></div>
                  <span className="text-[8px] font-black text-slate-500 uppercase">Needed</span>
                </div>
              </div>
            </header>

            <div 
              className="relative h-[600px] bg-white canvas-grid rounded-[48px] border-4 border-slate-100 shadow-[inset_0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <svg 
                ref={svgRef}
                width="100%" 
                height="100%" 
                className="touch-none select-none" 
                viewBox="0 0 1000 1000"
              >
                <defs>
                  <style>{`
                    @keyframes pulse-ring {
                      0% { transform: scale(0.95); opacity: 0.8; }
                      50% { transform: scale(1.05); opacity: 0.4; }
                      100% { transform: scale(0.95); opacity: 0.8; }
                    }
                    .animate-pulse-ring {
                      animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                      transform-origin: center;
                    }
                  `}</style>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="0" dy="4" result="offsetblur" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.2" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="grad-verified" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#0D7A5F', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#064E3B', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="grad-growth" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#B2FF05', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#84CC16', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="grad-growth-light" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#D4FF5C', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#B2FF05', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="grad-locked" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'greenyellow', stopOpacity: 0.2 }} />
                    <stop offset="100%" style={{ stopColor: 'greenyellow', stopOpacity: 0.1 }} />
                  </linearGradient>
                  <linearGradient id="grad-target" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#F8FAFC', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#E2E8F0', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <g transform={`translate(${viewOffset.x}, ${viewOffset.y}) scale(${zoomLevel})`}>
                  {graphNodes.map(node => 
                    node.connections.map(targetId => {
                      const target = graphNodes.find(n => n.id === targetId);
                      if (!target) return null;
                      return (
                        <path 
                          key={`${node.id}-${targetId}`}
                          d={`M ${node.x} ${node.y} C ${node.x + 100} ${node.y}, ${target.x - 100} ${target.y}, ${target.x} ${target.y}`}
                          fill="none"
                          stroke={getPathColor(node.level)}
                          strokeWidth={node.level === 'Locked' ? 3 : 4}
                          strokeDasharray={node.level === 'Locked' ? "8,4" : "none"}
                          opacity={node.level === 'Locked' ? 0.7 : 0.8}
                          className="transition-all duration-500"
                        />
                      );
                    })
                  )}

                  {graphNodes.map((node, idx) => (
                    <g 
                      key={node.id} 
                      className="cursor-pointer group" 
                      onClick={(e) => { e.stopPropagation(); setSelectedNode(node); }}
                      filter="url(#shadow)"
                    >
                      {node.level === 'Verified' ? (
                        <g>
                          <circle cx={node.x} cy={node.y} r="46" fill="transparent" stroke="#0D7A5F" strokeWidth="1" opacity="0.3" />
                          <circle cx={node.x} cy={node.y} r="42" fill="url(#grad-verified)" stroke="#FFFFFF" strokeWidth="2" className="transition-all duration-300 group-hover:r-45" />
                        </g>
                      ) : node.level === 'Growth' ? (
                        <g>
                          <circle cx={node.x} cy={node.y} r="52" fill="transparent" stroke={idx === 1 || idx === 2 ? '#D4FF5C' : '#B2FF05'} strokeWidth="1" opacity="0.3" className="animate-pulse-ring" style={{ transformOrigin: `${node.x}px ${node.y}px` }} />
                          <circle cx={node.x} cy={node.y} r="48" fill="transparent" stroke={idx === 1 || idx === 2 ? '#D4FF5C' : '#B2FF05'} strokeWidth="2" strokeDasharray="4,2" className="animate-spin-slow" style={{ animationDuration: '10s', transformOrigin: `${node.x}px ${node.y}px` }} />
                          <circle cx={node.x} cy={node.y} r="40" fill={idx === 1 || idx === 2 ? 'url(#grad-growth-light)' : 'url(#grad-growth)'} stroke="#0D7A5F" strokeWidth="2" className="transition-all duration-300 group-hover:r-43" />
                        </g>
                      ) : (
                        <g>
                          <circle 
                            cx={node.x} 
                            cy={node.y} 
                            r="38" 
                            fill={node.id === 'node-target-role' ? 'url(#grad-target)' : "url(#grad-locked)"} 
                            stroke={node.id === 'node-target-role' ? '#94A3B8' : "greenyellow"} 
                            strokeWidth={node.id === 'node-target-role' ? 3 : 2} 
                            strokeDasharray="5,3" 
                            className="transition-all duration-300 group-hover:stroke-slate-400" 
                          />
                          <circle 
                            cx={node.x} 
                            cy={node.y} 
                            r={node.id === 'node-target-role' ? 32 : 30} 
                            fill={node.id === 'node-target-role' ? '#94A3B8' : "greenyellow"} 
                            opacity="0.1" 
                          />
                        </g>
                      )}
                      
                      <foreignObject x={node.x - 80} y={node.y + 55} width="160" height="60" className="pointer-events-none">
                        <div className="text-center flex flex-col items-center">
                          <span className={`text-[11px] font-black uppercase tracking-tighter leading-none px-2 py-1 rounded-md shadow-sm border transition-colors ${node.level === 'Locked' ? 'text-slate-400 bg-slate-50 border-slate-100' : 'text-slate-800 bg-white border-slate-50'}`}>
                            {node.name}
                          </span>
                          {node.readinessScore !== undefined && (
                            <div className="w-12 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                              <div className="bg-brand-teal h-full" style={{ width: `${node.readinessScore}%` }}></div>
                            </div>
                          )}
                        </div>
                      </foreignObject>
                      
                      {node.salaryBump && (
                        <g transform={`translate(${node.x + 30}, ${node.y - 60})`}>
                          <rect width="50" height="20" rx="10" fill="#0D7A5F" />
                          <text x="25" y="14" textAnchor="middle" className="text-[10px] font-black fill-white">{node.salaryBump}</text>
                        </g>
                      )}
                    </g>
                  ))}
                </g>
              </svg>

              <div className="absolute bottom-8 right-8 flex flex-col space-y-3">
                 <button onClick={() => handleZoom(0.1)} className="w-10 h-10 bg-white shadow-xl rounded-full border border-slate-100 font-black text-lg hover:bg-slate-50">+</button>
                 <button onClick={() => handleZoom(-0.1)} className="w-10 h-10 bg-white shadow-xl rounded-full border border-slate-100 font-black text-lg hover:bg-slate-50">−</button>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-10 lg:pt-0 pb-20">
            <div className="bg-white rounded-[48px] border-4 border-slate-100 p-10 lg:p-14 shadow-xl shadow-slate-100/50">
              <header className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center space-x-2 bg-brand-neon/10 text-brand-teal px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-brand-neon/20">
                    <span className="animate-pulse">●</span> AI Prediction Engine Active
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-4 italic">
                    AI-Driven Readiness & <span className="text-brand-teal underline decoration-brand-neon decoration-4 underline-offset-4">Prediction Analysis</span>
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed font-bold">
                    SkillPath’s AI engine evaluates your work history and client feedback to predict your next career move, identifying precise skill gaps and providing actionable learning paths to accelerate your transition to high-value roles.
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[40px] border border-slate-100 shadow-inner min-w-[160px]">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Confidence Level</div>
                   <div className="text-4xl font-black text-brand-teal italic">94.2%</div>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10 border-t border-slate-100">
                <div className="space-y-4 lg:col-span-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center mb-6">
                    <span className="w-5 h-5 rounded-lg bg-red-50 text-red-500 flex items-center justify-center mr-2 font-black">!</span> Career Gap Analysis
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {skillGaps.map((gap, i) => (
                      <div 
                        key={i} 
                        onClick={() => setActiveGap(activeGap === gap.name ? null : gap.name)}
                        className={`p-6 bg-white border-2 rounded-[32px] cursor-pointer transition-all ${activeGap === gap.name ? 'border-red-400 shadow-lg shadow-red-50 scale-[1.02]' : 'border-slate-100 hover:border-red-100 hover:bg-slate-50/30'}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-black text-slate-900 tracking-tight">{gap.name}</span>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${activeGap === gap.name ? 'bg-red-400 text-white' : 'bg-red-50 text-red-400'}`}>
                            {activeGap === gap.name ? 'Collapse' : 'Explain Gap'}
                          </span>
                        </div>
                        
                        {activeGap === gap.name ? (
                          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">What is this?</p>
                              <p className="text-[11px] font-medium text-slate-600 leading-relaxed">{gap.explanation}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Learning Direction</p>
                              <p className="text-[11px] font-bold text-slate-700 leading-relaxed">{gap.direction}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Example Topics to Master</p>
                              <div className="flex flex-wrap gap-1.5">
                                {gap.topics.map(topic => (
                                  <span key={topic} className="px-2 py-0.5 bg-slate-100 text-[9px] font-black text-slate-500 rounded-md border border-slate-200">{topic}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 font-medium line-clamp-1 italic">{gap.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-10">
                  <section>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center mb-6">
                      <span className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center mr-2 font-black">✓</span> Verified Mastery
                    </h4>
                    <div className="space-y-3">
                      {user.detailedSkills.filter(s => s.level === 'Expert').slice(0, 3).map((skill, i) => (
                        <div key={i} className="flex items-center space-x-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-emerald-200 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="text-xs font-bold text-slate-700">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center mb-6">
                      <span className="w-5 h-5 rounded-lg bg-brand-neon text-brand-teal flex items-center justify-center mr-2 font-black">🎯</span> Prediction Vector
                    </h4>
                    <div className="bg-brand-teal text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-neon/20 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                      <p className="text-[9px] font-black opacity-60 uppercase tracking-widest mb-1">Recommended Next Role</p>
                      <h5 className="text-xl font-black tracking-tight mb-6">{user.targetRoles[0] || 'Unmapped'}</h5>
                      <button 
                        onClick={() => onNavigate('gigs')}
                        className="w-full bg-brand-neon text-brand-teal py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all transform group-hover:-translate-y-1 shadow-xl shadow-black/10"
                      >
                        Explore Aligned Gigs
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedNode && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-white rounded-[40px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] p-10 border border-slate-100 animate-in fade-in zoom-in duration-300 z-50">
             <button onClick={() => setSelectedNode(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
             <div className="flex items-center space-x-2 mb-3">
               <span className={`w-2 h-2 rounded-full ${getPathColor(selectedNode.level)}`}></span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedNode.category} Node</span>
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">{selectedNode.name}</h3>
             <p className="text-xs text-slate-500 mb-8 leading-relaxed font-medium">
               This node represents a critical component of your growth trajectory. {selectedNode.level === 'Verified' ? 'Mastery confirmed via portfolio evidence.' : selectedNode.level === 'Growth' ? 'Active skill acquisition through missions.' : 'Bridging skill needed for your next level.'}
             </p>
             <div className="space-y-3">
               <button onClick={() => onNavigate('gigs')} className="w-full bg-brand-teal text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-[1.02] transition-all">
                 Find Bridge Missions
               </button>
               <button onClick={() => setSelectedNode(null)} className="w-full bg-slate-50 text-slate-400 py-3 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-slate-100">
                 Dismiss
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
