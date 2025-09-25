export interface MonthlyData {
  date: string;
  assets: Record<string, number>;
  liabilities: Record<string, number>;
}

export interface ProcessedMonthlyData extends MonthlyData {
  totalAsset: number;
  totalLiability: number;
  net: number;
  diffInTotalAsset: number;
  myAssets: number;
  percentageChange: number;
  diffInNet: number;
}

export interface Insight {
  title: string;
  explanation: string;
  suggestion: string;
}
