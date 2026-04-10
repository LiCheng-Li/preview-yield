import { EARN_API_BASE, TVL_THRESHOLDS } from './constants';
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
  asset: 'USDC' | 'USDT',
  risk: RiskLevel,
  chains: number[],
): Vault[] {
  return vaults.filter((v) => {
    // Must be transactional
    if (!v.isTransactional) return false;

    // Must match selected chains
    if (!chains.includes(v.chainId)) return false;

    // Must have the target asset as underlying
    const hasAsset = v.underlyingTokens.some(
      (t) => t.symbol.toUpperCase() === asset,
    );
    if (!hasAsset) return false;

    // Risk-based filtering
    const tvl = parseFloat(v.analytics.tvl.usd);
    const tvlThreshold = TVL_THRESHOLDS[risk];

    if (risk === 'low') {
      // Must have stablecoin tag AND high TVL
      if (!v.tags.includes('stablecoin')) return false;
      if (tvl < tvlThreshold) return false;
    } else if (risk === 'medium') {
      // No tag filter, but TVL threshold
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
