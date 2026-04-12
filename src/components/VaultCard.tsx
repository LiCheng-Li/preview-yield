'use client';

import type { VaultWithQuote } from '@/types/vault';

interface Props {
  item: VaultWithQuote;
  rank: number;
  onDeposit: (item: VaultWithQuote) => void;
}

export default function VaultCard({ item, rank, onDeposit }: Props) {
  const { vault, totalCostUSD, stepCount, stepsDescription, recommendationReason } = item;
  const apy = vault.analytics.apy.total;
  const tvl = parseFloat(vault.analytics.tvl.usd);
  const isTop = rank === 1;

  const delayClass = rank === 1 ? '' : rank === 2 ? 'animate-delay-1' : 'animate-delay-2';

  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all animate-fade-in-up ${delayClass} ${
        isTop
          ? 'border-emerald-500/60 bg-emerald-500/[0.04] shadow-lg shadow-emerald-500/10'
          : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
      }`}
    >
      {isTop && (
        <div className="absolute -top-3 left-4 px-3 py-0.5 bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-md shadow-emerald-500/30">
          Recommended
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-mono">#{rank}</span>
            <h3 className="font-semibold text-lg">{vault.protocol.name}</h3>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{vault.network} &middot; {vault.name}</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold tabular-nums ${isTop ? 'text-emerald-400' : 'text-white'}`}>
            {apy.toFixed(2)}%
          </div>
          <div className="text-xs text-gray-500">APY</div>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/5 rounded-xl px-3 py-2.5">
          <div className="text-[11px] text-gray-500 uppercase tracking-wider">Cost</div>
          <div className="font-semibold mt-0.5">
            {item.quote ? `$${totalCostUSD.toFixed(2)}` : '—'}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl px-3 py-2.5">
          <div className="text-[11px] text-gray-500 uppercase tracking-wider">Steps</div>
          <div className="font-semibold mt-0.5">
            {item.quote ? stepCount : '—'}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl px-3 py-2.5">
          <div className="text-[11px] text-gray-500 uppercase tracking-wider">TVL</div>
          <div className="font-semibold mt-0.5">
            ${tvl >= 1_000_000 ? `${(tvl / 1_000_000).toFixed(1)}M` : `${(tvl / 1_000).toFixed(0)}K`}
          </div>
        </div>
      </div>

      {/* Steps visualization */}
      {item.quote && (
        <div className="flex items-center gap-1.5 mb-4">
          {stepsDescription.split(' + ').map((step, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              <span className="text-xs px-2.5 py-1 bg-white/[0.07] rounded-full text-gray-300">
                {step}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* AI Recommendation */}
      {recommendationReason ? (
        <p className="text-sm text-gray-400 mb-4 leading-relaxed border-l-2 border-emerald-500/30 pl-3">
          {recommendationReason}
        </p>
      ) : item.quote ? (
        <div className="h-5 w-3/4 rounded shimmer mb-4" />
      ) : null}

      <button
        onClick={() => onDeposit(item)}
        disabled={!item.quote}
        className={`w-full py-2.5 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
          isTop
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30'
            : 'bg-white/10 hover:bg-white/15 text-white'
        }`}
      >
        {item.quote ? 'Deposit' : 'Quote unavailable'}
      </button>
    </div>
  );
}
