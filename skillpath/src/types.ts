export type SkillLevel = 'Verified' | 'Growth' | 'Locked';
export type Proficiency = 'Novice' | 'Proficient' | 'Expert';

export interface DetailedSkill {
  name: string;
  level: Proficiency;
  category: string;
}

export interface PortfolioItem {
  id: string;
  workType: string;
  requirementsMet: string;
  imageSeeds: string[];
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  availabilityTimeZone: string;
  country: string;
  bio: string;
  availability: string;
  profileImage?: string;
  resumeUrl?: string;
  skillsLearned: string[];
  pastRoles: string[];
  detailedSkills: DetailedSkill[];
  currentSkills: string[];
  targetRoles: string[];
  readinessScore: number;
  incomeGoal: number;
  tier: 'Standard' | 'Top Talent';
  completedStretchGigs: number;
  pathType: 'Dream Role' | 'Variety';
  role?: 'freelancer' | 'client';
}

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  level: SkillLevel;
  x: number;
  y: number;
  salaryBump?: string;
  readinessScore?: number;
  connections: string[];
}

export interface Gig {
  id: string;
  title: string;
  company: string;
  rate: string;
  comfortRatio: number;
  growthRatio: number;
  comfortSkills: string[];
  stretchSkills: string[];
  description: string;
  escrowVerified: boolean;
  type: 'Stretch' | 'Comfort';
  // Detailed Metadata
  comfortRequirements: string;
  stretchRequirements: string;
  suitabilityReason: string;
  clientName: string;
  clientRating: number;
  deadline: string;
  duration: string;
  fullProjectBrief: string;
  detailedRequirements: string[];
}
