import { NextRequest, NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-apify-token');
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    const { actorId, input } = await request.json();

    console.log('Executing actor:', { actorId, input });

    if (!actorId) {
      return NextResponse.json(
        { error: 'Actor ID is required' },
        { status: 400 }
      );
    }

    const client = new ApifyClient({ token: apiKey });
    
    // Start the actor run
    const run = await client.actor(actorId).call(input || {});

    // Wait for the run to finish
    const finishedRun = await client.run(run.id).waitForFinish();

    // Get the results from the default dataset
    const dataset = await client.dataset(finishedRun.defaultDatasetId).listItems();

    return NextResponse.json({
      success: true,
      data: {
        runId: run.id,
        status: finishedRun.status,
        results: dataset.items,
        stats: {
          itemCount: dataset.items.length,
          executionTime: finishedRun.stats?.runTimeSecs || 0,
        }
      }
    });
  } catch (error: any) {
    console.error('Error executing actor:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to execute actor' },
      { status: 500 }
    );
  }
}
