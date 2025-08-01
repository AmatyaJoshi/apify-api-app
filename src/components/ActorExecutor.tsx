'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle, XCircle, Clock, Settings } from 'lucide-react';
import { Actor, ExecutionResult } from '@/types/apify';
import DynamicForm from './DynamicForm';

interface ActorExecutorProps {
  actor: Actor;
  apiKey: string;
  onBack: () => void;
}

export default function ActorExecutor({ actor, apiKey, onBack }: ActorExecutorProps) {
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState('');
  const [inputMode, setInputMode] = useState<'form' | 'json' | 'url'>('json');
  const [jsonInput, setJsonInput] = useState(JSON.stringify({
    startUrls: [{ url: 'https://example.com' }],
    pageFunction: `async function pageFunction(context) {
    // Use standard DOM API instead of jQuery
    const title = document.title || document.querySelector('h1')?.textContent || 'No title found';
    const url = context.request.url;
    
    // Get page text content safely
    const bodyText = document.body?.textContent?.trim().substring(0, 500) || 'No content found';
    
    // Extract headings using DOM API
    const headings = [];
    const headingElements = document.querySelectorAll('h1, h2, h3');
    for (let i = 0; i < Math.min(headingElements.length, 5); i++) {
        const headingText = headingElements[i].textContent?.trim();
        if (headingText) headings.push(headingText);
    }
    
    // Extract links using DOM API
    const links = [];
    const linkElements = document.querySelectorAll('a[href]');
    for (let i = 0; i < Math.min(linkElements.length, 10); i++) {
        const linkText = linkElements[i].textContent?.trim();
        const linkUrl = linkElements[i].getAttribute('href');
        if (linkText && linkUrl) {
            links.push({ text: linkText, url: linkUrl });
        }
    }
    
    // Return the extracted data
    return {
        title: title,
        url: url,
        bodyText: bodyText,
        headings: headings,
        links: links,
        timestamp: new Date().toISOString()
    };
}`,
    maxPagesPerCrawl: 5,
    maxCrawlDepth: 1,
    navigationTimeoutSecs: 30,
    requestTimeoutSecs: 30
  }, null, 2));
  const [urlInput, setUrlInput] = useState('https://apify.com');

  // Function to update JSON when URL changes
  const updateJsonFromUrl = (url: string) => {
    const jsonData = {
      startUrls: [{ url: url }],
      pageFunction: `async function pageFunction(context) {
    // Use standard DOM API instead of jQuery
    const title = document.title || document.querySelector('h1')?.textContent || 'No title found';
    const url = context.request.url;
    
    // Get page text content safely
    const bodyText = document.body?.textContent?.trim().substring(0, 500) || 'No content found';
    
    // Extract headings using DOM API
    const headings = [];
    const headingElements = document.querySelectorAll('h1, h2, h3');
    for (let i = 0; i < Math.min(headingElements.length, 5); i++) {
        const headingText = headingElements[i].textContent?.trim();
        if (headingText) headings.push(headingText);
    }
    
    // Extract links using DOM API
    const links = [];
    const linkElements = document.querySelectorAll('a[href]');
    for (let i = 0; i < Math.min(linkElements.length, 10); i++) {
        const linkText = linkElements[i].textContent?.trim();
        const linkUrl = linkElements[i].getAttribute('href');
        if (linkText && linkUrl) {
            links.push({ text: linkText, url: linkUrl });
        }
    }
    
    // Return the extracted data
    return {
        title: title,
        url: url,
        bodyText: bodyText,
        headings: headings,
        links: links,
        timestamp: new Date().toISOString()
    };
}`,
      maxPagesPerCrawl: 5,
      maxCrawlDepth: 1,
      navigationTimeoutSecs: 30,
      requestTimeoutSecs: 30
    };
    setJsonInput(JSON.stringify(jsonData, null, 2));
  };

  // Sync JSON input when URL input changes
  useEffect(() => {
    if (urlInput.trim()) {
      updateJsonFromUrl(urlInput.trim());
    }
  }, [urlInput]);

  const handleExecute = async (input?: Record<string, unknown>) => {
    try {
      setExecuting(true);
      setError('');
      setResult(null);

      let processedInput = input;

      // Handle different input modes
      if (inputMode === 'json') {
        try {
          processedInput = JSON.parse(jsonInput);
        } catch (parseError) {
          throw new Error('Invalid JSON format. Please check your input.');
        }
      } else if (inputMode === 'url') {
        if (!urlInput.trim()) {
          throw new Error('Please enter a URL to scrape');
        }
        processedInput = {
          startUrls: [{ url: urlInput.trim() }],
          pageFunction: `async function pageFunction(context) {
    // Use standard DOM API instead of jQuery
    const title = document.title || document.querySelector('h1')?.textContent || 'No title found';
    const url = context.request.url;
    
    // Get page text content safely
    const bodyText = document.body?.textContent?.trim().substring(0, 500) || 'No content found';
    
    // Extract headings using DOM API
    const headings = [];
    const headingElements = document.querySelectorAll('h1, h2, h3');
    for (let i = 0; i < Math.min(headingElements.length, 5); i++) {
        const headingText = headingElements[i].textContent?.trim();
        if (headingText) headings.push(headingText);
    }
    
    // Extract links using DOM API
    const links = [];
    const linkElements = document.querySelectorAll('a[href]');
    for (let i = 0; i < Math.min(linkElements.length, 10); i++) {
        const linkText = linkElements[i].textContent?.trim();
        const linkUrl = linkElements[i].getAttribute('href');
        if (linkText && linkUrl) {
            links.push({ text: linkText, url: linkUrl });
        }
    }
    
    // Return the extracted data
    return {
        title: title,
        url: url,
        bodyText: bodyText,
        headings: headings,
        links: links,
        timestamp: new Date().toISOString()
    };
}`,
          maxPagesPerCrawl: 5,
          maxCrawlDepth: 1,
          navigationTimeoutSecs: 30,
          requestTimeoutSecs: 30
        };
      } else if (inputMode === 'form' && !input) {
        // If form mode but no input provided, use empty object
        processedInput = {};
      }

      console.log('Executing with processed input:', processedInput);

      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-apify-token': apiKey,
        },
        body: JSON.stringify({
          actorId: actor.id,
          input: processedInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute actor');
      }

      setResult(data.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setExecuting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'RUNNING':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return 'text-green-300 bg-green-900/30 border border-green-700';
      case 'FAILED':
        return 'text-red-300 bg-red-900/30 border border-red-700';
      case 'RUNNING':
        return 'text-blue-300 bg-blue-900/30 border border-blue-700';
      default:
        return 'text-gray-300 bg-gray-800/30 border border-gray-600';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
      {/* Header with gradient border */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 p-6 sm:p-8 border-b border-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onBack}
                className="flex items-center text-gray-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 px-4 py-2.5 rounded-xl border border-slate-600/50 backdrop-blur-sm transition-all duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-0.5" />
                Back to Actor Selection
              </button>
              
              {/* Actor status badge */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-gray-400 font-medium">ACTIVE</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              {/* Actor icon/avatar */}
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">{actor.title}</h2>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-3">{actor.description}</p>
                
                {/* Actor metadata */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    <span>ID: {actor.id}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-purple-400 rounded-full" />
                    <span>Ready to Execute</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 p-6 sm:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 h-full">
          {/* Input Form */}
        <div className="flex flex-col order-2 xl:order-1">
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6 flex flex-col h-full">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex-shrink-0">
              Actor Configuration
            </h3>
            
            {/* Input Mode Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-200 mb-3">Input Method</label>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setInputMode('form')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    inputMode === 'form' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  Dynamic Form
                </button>
                <button
                  onClick={() => setInputMode('url')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    inputMode === 'url' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  URL Input
                </button>
                <button
                  onClick={() => setInputMode('json')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    inputMode === 'json' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  JSON Input
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              {inputMode === 'form' && actor.inputSchema && (
                <DynamicForm
                  schema={actor.inputSchema}
                  onSubmit={handleExecute}
                  loading={executing}
                />
              )}

              {inputMode === 'url' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Website URL to Scrape
                    </label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all"
                      placeholder="https://example.com"
                    />
                    <p className="mt-2 text-xs text-gray-400">Enter the URL of the website you want to scrape</p>
                  </div>
                  <button
                    onClick={() => handleExecute()}
                    disabled={executing || !urlInput.trim()}
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base transition-all transform hover:scale-[1.02] shadow-lg"
                  >
                    {executing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-3" />
                        Execute with URL
                      </>
                    )}
                  </button>
                </div>
              )}

              {inputMode === 'json' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      JSON Configuration
                    </label>
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      rows={12}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all font-mono text-sm scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600"
                      placeholder='{&#10;  "startUrls": [{"url": "https://example.com"}],&#10;  "maxPagesPerCrawl": 10,&#10;  "maxCrawlDepth": 1&#10;}'
                    />
                    <p className="mt-2 text-xs text-gray-400">Enter the complete JSON configuration for the actor</p>
                  </div>
                  <button
                    onClick={() => handleExecute()}
                    disabled={executing}
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base transition-all transform hover:scale-[1.02] shadow-lg"
                  >
                    {executing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-3" />
                        Execute with JSON
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col order-1 xl:order-2">
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6 flex flex-col h-full">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center flex-shrink-0">
              <Play className="w-5 h-5 mr-2 text-green-400 flex-shrink-0" />
              Execution Status & Results
            </h3>
            
            <div className="flex-1 min-h-0 flex flex-col">
              {executing && (
                <div className="border border-slate-600 bg-slate-800/50 rounded-lg p-6 sm:p-8 text-center flex-1 flex flex-col justify-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500 border-t-transparent mb-4 sm:mb-6 mx-auto"></div>
                  <p className="text-gray-300 text-base sm:text-lg">Processing actor execution...</p>
                  <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
                </div>
              )}

              {error && (
                <div className="border border-red-800 rounded-lg p-4 sm:p-6 bg-red-900/20 backdrop-blur-sm">
                  <div className="flex items-center mb-3">
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mr-3 flex-shrink-0" />
                    <span className="font-semibold text-red-300 text-base sm:text-lg">Execution Failed</span>
                  </div>
                  <p className="text-red-200 text-sm bg-red-900/30 p-3 rounded border border-red-800 leading-relaxed">{error}</p>
                </div>
              )}

              {result && (
                <div className="flex-1 min-h-0 flex flex-col gap-4 sm:gap-6">
                  <div className="border border-slate-600 bg-slate-800/50 rounded-lg p-4 sm:p-6 backdrop-blur-sm flex-shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                      <div className="flex items-center">
                        {getStatusIcon(result.status)}
                        <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                          {result.status}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 bg-slate-700/50 px-3 py-1 rounded">
                        Run ID: {result.runId}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 text-sm">
                      <div className="bg-slate-700/30 p-3 sm:p-4 rounded-lg border border-slate-600">
                        <span className="font-medium text-gray-300 block mb-1 text-xs sm:text-sm">Items Extracted</span>
                        <span className="text-xl sm:text-2xl font-bold text-blue-400">{result.stats.itemCount}</span>
                      </div>
                      <div className="bg-slate-700/30 p-3 sm:p-4 rounded-lg border border-slate-600">
                        <span className="font-medium text-gray-300 block mb-1 text-xs sm:text-sm">Execution Time</span>
                        <span className="text-xl sm:text-2xl font-bold text-green-400">{result.stats.executionTime}s</span>
                      </div>
                    </div>
                  </div>

                  {result.results.length > 0 && (
                    <div className="border border-slate-600 bg-slate-800/50 rounded-lg backdrop-blur-sm flex flex-col flex-1 min-h-0">
                      <div className="p-4 sm:p-6 border-b border-slate-600 flex-shrink-0">
                        <h4 className="font-medium text-white text-base sm:text-lg">
                          Extracted Data ({result.results.length} items)
                        </h4>
                      </div>
                      <div className="p-4 sm:p-6 flex-1 min-h-0">
                        <div className="h-full overflow-auto bg-slate-900/50 p-3 sm:p-4 rounded border border-slate-700">
                          <pre className="text-xs sm:text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {JSON.stringify(result.results, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!executing && !error && !result && (
                <div className="border border-slate-600 bg-slate-800/30 rounded-lg p-6 sm:p-8 text-center text-gray-400 flex-1 flex flex-col justify-center">
                  <Settings className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-base sm:text-lg mb-2">Ready for Execution</p>
                  <p className="text-sm text-gray-500">Configure the actor parameters and execute to see results</p>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
