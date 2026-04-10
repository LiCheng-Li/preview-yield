import type { VaultWithQuote } from '@/types/vault';

export function buildExplainPrompt(
  options: VaultWithQuote[],
  amount: string,
  asset: string,
  priority: string,
): string {
  const optionLines = options
    .map(
      (o, i) =>
        `Option ${i + 1}: ${o.vault.protocol.name} on ${o.vault.network}, APY ${(o.vault.analytics.apy.total * 100).toFixed(2)}%, cost $${o.totalCostUSD.toFixed(2)}, ${o.stepCount} step(s) — "${o.stepsDescription}"`,
    )
    .join('\n');

  return `Given these ${options.length} yield options for ${amount} ${asset}, generate a 1-2 sentence recommendation reason for each. Focus on: why this option fits the user's priority (${priority}), compare cost/steps/APY tradeoffs. Write for a normal person, not a DeFi expert. Use simple language.

${optionLines}

Respond as JSON array of strings, one per option. Example: ["reason1","reason2","reason3"]`;
}

export async function fetchExplanations(
  options: VaultWithQuote[],
  amount: string,
  asset: string,
  priority: string,
): Promise<string[]> {
  const prompt = buildExplainPrompt(options, amount, asset, priority);

  const res = await fetch('/api/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    console.error('Explain API failed:', res.status);
    return options.map(() => '');
  }

  const data = await res.json();
  return data.reasons ?? options.map(() => '');
}
