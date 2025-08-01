import { NextResponse } from 'next/server';

/**
 * Health check endpoint for monitoring and Docker health checks
 */
export async function GET() {
    try {
        return NextResponse.json(
            {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: process.env.npm_package_version || '1.0.0',
                environment: process.env.NODE_ENV || 'development',
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: 'Health check failed',
            },
            { status: 503 }
        );
    }
}
