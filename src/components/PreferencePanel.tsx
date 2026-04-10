'use client';

import { useState } from 'react';
import { SUPPORTED_CHAINS, DEFAULT_PREFERENCES } from '@/lib/constants';
import type { RiskLevel, Priority, UserPreferences } from '@/types/vault';

interface Props {
  onSearch: (prefs: UserPreferences) => void;
  loading: boolean;
}

export default function PreferencePanel({ onSearch, loading }: Props) {
  const [asset, setAsset] = useState<'USDC' | 'USDT'>(DEFAULT_PREFERENCES.asset);
  const [amount, setAmount] = useState(DEFAULT_PREFERENCES.amount);
  const [risk, setRisk] = useState<RiskLevel>(DEFAULT_PREFERENCES.risk);
  const [chains, setChains] = useState<number[]>(DEFAULT_PREFERENCES.chains);
  const [priority, setPriority] = useState<Priority>(DEFAULT_PREFERENCES.priority);
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Asset selector */}
      <div className="flex gap-2">
        {(['USDC', 'USDT'] as const).map((a) => (
          <button
            key={a}
            onClick={() => setAsset(a)}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
              asset === a
                ? 'bg-emerald-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Amount input */}
      <div className="relative">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          min="0"
          step="any"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-lg focus:outline-none focus:border-emerald-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
          {asset}
        </span>
      </div>

      {/* Risk selector */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Risk Tolerance</label>
        <div className="flex gap-2">
          {([
            { value: 'low', label: 'Low', desc: 'Stablecoins, high TVL' },
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
