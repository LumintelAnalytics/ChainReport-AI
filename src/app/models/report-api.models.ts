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
  tokenomics: any; // Placeholder
  sentiment: any; // Placeholder
  team: any;      // Placeholder
  chainData: any; // Placeholder
}
