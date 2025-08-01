import { NextRequest, NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-apify-token');
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    const client = new ApifyClient({ token: apiKey });
    const actors = await client.actors().list();

    return NextResponse.json({
      success: true,
      data: actors.items.map(actor => ({
        id: actor.id,
        name: actor.name,
        title: (actor as any).title || actor.name,
        description: (actor as any).description || 'No description available',
        username: actor.username,
      }))
    });
  } catch (error: any) {
    console.error('Error fetching actors:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch actors' },
      { status: 500 }
    );
  }
}
