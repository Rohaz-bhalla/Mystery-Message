// /app/api/suggest-messages/route.ts

import { getRandomMessages } from '@/lib/spicyMessages';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const randomMessages = getRandomMessages(5);
    const result = randomMessages.join('||');
    
    return NextResponse.json({ messages: result });
  } catch (error) {
    console.error('Error getting random messages:', error);
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Suggest messages API is working' });
}