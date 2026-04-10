import { NextRequest } from 'next/server';
import { EARN_API_BASE } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const params = new URLSearchParams();

  const chainId = searchParams.get('chainId');
  const cursor = searchParams.get('cursor');
  if (chainId) params.set('chainId', chainId);
  if (cursor) params.set('cursor', cursor);

  const url = `${EARN_API_BASE}/v1/earn/vaults${params.toString() ? '?' + params.toString() : ''}`;

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    return Response.json(
      { error: 'Failed to fetch vaults' },
      { status: res.status },
    );
  }

  const data = await res.json();
  return Response.json(data);
}
