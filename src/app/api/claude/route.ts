import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { mode, question, patientSummary, constraints } = await req.json();
  const apiKey = process.env.LLM_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ text: `[Mock ${mode}] ${question}\n\nPatient: ${patientSummary}\n\nConstraints:\n${constraints || 'none'}` });
  }

  const system = mode === 'enhanced'
    ? `You are a clinical assistant. Follow these safety constraints strictly:\n${constraints}`
    : 'You are a clinical assistant.';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 400,
      system,
      messages: [{ role: 'user', content: `${patientSummary}\n\nDoctor question: ${question}` }]
    })
  });

  const data = await response.json();
  const text = data?.content?.[0]?.text ?? JSON.stringify(data);
  return NextResponse.json({ text });
}
