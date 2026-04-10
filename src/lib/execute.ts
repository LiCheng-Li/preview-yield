import type { Quote } from '@/types/vault';

export function buildTransactionRequest(quote: Quote) {
  const tx = quote.transactionRequest;
  return {
    to: tx.to as `0x${string}`,
    data: tx.data as `0x${string}`,
    value: BigInt(tx.value),
    chainId: tx.chainId,
    gas: tx.gasLimit ? BigInt(tx.gasLimit) : undefined,
  };
}
