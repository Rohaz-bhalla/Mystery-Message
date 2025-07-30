import { NextResponse } from 'next/server';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST() {
  const { text } = await generateText({
    model: openrouter.chat('anthropic/claude-3.5-sonnet'),
    prompt: `Create a list of three open-ended and engaging questions formatted as a single string. 
Each question should be separated by '||'. 
These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. 
Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.`,
  });

  return NextResponse.json({ text });
}
