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
      // Get the actor basic info first
      console.log('Fetching actor basic info...');
      const actor = await client.actor(id).get();

      if (actor) {
        console.log('Found actor:', {
          id: actor.id,
          name: actor.name,
          title: actor.title
        });

        // Try to get the input schema from builds using direct API calls
        let inputSchema: JsonSchema | null = null;

        try {
          console.log('Trying to fetch schema from source code...');

          // Force recompilation - First, try to get it from the actor's source code
          const sourceResponse = await fetch(`https://api.apify.com/v2/acts/${actor.id}?token=${apiKey}`);

          if (sourceResponse.ok) {
            const sourceData = await sourceResponse.json();
            console.log('Source data keys:', sourceData.data ? Object.keys(sourceData.data) : []);

            if (sourceData.data?.inputSchema) {
              inputSchema = sourceData.data.inputSchema as JsonSchema;
              console.log('Found schema in actor source:', {
                title: inputSchema.title,
                type: inputSchema.type,
                hasProperties: !!inputSchema.properties,
                properties: inputSchema.properties ? Object.keys(inputSchema.properties).length : 0
              });
            } else {
              console.log('No inputSchema in actor source, checking defaultRunOptions');
              if (sourceData.data?.defaultRunOptions?.input) {
                console.log('Found defaultRunOptions.input:', Object.keys(sourceData.data.defaultRunOptions.input));
              }
            }
          }

        } catch (buildError: unknown) {
          const errorMessage = buildError instanceof Error ? buildError.message : 'Unknown error';
          console.log('Error fetching source schema:', errorMessage);
        }

        // Fallback: Try to get schema from builds if source didn't have it
        if (!inputSchema) {
          try {
            console.log('Trying to fetch build schema using API...');

            // Use direct API call to get builds since the client methods are complex
            const buildsResponse = await fetch(`https://api.apify.com/v2/acts/${actor.id}/builds`, {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
            });

            if (buildsResponse.ok) {
              const buildsData = await buildsResponse.json();

              if (buildsData.data && buildsData.data.items && buildsData.data.items.length > 0) {
                const latestBuild = buildsData.data.items[0];
                console.log('Found latest build:', latestBuild.id);

                // Get the specific build details
                const buildResponse = await fetch(`https://api.apify.com/v2/acts/${actor.id}/builds/${latestBuild.id}`, {
                  headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                  },
                });

                if (buildResponse.ok) {
                  const buildData = await buildResponse.json();
                  console.log('Build data structure:', {
                    hasData: !!buildData.data,
                    dataKeys: buildData.data ? Object.keys(buildData.data) : [],
                    hasInputSchema: !!buildData.data?.inputSchema,
                    inputSchemaType: typeof buildData.data?.inputSchema,
                    fullBuildData: JSON.stringify(buildData.data, null, 2).substring(0, 1000)
                  });

                  if (buildData.data && buildData.data.inputSchema) {
                    // The inputSchema is often returned as a JSON string, so we need to parse it
                    let parsedSchema: JsonSchema;
                    if (typeof buildData.data.inputSchema === 'string') {
                      try {
                        parsedSchema = JSON.parse(buildData.data.inputSchema);
                        console.log('Parsed inputSchema from JSON string');
                      } catch (parseError) {
                        console.log('Failed to parse inputSchema string:', parseError);
                        parsedSchema = buildData.data.inputSchema as JsonSchema;
                      }
                    } else {
                      parsedSchema = buildData.data.inputSchema as JsonSchema;
                    }

                    inputSchema = parsedSchema;
                    console.log('Found input schema in build:', {
                      title: inputSchema.title,
                      type: inputSchema.type,
                      hasProperties: !!inputSchema.properties,
                      properties: inputSchema.properties ? Object.keys(inputSchema.properties).length : 0,
                      schemaVersion: inputSchema.schemaVersion
                    });
                  } else {
                    console.log('No input schema found in build details');
                  }
                }
              }
            }

          } catch (buildError: unknown) {
            const errorMessage = buildError instanceof Error ? buildError.message : 'Unknown error';
            console.log('Error fetching build schema:', errorMessage);
          }
        }

        // Fallback: Try to get schema from actor versions
        if (!inputSchema) {
          try {
            console.log('Trying to get schema from versions API...');
            const versionsResponse = await fetch(`https://api.apify.com/v2/acts/${actor.id}/versions`, {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
            });

            if (versionsResponse.ok) {
              const versionsData = await versionsResponse.json();

              if (versionsData.data && versionsData.data.items && versionsData.data.items.length > 0) {
                const latestVersion = versionsData.data.items[0];
                console.log('Found latest version:', latestVersion.versionNumber);

                // Get version details
                const versionResponse = await fetch(`https://api.apify.com/v2/acts/${actor.id}/versions/${latestVersion.versionNumber}`, {
                  headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                  },
                });

                if (versionResponse.ok) {
                  const versionData = await versionResponse.json();
                  console.log('Version data structure:', {
                    hasData: !!versionData.data,
                    dataKeys: versionData.data ? Object.keys(versionData.data) : [],
                    hasInputSchema: !!versionData.data?.inputSchema,
                    inputSchemaType: typeof versionData.data?.inputSchema
                  });

                  if (versionData.data && versionData.data.inputSchema) {
                    // The inputSchema is often returned as a JSON string, so we need to parse it
                    let parsedSchema: JsonSchema;
                    if (typeof versionData.data.inputSchema === 'string') {
                      try {
                        parsedSchema = JSON.parse(versionData.data.inputSchema);
                        console.log('Parsed inputSchema from JSON string in version');
                      } catch (parseError) {
                        console.log('Failed to parse inputSchema string in version:', parseError);
                        parsedSchema = versionData.data.inputSchema as JsonSchema;
                      }
                    } else {
                      parsedSchema = versionData.data.inputSchema as JsonSchema;
                    }

                    inputSchema = parsedSchema;
                    console.log('Found input schema in version:', {
                      title: inputSchema.title,
                      type: inputSchema.type,
                      hasProperties: !!inputSchema.properties,
                      properties: inputSchema.properties ? Object.keys(inputSchema.properties).length : 0,
                      schemaVersion: inputSchema.schemaVersion
                    });
                  }
                }
              }
            }
          } catch (versionError: unknown) {
            const errorMessage = versionError instanceof Error ? versionError.message : 'Unknown error';
            console.log('Error fetching version schema:', errorMessage);
          }
        }

        // If no schema found, create a basic one from example input
        if (!inputSchema) {
          console.log('No schema found, creating basic schema from example input');

          const basicSchema: JsonSchema = {
            title: `${actor.title || actor.name} Input`,
            type: "object",
            schemaVersion: 1,
            properties: {
              startUrls: {
                title: "Start URLs",
                type: "array",
                description: "List of URLs to start scraping from",
                editor: "requestListSources"
              }
            }
          };

          // Try to parse example input to create better schema
          if (actor.exampleRunInput && actor.exampleRunInput.body) {
            try {
              const exampleInput = JSON.parse(actor.exampleRunInput.body);
              if (typeof exampleInput === 'object' && exampleInput !== null) {
                console.log('Generating schema from example input');
                const newProperties: Record<string, any> = {};

                Object.keys(exampleInput).forEach(key => {
                  const value = exampleInput[key];
                  const type = Array.isArray(value) ? 'array' : typeof value;

                  newProperties[key] = {
                    title: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                    type: type,
                    description: `${key} parameter`,
                    ...(type === 'array' ? {
                      items: { type: 'string' },
                      editor: key.toLowerCase().includes('url') ? 'requestListSources' : undefined
                    } : {})
                  };
                });

                basicSchema.properties = newProperties;
              }
            } catch (parseError) {
              console.log('Could not parse example input:', parseError);
            }
          }

          inputSchema = basicSchema;
        }

        return NextResponse.json({
          success: true,
          data: {
            id: actor.id,
            name: actor.name,
            title: actor.title || actor.name,
            description: actor.description || 'No description available',
            inputSchema: inputSchema
          }
        });
      }
    } catch (userTokenError: unknown) {
      const errorMessage = userTokenError instanceof Error ? userTokenError.message : 'Unknown error';
      console.log('Actor not found with user token:', errorMessage);

      return NextResponse.json(
        { error: `Actor '${id}' not found or not accessible. Please check the actor ID and ensure you have access to it.` },
        { status: 404 }
      );
    }

    // If we get here, no actor was found
    console.log('Actor not found:', id);
    return NextResponse.json(
      { error: `Actor '${id}' not found` },
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
