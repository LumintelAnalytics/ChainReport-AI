export interface OnchainMetrics {
  // Example fields, adjust as per actual data structure
  transactionsCount: number;
  activeAddresses: number;
  newAddresses: number;
  transactionVolume: number;
  averageTransactionValue: number;
}

export interface HolderActivity {
  // Example fields, adjust as per actual data structure
  totalHolders: number;
  hodlWaves: { [key: string]: number }; // e.g., { "1y-2y": 1000, "2y-3y": 500 }
  concentrationByBalance: { [key: string]: number }; // e.g., { "<1k": 0.2, "1k-10k": 0.3 }
}

export interface WhaleMovements {
  // Example fields, adjust as per actual data structure
  whaleTransactionsCount: number;
  whaleTransactionVolume: number;
  topHolders: { address: string; balance: number }[];
}

export interface ChainReport {
  reportId: string;
  tokenId: string;
  reportDate: string;
  onchainMetrics: OnchainMetrics;
  holderActivity: HolderActivity;
  whaleMovements: WhaleMovements;
  // Add other relevant sections as needed, e.g., sentiment, tokenomics
}
