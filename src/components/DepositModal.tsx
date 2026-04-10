'use client';

import { useState } from 'react';
import { useSendTransaction, useSwitchChain, useAccount } from 'wagmi';
import { buildTransactionRequest } from '@/lib/execute';
import type { VaultWithQuote } from '@/types/vault';

interface Props {
  item: VaultWithQuote;
  onClose: () => void;
}

type Status = 'confirm' | 'switching' | 'sending' | 'pending' | 'success' | 'error';

export default function DepositModal({ item, onClose }: Props) {
  const { vault, quote, totalCostUSD, stepCount, stepsDescription } = item;
  const apy = vault.analytics.apy.total * 100;
  const [status, setStatus] = useState<Status>('confirm');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { chainId: currentChainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();

  const targetChainId = quote?.transactionRequest.chainId;

  const handleDeposit = async () => {
    if (!quote) return;

    try {
      // Switch chain if needed
      if (targetChainId && currentChainId !== targetChainId) {
        setStatus('switching');
        await switchChainAsync({ chainId: targetChainId });
      }

      // Send transaction
      setStatus('sending');
      const tx = buildTransactionRequest(quote);
      const hash = await sendTransactionAsync(tx);
      setTxHash(hash);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Transaction failed');
      setStatus('error');
    }
  };

  const explorerUrl = txHash && targetChainId
    ? getExplorerUrl(targetChainId, txHash)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Confirm Deposit</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">
            &times;
          </button>
        </div>

        {/* Summary */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Protocol</span>
            <span className="font-medium">{vault.protocol.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Chain</span>
            <span className="font-medium">{vault.network}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">APY</span>
            <span className="font-medium text-emerald-400">{apy.toFixed(2)}%</span>
          </div>
          {quote && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-400">Est. Cost</span>
                <span className="font-medium">${totalCostUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Steps</span>
                <span className="font-medium">{stepCount} — {stepsDescription}</span>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-white/10" />

        {/* Action area */}
        {status === 'confirm' && (
          <button
            onClick={handleDeposit}
            disabled={!quote}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-semibold rounded-lg transition-colors"
          >
            Deposit
          </button>
        )}

        {status === 'switching' && (
          <div className="text-center text-yellow-400 py-3 animate-pulse">
            Switching to {vault.network}...
          </div>
        )}

        {status === 'sending' && (
          <div className="text-center text-emerald-400 py-3 animate-pulse">
            Confirm in your wallet...
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-3">
            <div className="text-center text-emerald-400 font-semibold py-2">
              Deposit submitted!
            </div>
            {explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2.5 text-center bg-white/10 hover:bg-white/15 rounded-lg text-sm transition-colors"
              >
                View on Explorer
              </a>
            )}
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-3">
            <div className="text-center text-red-400 text-sm py-2">
              {errorMsg || 'Transaction failed'}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setStatus('confirm'); setErrorMsg(null); }}
                className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-sm transition-colors"
              >
                Retry
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getExplorerUrl(chainId: number, hash: string): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    8453: 'https://basescan.org',
    42161: 'https://arbiscan.io',
    10: 'https://optimistic.etherscan.io',
    137: 'https://polygonscan.com',
    43114: 'https://snowtrace.io',
    56: 'https://bscscan.com',
    534352: 'https://scrollscan.com',
    59144: 'https://lineascan.build',
    146: 'https://sonicscan.org',
  };
  const base = explorers[chainId] || 'https://etherscan.io';
  return `${base}/tx/${hash}`;
}
