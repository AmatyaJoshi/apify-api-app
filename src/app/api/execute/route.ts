import { NextRequest, NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

interface ExecuteRequest {
  actorId: string;
  input?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-apify-token');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    const { actorId, input }: ExecuteRequest = await request.json();

    console.log('Executing actor:', { actorId, input });

    if (!actorId) {
      return NextResponse.json(
        { error: 'Actor ID is required' },
        { status: 400 }
      );
    }

    const client = new ApifyClient({ token: apiKey });

    // Process input to ensure required fields are present
    let processedInput = input || {};

    // Fix pseudoUrls format - Web Scraper requires objects, not strings
    if (processedInput.pseudoUrls && Array.isArray(processedInput.pseudoUrls)) {
      processedInput.pseudoUrls = processedInput.pseudoUrls.map((item: any) => {
        if (typeof item === 'string') {
          return { purl: item };
        }
        return item;
      });
    }

    // Check if user explicitly wants to use proxies
    const useProxies = processedInput.useProxies === true;

    // Apply performance optimizations for faster execution
    if (actorId === 'apify/web-scraper' || actorId === 'moJRLRc85AitArpNN') {
      // Apply speed optimizations if not explicitly set by user
      const speedOptimizations = {
        // Reduce timeouts for faster execution
        pageLoadTimeoutSecs: processedInput.pageLoadTimeoutSecs || 20,
        pageFunctionTimeoutSecs: processedInput.pageFunctionTimeoutSecs || 15,

        // Limit crawling for faster results
        maxPagesPerCrawl: processedInput.maxPagesPerCrawl || 3,
        maxCrawlingDepth: processedInput.maxCrawlingDepth || 1,
        maxResultsPerCrawl: processedInput.maxResultsPerCrawl || 10,

        // Optimize concurrency
        maxConcurrency: processedInput.maxConcurrency || 8,

        // Skip unnecessary downloads for speed
        downloadMedia: processedInput.downloadMedia !== undefined ? processedInput.downloadMedia : false,
        downloadCss: processedInput.downloadCss !== undefined ? processedInput.downloadCss : false,

        // Reduce retries for faster failure detection
        maxRequestRetries: processedInput.maxRequestRetries || 1,

        // Optimize navigation
        navigationTimeoutSecs: processedInput.navigationTimeoutSecs || 15,
        requestTimeoutSecs: processedInput.requestTimeoutSecs || 15,
      };

      // Apply optimizations only if user hasn't explicitly set them
      Object.keys(speedOptimizations).forEach(key => {
        if (processedInput[key] === undefined) {
          processedInput[key] = speedOptimizations[key as keyof typeof speedOptimizations];
        }
      });

      console.log('[Execute] Applied speed optimizations for faster execution');
    }

    // For Web Scraper, proxy configuration is required by Apify
    if (actorId === 'apify/web-scraper' || actorId === 'moJRLRc85AitArpNN') {
      if (useProxies) {
        console.log('[Execute] Using proxy configuration for Web Scraper (will consume credits)');
        processedInput.proxyConfiguration = {
          useApifyProxy: true,
          apifyProxyGroups: ["BUYPROXIES94952"]
        };
      } else {
        // Try without proxies first - may fail for some websites
        console.log('[Execute] Attempting Web Scraper without proxies (no credit consumption)');
        delete processedInput.proxyConfiguration;
      }
      // Remove the useProxies flag as it's not part of actor input
      delete processedInput.useProxies;
    } else {
      // For other actors, remove proxy configuration unless explicitly requested
      if (!useProxies && processedInput.proxyConfiguration !== undefined) {
        delete processedInput.proxyConfiguration;
        console.log('[Execute] Removed proxy configuration to preserve credits');
      }
      delete processedInput.useProxies;
    }

    // Ensure startUrls is an array of objects with url property
    if (processedInput.startUrls && Array.isArray(processedInput.startUrls)) {
      processedInput.startUrls = processedInput.startUrls.map((item: any) => {
        if (typeof item === 'string') {
          return { url: item };
        }
        return item;
      });
    }

    console.log('Processed input:', JSON.stringify(processedInput, null, 2));

    // Start the actor run
    const run = await client.actor(actorId).call(processedInput);

    // Wait for the run to finish
    const finishedRun = await client.run(run.id).waitForFinish();

    // Get the results from the default dataset
    const dataset = await client.dataset(finishedRun.defaultDatasetId).listItems();

    // If the run failed, try to get error details
    let errorDetails = null;
    if (finishedRun.status === 'FAILED') {
      try {
        // Get the log to find error details
        const log = await client.log(run.id).get();
        errorDetails = {
          exitCode: finishedRun.exitCode,
          statusMessage: finishedRun.statusMessage,
          lastLogLines: log ? log.split('\n').slice(-10) : []
        };
      } catch (logError) {
        console.warn('Could not fetch log details:', logError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        runId: run.id,
        status: finishedRun.status,
        results: dataset.items,
        errorDetails,
        stats: {
          itemCount: dataset.items.length,
          executionTime: finishedRun.stats?.runTimeSecs || 0,
        }
      }
    });
  } catch (error: unknown) {
    console.error('Error executing actor:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to execute actor';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
