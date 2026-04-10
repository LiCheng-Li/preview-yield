export interface VaultToken {
  address: string;
  symbol: string;
  decimals: number;
  name?: string;
}

export interface VaultProtocol {
  name: string;
  url: string;
}

export interface VaultAnalytics {
  apy: {
    base: number;
    reward: number | null;
    total: number;
  };
  apy1d: number | null;
  apy7d: number | null;
  apy30d: number | null;
  tvl: {
    usd: string;
  };
  updatedAt: string;
}

export interface Vault {
  address: string;
  network: string;
  chainId: number;
  slug: string;
  name: string;
  description: string;
  protocol: VaultProtocol;
  underlyingTokens: VaultToken[];
  lpTokens: VaultToken[];
  tags: string[];
  analytics: VaultAnalytics;
  isTransactional: boolean;
  isRedeemable: boolean;
  depositPacks: { name: string; stepsType: string }[];
  redeemPacks: { name: string; stepsType: string }[];
}

export interface VaultsResponse {
  data: Vault[];
  nextCursor: string | null;
  total: number;
}

export interface QuoteFeeCost {
  name: string;
  description: string;
  token: VaultToken & { priceUSD: string };
  amount: string;
  amountUSD: string;
  percentage: string;
  included: boolean;
}

export interface QuoteGasCost {
  type: string;
  price: string;
  estimate: string;
  limit: string;
  amount: string;
  amountUSD: string;
  token: VaultToken & { priceUSD: string };
}

export interface QuoteStep {
  id: string;
  type: string;
  tool: string;
  toolDetails: { key: string; name: string; logoURI: string };
  action: {
    fromChainId: number;
    toChainId: number;
    fromToken: VaultToken;
    toToken: VaultToken;
  };
  estimate: {
    fromAmount: string;
    toAmount: string;
    executionDuration: number;
    gasCosts: QuoteGasCost[];
    feeCosts: QuoteFeeCost[];
  };
}

export interface Quote {
  type: string;
  id: string;
  tool: string;
  action: {
    fromToken: VaultToken & { priceUSD: string };
    fromAmount: string;
    toToken: VaultToken & { priceUSD: string };
    fromChainId: number;
    toChainId: number;
    slippage: number;
    fromAddress: string;
    toAddress: string;
  };
  estimate: {
    toAmount: string;
    toAmountMin: string;
    fromAmount: string;
    fromAmountUSD: string;
    toAmountUSD: string;
    feeCosts: QuoteFeeCost[];
    gasCosts: QuoteGasCost[];
    executionDuration: number;
  };
  includedSteps: QuoteStep[];
  transactionRequest: {
    value: string;
    to: string;
    data: string;
    chainId: number;
    gasPrice: string;
    gasLimit: string;
    from: string;
  };
}

export type RiskLevel = 'low' | 'medium' | 'high';
export type Priority = 'fewest-steps' | 'lowest-cost' | 'best-yield';

export interface UserPreferences {
  asset: 'USDC' | 'USDT';
  amount: string;
  risk: RiskLevel;
  chains: number[];
  priority: Priority;
}

export interface VaultWithQuote {
  vault: Vault;
  quote: Quote | null;
  totalCostUSD: number;
  stepCount: number;
  stepsDescription: string;
  recommendationReason?: string;
}
