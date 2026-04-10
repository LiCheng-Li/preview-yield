import { EARN_API_BASE, TVL_THRESHOLDS, STABLECOIN_SYMBOLS } from './constants';
import type { Vault, VaultsResponse, RiskLevel } from '@/types/vault';

export async function fetchAllVaults(chainId?: number): Promise<Vault[]> {
  const vaults: Vault[] = [];
  let cursor: string | null = null;

  do {
    const params = new URLSearchParams();
    if (chainId) params.set('chainId', String(chainId));
    if (cursor) params.set('cursor', cursor);

    const url = `${EARN_API_BASE}/v1/earn/vaults${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Earn API error: ${res.status}`);

    const data: VaultsResponse = await res.json();
    vaults.push(...data.data);
    cursor = data.nextCursor;
  } while (cursor);

  return vaults;
}

export function filterVaults(
  vaults: Vault[],
  asset: string,
  risk: RiskLevel,
  chains: number[],
): Vault[] {
  const assetUpper = asset.toUpperCase();
  const isStablecoin = STABLECOIN_SYMBOLS.some((s) => s.toUpperCase() === assetUpper);

  return vaults.filter((v) => {
    // Must be transactional
    if (!v.isTransactional) return false;

    // Must match selected chains
    if (!chains.includes(v.chainId)) return false;

    // Must have the target asset as underlying
    const hasAsset = v.underlyingTokens.some(
      (t) => t.symbol.toUpperCase() === assetUpper,
    );
    if (!hasAsset) return false;

    // Risk-based filtering
    const tvl = parseFloat(v.analytics.tvl.usd);
    const tvlThreshold = TVL_THRESHOLDS[risk];

    if (risk === 'low') {
      // For stablecoins: require stablecoin tag + high TVL
      // For non-stablecoins: just require high TVL
      if (isStablecoin && !v.tags.includes('stablecoin')) return false;
      if (tvl < tvlThreshold) return false;
    } else if (risk === 'medium') {
      if (tvl < tvlThreshold) return false;
    }
    // high: no filters

    return true;
  });
}

export function sortVaultsByAPY(vaults: Vault[]): Vault[] {
  return [...vaults].sort(
    (a, b) => (b.analytics.apy.total ?? 0) - (a.analytics.apy.total ?? 0),
  );
}
