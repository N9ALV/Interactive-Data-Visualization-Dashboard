
export interface PortfolioInstrument {
  id: string;
  ticker: string;
  fundName: string;
  category: string;
  underlyingAssets: string;
  expenseRatio?: string;
  aum?: string;
  yield?: string;
  inception?: string;
  keyCharacteristics: string[];
  commonMetrics: string[];
  sleeve: string;
  targetAllocation: number;
  currentAllocation: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialMetric {
  id: string;
  instrumentId: string;
  date: Date;
  metricType: string;
  value: number;
  period: string;
  currency: string;
  metadata?: any;
}

export interface PortfolioAllocation {
  id: string;
  name: string;
  isActive: boolean;
  sleeveA: number;
  sleeveB: number;
  sleeveC: number;
  sleeveD: number;
  sleeveE: number;
  forwardYield?: number;
  maxDrawdown?: number;
  dailyLiquidity?: number;
}

export interface MarketData {
  id: string;
  symbol: string;
  date: Date;
  open?: number;
  high?: number;
  low?: number;
  close: number;
  volume?: bigint;
  adjustedClose?: number;
  marketCap?: bigint;
  beta?: number;
  pe?: number;
}

export interface NLPAnalysis {
  id: string;
  instrumentId: string;
  documentType: string;
  analysisDate: Date;
  sentiment: number;
  themes: any;
  risks: any;
  opportunities: any;
  forwardLookingStatements: any;
  rawText?: string;
  summary?: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  fmpApiKey?: string;
  refreshInterval: number;
  defaultTimeframe: string;
  theme: string;
  enableNotifications: boolean;
  enableSP500: boolean;
  enableBondBench: boolean;
  customBenchmarks?: any;
}

export interface StressTestScenario {
  id: string;
  name: string;
  description: string;
  equityShock: number;
  bondShock: number;
  realEstateShock: number;
  volatilityMultiplier: number;
  duration: number;
  isActive: boolean;
}

// API Response Types for Financial Modeling Prep
export interface FMPQuote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  volume: number;
  avgVolume: number;
  exchange: string;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  earningsAnnouncement: string;
  sharesOutstanding: number;
  timestamp: number;
}

export interface FMPProfile {
  symbol: string;
  price: number;
  beta: number;
  volAvg: number;
  mktCap: number;
  lastDiv: number;
  range: string;
  changes: number;
  companyName: string;
  currency: string;
  cik: string;
  isin: string;
  cusip: string;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dcfDiff: number;
  dcf: number;
  image: string;
  ipoDate: string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}

export interface FMPETFHolding {
  asset: string;
  sharesNumber: number;
  weightPercentage: number;
  marketValue: number;
}

export interface SleeveInfo {
  id: string;
  name: string;
  description: string;
  targetAllocation: number;
  instruments: string[];
  color: string;
}

export const SLEEVE_CONFIG: Record<string, SleeveInfo> = {
  A: {
    id: 'A',
    name: 'Quality Dividend & Option Income',
    description: 'High-quality dividend-growing companies and covered call strategies',
    targetAllocation: 35,
    instruments: ['NOBL', 'XYLD'],
    color: '#60B5FF',
  },
  B: {
    id: 'B',
    name: 'Fixed-Income & Inflation Hedge',
    description: 'Government bonds and inflation-protected securities',
    targetAllocation: 20,
    instruments: ['SCHP', 'IEI'],
    color: '#FF9149',
  },
  C: {
    id: 'C',
    name: 'Market-Neutral/Alt Alpha',
    description: 'Alternative strategies with low market correlation',
    targetAllocation: 25,
    instruments: ['DBMF', 'BTAL', 'MERFX'],
    color: '#FF9898',
  },
  D: {
    id: 'D',
    name: 'Real-Asset Yield',
    description: 'Real estate and infrastructure investments',
    targetAllocation: 10,
    instruments: ['VNQ', 'UTF', 'IDU'],
    color: '#FF90BB',
  },
  E: {
    id: 'E',
    name: 'Cash & Cash-Like',
    description: 'Short-term Treasury bills and cash equivalents',
    targetAllocation: 10,
    instruments: ['SGOV'],
    color: '#80D8C3',
  },
};
