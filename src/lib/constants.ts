export const EARN_API_BASE = 'https://earn.li.fi';
export const COMPOSER_API_BASE = 'https://li.quest';

export const SUPPORTED_CHAINS: { chainId: number; name: string; logo: string }[] = [
  { chainId: 1, name: 'Ethereum', logo: '/chains/ethereum.svg' },
  { chainId: 11155111, name: 'Sepolia', logo: '/chains/ethereum.svg' },
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

export interface AssetOption {
  symbol: string;
  name: string;
  category: 'stablecoin' | 'major' | 'alt';
}

export const SUPPORTED_ASSETS: AssetOption[] = [
  // Stablecoins
  { symbol: 'USDC', name: 'USD Coin', category: 'stablecoin' },
  { symbol: 'USDT', name: 'Tether', category: 'stablecoin' },
  { symbol: 'DAI', name: 'Dai', category: 'stablecoin' },
  { symbol: 'FRAX', name: 'Frax', category: 'stablecoin' },
  { symbol: 'LUSD', name: 'Liquity USD', category: 'stablecoin' },
  { symbol: 'crvUSD', name: 'Curve USD', category: 'stablecoin' },
  { symbol: 'GHO', name: 'Aave GHO', category: 'stablecoin' },
  { symbol: 'USDS', name: 'USDS', category: 'stablecoin' },
  // Major
  { symbol: 'ETH', name: 'Ether', category: 'major' },
  { symbol: 'WETH', name: 'Wrapped ETH', category: 'major' },
  { symbol: 'WBTC', name: 'Wrapped BTC', category: 'major' },
  { symbol: 'wstETH', name: 'Lido wstETH', category: 'major' },
  { symbol: 'cbETH', name: 'Coinbase ETH', category: 'major' },
  { symbol: 'rETH', name: 'Rocket Pool ETH', category: 'major' },
  { symbol: 'stETH', name: 'Lido stETH', category: 'major' },
  // Altcoins
  { symbol: 'LINK', name: 'Chainlink', category: 'alt' },
  { symbol: 'UNI', name: 'Uniswap', category: 'alt' },
  { symbol: 'AAVE', name: 'Aave', category: 'alt' },
  { symbol: 'CRV', name: 'Curve', category: 'alt' },
  { symbol: 'MKR', name: 'Maker', category: 'alt' },
  { symbol: 'SNX', name: 'Synthetix', category: 'alt' },
  { symbol: 'COMP', name: 'Compound', category: 'alt' },
  { symbol: 'LDO', name: 'Lido DAO', category: 'alt' },
  { symbol: 'ARB', name: 'Arbitrum', category: 'alt' },
  { symbol: 'OP', name: 'Optimism', category: 'alt' },
  { symbol: 'MATIC', name: 'Polygon', category: 'alt' },
  { symbol: 'AVAX', name: 'Avalanche', category: 'alt' },
  { symbol: 'BNB', name: 'BNB', category: 'alt' },
  { symbol: 'SOL', name: 'Solana', category: 'alt' },
  { symbol: 'DOGE', name: 'Dogecoin', category: 'alt' },
  { symbol: 'SHIB', name: 'Shiba Inu', category: 'alt' },
  { symbol: 'PEPE', name: 'Pepe', category: 'alt' },
  { symbol: 'WLD', name: 'Worldcoin', category: 'alt' },
  { symbol: 'PENDLE', name: 'Pendle', category: 'alt' },
  { symbol: 'ENA', name: 'Ethena', category: 'alt' },
  { symbol: 'GMX', name: 'GMX', category: 'alt' },
  { symbol: 'RPL', name: 'Rocket Pool', category: 'alt' },
];

export const STABLECOIN_SYMBOLS = SUPPORTED_ASSETS
  .filter((a) => a.category === 'stablecoin')
  .map((a) => a.symbol);

export const DEFAULT_PREFERENCES = {
  asset: 'USDC',
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
