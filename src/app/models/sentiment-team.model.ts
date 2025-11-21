
export interface SentimentReport {
  sentimentScore: number;
  sentimentSummary: string;
  communityMetrics?: {
    mentions: number;
    positiveMentions: number;
    negativeMentions: number;
  };
  // Add other sentiment-related fields as needed
}


export interface TeamReport {
  teamName: string;
  teamDescription: string;
  riskIndicators: string[];
  // Add other team-related fields as needed
}

