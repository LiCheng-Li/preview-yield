import type { Quote, Vault } from '@/types/vault';

export async function fetchQuote(
  vault: Vault,
  fromAddress: string,
  fromAmount: string,
  fromChainId?: number,
): Promise<Quote> {
  const underlyingToken = vault.underlyingTokens[0];
  const decimals = underlyingToken.decimals;
  const rawAmount = parseUnits(fromAmount, decimals);

  const params = new URLSearchParams({
    fromChain: String(fromChainId ?? vault.chainId),
    toChain: String(vault.chainId),
    fromToken: underlyingToken.address,
    toToken: vault.address,
    fromAddress,
    toAddress: fromAddress,
    fromAmount: rawAmount,
  });

  const res = await fetch(`/api/quote?${params}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const msg = error.error || error.message || `Quote failed: ${res.status}`;
    console.warn(`[Quote fail] ${vault.protocol.name} on ${vault.network}:`, msg);
    throw new Error(msg);
  }

  return res.json();
}

export function extractQuoteMetrics(quote: Quote) {
  const totalFeeCost = quote.estimate.feeCosts.reduce(
    (sum, f) => sum + parseFloat(f.amountUSD),
    0,
  );
  const totalGasCost = quote.estimate.gasCosts.reduce(
    (sum, g) => sum + parseFloat(g.amountUSD),
    0,
  );
  const totalCostUSD = totalFeeCost + totalGasCost;

  const stepCount = quote.includedSteps.length;

  let stepsDescription: string;
  if (stepCount <= 1) {
    stepsDescription = 'Direct deposit';
  } else if (stepCount === 2) {
    const hasBridge = quote.includedSteps.some(
      (s) => s.type === 'cross' || s.type === 'bridge',
    );
    stepsDescription = hasBridge ? 'Bridge + Deposit' : 'Approve + Deposit';
  } else {
    stepsDescription = 'Bridge + Swap + Deposit';
  }

  return { totalCostUSD, stepCount, stepsDescription };
}

function parseUnits(amount: string, decimals: number): string {
  const [whole = '0', fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  const raw = whole + paddedFraction;
  return raw.replace(/^0+/, '') || '0';
}
