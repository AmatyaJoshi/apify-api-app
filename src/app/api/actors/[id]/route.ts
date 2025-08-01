import { NextRequest, NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { JsonSchema } from '@/types/apify';

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface ActorWithSchema {
  id: string;
  name: string;
  title?: string;
  description?: string;
  inputSchema?: JsonSchema;
  [key: string]: unknown;
}

interface StoreActorResponse {
  id: string;
  name: string;
  title?: string;
  description?: string;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const apiKey = request.headers.get('x-apify-token');
    const { id: encodedId } = await params;
    
    // Decode the actor ID to handle special characters like slashes
    const id = decodeURIComponent(encodedId);
    console.log('Fetching actor schema for:', id);
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    const client = new ApifyClient({ token: apiKey });
    
    try {
      // First try to get the actor using the user's API token
      console.log('Trying with user API token...');
      const actor = await client.actor(id).get();
      
      if (actor) {
        const actorWithSchema = actor as unknown as ActorWithSchema;
        console.log('Found actor with user token:', { 
          id: actor.id, 
          name: actor.name, 
          title: actor.title,
          hasInputSchema: !!actorWithSchema.inputSchema 
        });
        
        return NextResponse.json({
          success: true,
          data: {
            id: actor.id,
            name: actor.name,
            title: actor.title || actor.name,
            description: actor.description || 'No description available',
            inputSchema: actorWithSchema.inputSchema || {
              title: "Actor Input",
              type: "object",
              schemaVersion: 1,
              properties: {
                startUrls: {
                  title: "Start URLs",
                  type: "array",
                  description: "List of URLs to start scraping from",
                  prefill: [{ url: "https://example.com" }],
                  editor: "requestListSources"
                }
              }
            }
          }
        });
      }
    } catch (userTokenError: unknown) {
      const errorMessage = userTokenError instanceof Error ? userTokenError.message : 'Unknown error';
      console.log('Actor not found with user token, trying public access:', errorMessage);
    }
    
    // If not found with user token, try without authentication for public actors
    try {
      console.log('Trying public access...');
      const publicClient = new ApifyClient();
      const actor = await publicClient.actor(id).get();
      
      if (actor) {
        const actorWithSchema = actor as unknown as ActorWithSchema;
        console.log('Found public actor:', { 
          id: actor.id, 
          name: actor.name, 
          title: actor.title,
          hasInputSchema: !!actorWithSchema.inputSchema 
        });
        
        return NextResponse.json({
          success: true,
          data: {
            id: actor.id,
            name: actor.name,
            title: actor.title || actor.name,
            description: actor.description || 'No description available',
            inputSchema: actorWithSchema.inputSchema || {
              title: "Actor Input",
              type: "object",
              schemaVersion: 1,
              properties: {
                startUrls: {
                  title: "Start URLs",
                  type: "array",
                  description: "List of URLs to start scraping from",
                  prefill: [{ url: "https://example.com" }],
                  editor: "requestListSources"
                }
              }
            }
          }
        });
      }
    } catch (publicError: unknown) {
      const errorMessage = publicError instanceof Error ? publicError.message : 'Unknown error';
      console.log('Public actor access also failed:', errorMessage);
    }

    // If both fail, try to get the actor from the store API
    try {
      console.log('Trying store API...');
      const storeResponse = await fetch(`https://api.apify.com/v2/store/${encodeURIComponent(id)}`);
      
      if (storeResponse.ok) {
        const storeActor: StoreActorResponse = await storeResponse.json();
        console.log('Found actor in store:', storeActor);
        
        return NextResponse.json({
          success: true,
          data: {
            id: storeActor.id,
            name: storeActor.name,
            title: storeActor.title || storeActor.name,
            description: storeActor.description || 'No description available',
            inputSchema: {
              title: `${storeActor.title || storeActor.name} Input`,
              type: "object",
              schemaVersion: 1,
              properties: {
                startUrls: {
                  title: "Start URLs",
                  type: "array",
                  description: "List of URLs to start scraping from",
                  prefill: [{ url: "https://example.com" }],
                  editor: "requestListSources"
                }
              }
            }
          }
        });
      }
    } catch (storeError: unknown) {
      const errorMessage = storeError instanceof Error ? storeError.message : 'Unknown error';
      console.log('Store API access failed:', errorMessage);
    }

    console.log('Actor not found in any source:', id);
    return NextResponse.json(
      { error: `Actor '${id}' not found or not accessible` },
      { status: 404 }
    );
  } catch (error: unknown) {
    console.error('Error fetching actor schema:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch actor schema';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
