export interface SupplyInfo {
  circulatingSupply: string;
  maxSupply?: string;
  totalSupply: string;
  // Add other supply-related fields as per API design
}

export interface DistributionInfo {
  holdersCount: number;
  /**
   * The percentage of tokens held by top holders, represented as a decimal value from 0.0 to 1.0.
   * Consumers should multiply by 100 to display as a percentage (e.g., 0.75 for 75%).
   */
  topHoldersPercentage: number;
  // Add other distribution-related fields as per API design
}

export interface RiskFlags {
  isCentralized: boolean;
  hasMintFunction: boolean;
  // Add other risk-related flags as per API design
}

export interface TokenomicsReport {
  supplyInfo: SupplyInfo;
  distributionInfo: DistributionInfo;
  riskFlags: RiskFlags;
  // Add other top-level tokenomics report fields as per API design
}
