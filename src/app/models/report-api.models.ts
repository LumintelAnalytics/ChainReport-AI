import { TokenomicsReport } from './tokenomics.model';

export interface GenerateReportResponse {
  reportId: string;
}

export interface ReportStatusResponse {
  status: string;
  errorMessage?: string;
  progressMessage?: string;
}

export interface FinalReportData {
  reportId: string;
  tokenomics: TokenomicsReport; // Placeholder
  sentiment: any; // Placeholder
  team: any;      // Placeholder
  chainData: any; // Placeholder
}
