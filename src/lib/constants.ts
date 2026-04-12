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

// Token contract addresses per chain (for balance lookup)
// Use 'native' for chain's native token (ETH, MATIC, BNB, AVAX...)
export const TOKEN_ADDRESSES: Record<number, Record<string, `0x${string}` | 'native'>> = {
  1: {
    ETH: 'native',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    wstETH: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
    stETH: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    FRAX: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
    LUSD: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
    LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    AAVE: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    MKR: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
    crvUSD: '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E',
    GHO: '0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f',
    USDS: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
  },
  8453: {
    ETH: 'native',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    USDT: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
    DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    WETH: '0x4200000000000000000000000000000000000006',
    cbETH: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
    wstETH: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452',
  },
  42161: {
    ETH: 'native',
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    WBTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    wstETH: '0x5979D7b546E38E414F7E9822514be443A4800529',
    ARB: '0x912CE59144191C1204E64559FE8253a0e49E6548',
  },
  10: {
    ETH: 'native',
    USDC: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    USDT: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    WETH: '0x4200000000000000000000000000000000000006',
    OP: '0x4200000000000000000000000000000000000042',
  },
  137: {
    MATIC: 'native',
    USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    WBTC: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
  },
};

