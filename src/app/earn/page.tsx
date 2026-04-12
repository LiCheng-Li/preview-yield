'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PreferencePanel from '@/components/PreferencePanel';
import VaultCard from '@/components/VaultCard';
import DepositModal from '@/components/DepositModal';
import { filterVaults, sortVaultsByAPY } from '@/lib/earn-api';
import { fetchQuote, extractQuoteMetrics } from '@/lib/composer';
import { fetchExplanations } from '@/lib/gemini';
import type { Vault, VaultWithQuote, UserPreferences, VaultsResponse } from '@/types/vault';
import { EARN_API_BASE } from '@/lib/constants';

export default function EarnPage() {
  const { address, isConnected, chainId: walletChainId } = useAccount();
  const [results, setResults] = useState<VaultWithQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [depositItem, setDepositItem] = useState<VaultWithQuote | null>(null);

  const handleSearch = async (prefs: UserPreferences) => {
    if (!address) return;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // Step 1: Fetch all vaults (paginated)
      setStatus('Fetching vaults...');
      const allVaults: Vault[] = [];
      let cursor: string | null = null;

      do {
        const params = new URLSearchParams();
        if (cursor) params.set('cursor', cursor);
        const url = `${EARN_API_BASE}/v1/earn/vaults${params.toString() ? '?' + params.toString() : ''}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch vaults');
        const data: VaultsResponse = await res.json();
        allVaults.push(...data.data);
        cursor = data.nextCursor;
      } while (cursor);

      // Step 2: Filter and sort
      setStatus(`Found ${allVaults.length} vaults, filtering...`);
      const filtered = filterVaults(allVaults, prefs.asset, prefs.risk, prefs.chains);
      const sorted = sortVaultsByAPY(filtered);
      const topCandidates = sorted.slice(0, 20);

      if (topCandidates.length === 0) {
        setError('No vaults found matching your criteria. Try adjusting your filters.');
        setLoading(false);
        setStatus('');
        return;
      }

      // Step 3: Fetch quotes in parallel for top candidates
      setStatus(`Getting quotes for ${topCandidates.length} vaults...`);
      const withQuotes: VaultWithQuote[] = await Promise.all(
        topCandidates.map(async (vault) => {
          try {
            const quote = await fetchQuote(vault, address, prefs.amount, walletChainId);
            const metrics = extractQuoteMetrics(quote);
            return {
              vault,
              quote,
              totalCostUSD: metrics.totalCostUSD,
              stepCount: metrics.stepCount,
              stepsDescription: metrics.stepsDescription,
            };
          } catch {
            return {
              vault,
              quote: null,
              totalCostUSD: 0,
              stepCount: 0,
              stepsDescription: 'Quote unavailable',
            };
          }
        }),
      );

      // Step 4: Drop unaffordable/unquotable options, then sort by priority
      const affordable = withQuotes.filter((i) => i.quote !== null);
      if (affordable.length === 0) {
        setError(
          'No affordable options found. Make sure your wallet has enough balance on a supported chain, or try a larger amount.',
        );
        setLoading(false);
        setStatus('');
        return;
      }
      const prioritySorted = sortByPriority(affordable, prefs.priority);
      const top3 = prioritySorted.slice(0, 3);

      // Show results immediately, then fetch AI explanations
      setResults(top3);
      setStatus('Generating AI insights...');

      // Step 5: Fetch AI explanations
      try {
        const reasons = await fetchExplanations(top3, prefs.amount, prefs.asset, prefs.priority);
        const withReasons = top3.map((item, i) => ({
          ...item,
          recommendationReason: reasons[i] || '',
        }));
        setResults(withReasons);
      } catch {
        // AI explanations are optional, results still show
      }

      setStatus('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  const handleDeposit = (item: VaultWithQuote) => {
    setDepositItem(item);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 glow">
        <h1 className="text-3xl font-bold animate-fade-in-up">
          Connect your wallet to start earning
        </h1>
        <div className="animate-fade-in-up animate-delay-1">
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Preview<span className="text-emerald-400">Yield</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            See cost, steps & yield before you sign
          </p>
        </div>
        <ConnectButton showBalance={false} />
      </div>

      {/* Preferences */}
      <PreferencePanel onSearch={handleSearch} loading={loading} />

      {/* Status + Loading skeletons */}
      {status && (
        <div className="mt-8 space-y-4">
          <div className="text-center text-sm text-gray-400 animate-pulse mb-4">
            {status}
          </div>
          {results.length === 0 && loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-white/10 p-5 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-5 w-32 rounded shimmer" />
                    <div className="h-8 w-20 rounded shimmer" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-14 rounded-xl shimmer" />
                    <div className="h-14 rounded-xl shimmer" />
                    <div className="h-14 rounded-xl shimmer" />
                  </div>
                  <div className="h-10 rounded-xl shimmer" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-300">
            Top {results.length} Options
          </h2>
          {results.map((item, i) => (
            <VaultCard
              key={item.vault.address}
              item={item}
              rank={i + 1}
              onDeposit={handleDeposit}
            />
          ))}
        </div>
      )}

      {/* Deposit Modal */}
      {depositItem && (
        <DepositModal
          item={depositItem}
          onClose={() => setDepositItem(null)}
        />
      )}
    </div>
  );
}

function sortByPriority(items: VaultWithQuote[], priority: string): VaultWithQuote[] {
  const sorted = [...items];
  sorted.sort((a, b) => {
    switch (priority) {
      case 'fewest-steps':
        return a.stepCount - b.stepCount || b.vault.analytics.apy.total - a.vault.analytics.apy.total;
      case 'lowest-cost':
        return a.totalCostUSD - b.totalCostUSD || b.vault.analytics.apy.total - a.vault.analytics.apy.total;
      case 'best-yield':
      default:
        return b.vault.analytics.apy.total - a.vault.analytics.apy.total;
    }
  });
  return sorted;
}
