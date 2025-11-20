export interface SupplyInfo {
  circulatingSupply: number;
  maxSupply: number;
  totalSupply: number;
  // Add other supply-related fields as per API design
}

export interface DistributionInfo {
  holdersCount: number;
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
