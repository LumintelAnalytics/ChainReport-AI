import { TokenomicsReport } from './tokenomics.model';
import { SentimentTeamReport } from './sentiment-team.model';

export interface GenerateReportResponse {
  reportId: string;
}

export interface ReportStatusResponse {
  status: string;
  errorMessage?: string;
  progressMessage?: string;
}

export interface OnchainMetricsReport {
  // Define structure for onchain metrics
  // For now, using a placeholder structure
  summary: string;
  keyMetrics: {
    metric1: number;
    metric2: number;
  };
}

export interface CodeReviewReport {
  // Define structure for code review
  summary: string;
  findings: any[];
}

export interface AuditReviewReport {
  // Define structure for audit review
  summary: string;
  auditFindings: any[];
}

export interface WhitepaperReviewReport {
  // Define structure for whitepaper review
  summary: string;
  analysis: string;
}

export interface FinalReportData {
  reportId: string;
  tokenomics: TokenomicsReport;
  onchainMetrics: OnchainMetricsReport;
  codeReview: CodeReviewReport;
  auditReview: AuditReviewReport;
  whitepaperReview: WhitepaperReviewReport;
  sentiment: SentimentTeamReport;
  team: SentimentTeamReport;
  chainData: any;
}
