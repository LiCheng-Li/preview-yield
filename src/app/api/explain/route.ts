import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'Gemini API key not configured' },
      { status: 500 },
    );
  }

  const { prompt } = await request.json();
  if (!prompt) {
    return Response.json({ error: 'Missing prompt' }, { status: 400 });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    console.error('Gemini API error:', err);
    return Response.json(
      { error: 'Gemini API failed' },
      { status: res.status },
    );
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';

  let reasons: string[];
  try {
    reasons = JSON.parse(text);
  } catch {
    console.error('Failed to parse Gemini response:', text);
    reasons = [];
  }

  return Response.json({ reasons });
}
