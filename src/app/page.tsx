'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10 p-8">
      <div className="glow text-center space-y-5 max-w-2xl animate-fade-in-up">
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
          Preview<span className="text-emerald-400">Yield</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-lg mx-auto">
          See the cost, steps, and expected yield <br className="hidden md:block" />
          <span className="text-white/80">before you sign.</span>
        </p>
        <p className="text-gray-500 text-sm">
          A stablecoin earn interface with AI-powered route explainability.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 animate-fade-in-up animate-delay-2">
        <ConnectButton />

        {isConnected && (
          <Link
            href="/earn"
            className="mt-2 px-10 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Start Earning
          </Link>
        )}
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up animate-delay-3">
        {[
          'Multi-chain vaults',
          'Cost & step preview',
          'AI recommendations',
          'One-click deposit',
        ].map((f) => (
          <span
            key={f}
            className="px-4 py-1.5 text-xs text-gray-400 bg-white/5 border border-white/10 rounded-full"
          >
            {f}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-xs text-gray-600">
        Built for DeFi Mullet Hackathon #1 &middot; Powered by LI.FI
      </div>
    </div>
  );
}
