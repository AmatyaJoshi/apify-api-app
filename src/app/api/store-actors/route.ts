import { NextRequest, NextResponse } from 'next/server';

interface StoreActor {
    id: string;
    name: string;
    title?: string;
    description?: string;
    username?: string;
    isPublic?: boolean;
    [key: string]: unknown;
}

interface ApiResponse {
    data: {
        items: StoreActor[];
    };
}

export async function GET(_request: NextRequest) {
    try {
        console.log('Fetching store actors...');

        // Try to fetch popular public actors from the regular Apify API
        const response = await fetch('https://api.apify.com/v2/acts?limit=50&offset=0&desc=true', {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        let storeActors: StoreActor[] = [];

        if (response.ok) {
            const data: ApiResponse = await response.json();
            console.log('Apify API response status:', response.status);

            if (data.data && data.data.items && Array.isArray(data.data.items)) {
                console.log('Found', data.data.items.length, 'actors from API');
                storeActors = data.data.items
                    .filter((actor: StoreActor) => actor.isPublic && actor.id) // Only public actors with valid IDs
                    .slice(0, 20) // Limit to 20 actors
                    .map((actor: StoreActor) => ({
                        id: actor.id,
                        name: actor.name,
                        title: actor.title || actor.name,
                        description: actor.description || 'No description available',
                        username: actor.username,
                        categories: actor.categories || [],
                        stats: actor.stats,
                        isPublic: actor.isPublic
                    }));
                console.log('Processed', storeActors.length, 'public actors');
            }
        } else {
            console.log('Apify API request failed:', response.status, response.statusText);
        }

        // If no actors found from API, provide verified working actors
        if (storeActors.length === 0) {
            console.log('Using fallback actors list');
            storeActors = [
                {
                    id: 'apify/web-scraper',
                    name: 'web-scraper',
                    title: 'Web Scraper',
                    description: 'Crawls arbitrary websites using the Chrome browser and extracts data from pages using a provided JavaScript code. Perfect for scraping SPAs.',
                    username: 'apify',
                    isPublic: true
                },
                {
                    id: 'apify/google-search-results-scraper',
                    name: 'google-search-results-scraper',
                    title: 'Google Search Results Scraper',
                    description: 'Scrape Google Search results for any keyword. Get organic results, ads, shopping results, and more. Fast and reliable.',
                    username: 'apify',
                    isPublic: true
                },
                {
                    id: 'apify/cheerio-scraper',
                    name: 'cheerio-scraper',
                    title: 'Cheerio Scraper',
                    description: 'Fast and efficient web scraper using Cheerio for server-side HTML parsing. Ideal for simple websites.',
                    username: 'apify',
                    isPublic: true
                },
                {
                    id: 'apify/puppeteer-scraper',
                    name: 'puppeteer-scraper',
                    title: 'Puppeteer Scraper',
                    description: 'Advanced web scraper using Puppeteer for complex JavaScript-heavy websites and SPAs.',
                    username: 'apify',
                    isPublic: true
                }
            ];
        }

        return NextResponse.json({
            success: true,
            data: storeActors.map((actor: StoreActor) => ({
                id: actor.id || `${actor.username}/${actor.name}`,
                name: actor.name,
                title: actor.title || actor.name,
                description: actor.description || 'No description available',
                username: actor.username || 'apify',
            }))
        });
    } catch (error: unknown) {
        console.error('Error fetching store actors:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch store actors';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
