export const EARN_API_BASE = 'https://earn.li.fi';
export const COMPOSER_API_BASE = 'https://li.quest';

export const SUPPORTED_CHAINS: { chainId: number; name: string; logo: string }[] = [
  { chainId: 1, name: 'Ethereum', logo: '/chains/ethereum.svg' },
  { chainId: 8453, name: 'Base', logo: '/chains/base.svg' },
  { chainId: 42161, name: 'Arbitrum', logo: '/chains/arbitrum.svg' },
  { chainId: 10, name: 'OP Mainnet', logo: '/chains/optimism.svg' },
  { chainId: 137, name: 'Polygon', logo: '/chains/polygon.svg' },
  { chainId: 43114, name: 'Avalanche', logo: '/chains/avalanche.svg' },
  { chainId: 56, name: 'BNB Chain', logo: '/chains/bnb.svg' },
  { chainId: 534352, name: 'Scroll', logo: '/chains/scroll.svg' },
  { chainId: 59144, name: 'Linea', logo: '/chains/linea.svg' },
  { chainId: 146, name: 'Sonic', logo: '/chains/sonic.svg' },
];

export const STABLECOIN_SYMBOLS = ['USDC', 'USDT'] as const;

export const DEFAULT_PREFERENCES = {
  asset: 'USDC' as const,
  amount: '',
  risk: 'low' as const,
  chains: SUPPORTED_CHAINS.map((c) => c.chainId),
  priority: 'best-yield' as const,
};

export const TVL_THRESHOLDS = {
  low: 10_000_000,
  medium: 1_000_000,
  high: 0,
} as const;
