import { NextRequest } from 'next/server';
import { COMPOSER_API_BASE } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const apiKey = process.env.COMPOSER_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'Composer API key not configured' },
      { status: 500 },
    );
  }

  const { searchParams } = request.nextUrl;

  const required = ['fromChain', 'toChain', 'fromToken', 'toToken', 'fromAddress', 'toAddress', 'fromAmount'];
  for (const param of required) {
    if (!searchParams.get(param)) {
      return Response.json(
        { error: `Missing required parameter: ${param}` },
        { status: 400 },
      );
    }
  }

  const params = new URLSearchParams();
  for (const [key, value] of searchParams.entries()) {
    params.set(key, value);
  }

  const url = `${COMPOSER_API_BASE}/v1/quote?${params}`;

  const res = await fetch(url, {
    headers: {
      'x-lifi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Quote request failed' }));
    return Response.json(
      { error: error.message || 'Quote request failed' },
      { status: res.status },
    );
  }

  const data = await res.json();
  return Response.json(data);
}
