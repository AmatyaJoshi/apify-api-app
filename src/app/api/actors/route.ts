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
      data: actors.items.map((actor) => ({
        id: actor.id,
        name: actor.name,
        title: (actor as unknown as Record<string, unknown>).title as string || actor.name,
        description: (actor as unknown as Record<string, unknown>).description as string || 'No description available',
        username: actor.username,
      }))
    });
  } catch (error: unknown) {
    console.error('Error fetching actors:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch actors';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
