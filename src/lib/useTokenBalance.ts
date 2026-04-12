'use client';

import { useBalance, useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { TOKEN_ADDRESSES } from './constants';

interface BalanceInfo {
  formatted: string;
  raw: bigint;
  decimals: number;
  isLoading: boolean;
  hasBalance: boolean;
  supported: boolean;
}

export function useTokenBalance(asset: string): BalanceInfo {
  const { address, chainId } = useAccount();

  const tokenEntry = chainId ? TOKEN_ADDRESSES[chainId]?.[asset] : undefined;
  const isNative = tokenEntry === 'native';
  const isErc20 = typeof tokenEntry === 'string' && tokenEntry !== 'native';

  const { data, isLoading } = useBalance({
    address,
    token: isErc20 ? (tokenEntry as `0x${string}`) : undefined,
    chainId,
    query: { enabled: !!address && (isNative || isErc20) },
  });

  if (!tokenEntry || !data) {
    return {
      formatted: '0',
      raw: BigInt(0),
      decimals: 18,
      isLoading,
      hasBalance: false,
      supported: !!tokenEntry,
    };
  }

  return {
    formatted: formatUnits(data.value, data.decimals),
    raw: data.value,
    decimals: data.decimals,
    isLoading,
    hasBalance: data.value > BigInt(0),
    supported: true,
  };
}
