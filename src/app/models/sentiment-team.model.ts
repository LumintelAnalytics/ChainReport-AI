
export interface SentimentReport {
  overallScore: SentimentScore;
  communityBreakdown: CommunityBreakdown;
  // Add other sentiment-related fields as needed
}

export interface SentimentScore {
  value: number;
  label: string; // e.g., 'Positive', 'Negative', 'Neutral'
}

export interface CommunityBreakdown {
  twitter: SentimentScore;
  telegram: SentimentScore;
  discord: SentimentScore;
  // Add other community platforms as needed
}

export interface TeamReport {
  teamMembers: TeamMember[];
  riskIndicators: RiskIndicators;
  // Add other team-related fields as needed
}

export interface TeamMember {
  name: string;
  role: string;
  experience: string;
  // Add other team member details
}

export interface RiskIndicators {
  anonTeam: boolean;
  rugPullRisk: number; // e.g., a score from 0-100
  codeAuditStatus: string; // e.g., 'Audited', 'Not Audited', 'In Progress'
  // Add other risk factors
}
