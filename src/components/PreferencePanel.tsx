'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { SUPPORTED_CHAINS, SUPPORTED_ASSETS, DEFAULT_PREFERENCES } from '@/lib/constants';
import { useTokenBalance } from '@/lib/useTokenBalance';
import type { RiskLevel, Priority, UserPreferences } from '@/types/vault';

interface Props {
  onSearch: (prefs: UserPreferences) => void;
  loading: boolean;
}

const CATEGORIES = [
  { key: 'stablecoin', label: 'Stablecoins' },
  { key: 'major', label: 'Major' },
  { key: 'alt', label: 'Altcoins' },
] as const;

export default function PreferencePanel({ onSearch, loading }: Props) {
  const [asset, setAsset] = useState(DEFAULT_PREFERENCES.asset);
  const [amount, setAmount] = useState(DEFAULT_PREFERENCES.amount);
  const [risk, setRisk] = useState<RiskLevel>(DEFAULT_PREFERENCES.risk);
  const [chains, setChains] = useState<number[]>(DEFAULT_PREFERENCES.chains);
  const [priority, setPriority] = useState<Priority>(DEFAULT_PREFERENCES.priority);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [assetCategory, setAssetCategory] = useState<'stablecoin' | 'major' | 'alt'>('stablecoin');

  const { chainId } = useAccount();
  const balance = useTokenBalance(asset);
  const currentChainName = SUPPORTED_CHAINS.find((c) => c.chainId === chainId)?.name ?? 'Unknown chain';

  const formatBalance = (v: string) => {
    const n = parseFloat(v);
    if (n === 0) return '0';
    if (n < 0.0001) return '< 0.0001';
    return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
  };

  const handleMax = () => {
    if (balance.hasBalance) setAmount(balance.formatted);
  };

  const toggleChain = (chainId: number) => {
    setChains((prev) =>
      prev.includes(chainId)
        ? prev.filter((c) => c !== chainId)
        : [...prev, chainId],
    );
  };

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    onSearch({ asset, amount, risk, chains, priority });
  };

  const assetsInCategory = SUPPORTED_ASSETS.filter((a) => a.category === assetCategory);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Asset selector */}
      <div className="space-y-3">
        <label className="text-sm text-gray-400">Select Asset</label>
        {/* Category tabs */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setAssetCategory(cat.key)}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                assetCategory === cat.key
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {/* Asset grid */}
        <div className="flex flex-wrap gap-2">
          {assetsInCategory.map((a) => (
            <button
              key={a.symbol}
              onClick={() => setAsset(a.symbol)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                asset === a.symbol
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span className="font-medium">{a.symbol}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amount input + balance */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="text-gray-400">Amount</label>
          {balance.supported ? (
            <button
              onClick={handleMax}
              disabled={!balance.hasBalance}
              className="text-gray-400 hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Balance:{' '}
              <span className={balance.hasBalance ? 'text-emerald-400 underline' : ''}>
                {balance.isLoading ? '...' : `${formatBalance(balance.formatted)} ${asset}`}
              </span>
              <span className="text-gray-600"> &middot; {currentChainName}</span>
            </button>
          ) : (
            <span className="text-gray-600">Balance unavailable for this token/chain</span>
          )}
        </div>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            step="any"
            className="w-full px-4 py-3 pr-28 bg-white/5 border border-white/10 rounded-lg text-lg focus:outline-none focus:border-emerald-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {balance.hasBalance && (
              <button
                onClick={handleMax}
                className="px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded transition-colors"
              >
                MAX
              </button>
            )}
            <span className="text-gray-500 font-medium pr-2">{asset}</span>
          </div>
        </div>
      </div>

      {/* Risk selector */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Risk Tolerance</label>
        <div className="flex gap-2">
          {([
            { value: 'low', label: 'Low', desc: 'High TVL only' },
            { value: 'medium', label: 'Medium', desc: 'TVL > $1M' },
            { value: 'high', label: 'High', desc: 'All vaults' },
          ] as const).map((r) => (
            <button
              key={r.value}
              onClick={() => setRisk(r.value)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                risk === r.value
                  ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className="font-medium">{r.label}</div>
              <div className="text-xs opacity-60 mt-0.5">{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced options toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
      >
        {showAdvanced ? '▾ Hide' : '▸ More'} options
      </button>

      {showAdvanced && (
        <div className="space-y-4 animate-in fade-in">
          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Priority</label>
            <div className="flex gap-2">
              {([
                { value: 'best-yield', label: 'Best Yield' },
                { value: 'lowest-cost', label: 'Lower Cost' },
                { value: 'fewest-steps', label: 'Fewer Steps' },
              ] as const).map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                    priority === p.value
                      ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chains */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Chains</label>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_CHAINS.map((chain) => (
                <button
                  key={chain.chainId}
                  onClick={() => toggleChain(chain.chainId)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    chains.includes(chain.chainId)
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'bg-white/5 text-gray-500 border border-transparent hover:bg-white/10'
                  }`}
                >
                  {chain.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search button */}
      <button
        onClick={handleSubmit}
        disabled={!amount || parseFloat(amount) <= 0 || loading}
        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
      >
        {loading ? 'Searching...' : 'Find Best Yield'}
      </button>
    </div>
  );
}
