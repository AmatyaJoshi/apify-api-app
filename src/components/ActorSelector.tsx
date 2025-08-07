'use client';

import { useState, useEffect } from 'react';
import { Search, Settings, User, ArrowLeft, ChevronDown } from 'lucide-react';
import { Actor, User as UserType } from '@/types/apify';

interface ActorSelectorProps {
  apiKey: string;
  onActorSelect: (actor: Actor) => void;
  onApiKeyChange: () => void;
}

export default function ActorSelector({ apiKey, onActorSelect, onApiKeyChange }: ActorSelectorProps) {
  const [actors, setActors] = useState<Actor[]>([]);
  const [filteredActors, setFilteredActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'my' | 'store'>('my');
  const [sortBy, setSortBy] = useState<'name' | 'title' | 'recent'>('title');
  const [user, setUser] = useState<UserType | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    fetchActors();
    fetchUserInfo();
  }, [apiKey, view]);

  useEffect(() => {
    if (apiKey && !user) {
      fetchUserInfo();
    }
  }, [apiKey]);

  const fetchUserInfo = async () => {
    try {
      setUserLoading(true);
      const response = await fetch('/api/user', {
        headers: {
          'x-apify-token': apiKey,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Fetched user data:', userData.data);
        console.log('Avatar URL received:', userData.data.profile.avatarUrl);
        setUser(userData.data);
      }
    } catch (err) {
      console.error('Failed to fetch user info:', err);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    const filtered = actors.filter(actor =>
      actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actor.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // If there's a search term, sort by relevance first, then by selected sort
    if (searchTerm.trim()) {
      filtered.sort((a, b) => {
        // Calculate relevance scores
        const getRelevanceScore = (actor: Actor) => {
          const searchLower = searchTerm.toLowerCase();
          const titleLower = actor.title.toLowerCase();
          const nameLower = actor.name.toLowerCase();
          const descLower = actor.description.toLowerCase();

          // Exact title match gets highest score
          if (titleLower === searchLower) return 1000;
          if (nameLower === searchLower) return 900;

          // Title starts with search term
          if (titleLower.startsWith(searchLower)) return 800;
          if (nameLower.startsWith(searchLower)) return 700;

          // Title includes search term
          if (titleLower.includes(searchLower)) return 600;
          if (nameLower.includes(searchLower)) return 500;

          // Description includes search term
          if (descLower.includes(searchLower)) return 100;

          return 0;
        };

        const scoreA = getRelevanceScore(a);
        const scoreB = getRelevanceScore(b);

        // If relevance scores are different, sort by relevance (higher first)
        if (scoreA !== scoreB) {
          return scoreB - scoreA;
        }

        // If relevance scores are equal, apply secondary sort
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'title':
            return a.title.localeCompare(b.title);
          case 'recent':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
    } else {
      // No search term, just sort normally
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'title':
            return a.title.localeCompare(b.title);
          case 'recent':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
    }

    setFilteredActors(filtered);
  }, [actors, searchTerm, sortBy]);

  const fetchActors = async () => {
    try {
      setLoading(true);
      setError('');

      let response;
      if (view === 'my') {
        response = await fetch('/api/actors', {
          headers: {
            'x-apify-token': apiKey,
          },
        });
      } else {
        response = await fetch('/api/store-actors');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch actors');
      }
      setActors(data.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleActorClick = async (actor: Actor) => {
    try {
      setError(''); // Clear any previous errors

      // Encode the actor ID to handle special characters like slashes
      const encodedId = encodeURIComponent(actor.id);

      console.log('Fetching schema for actor:', actor.name, 'ID:', actor.id);

      // Fetch actor schema
      const response = await fetch(`/api/actors/${encodedId}`, {
        headers: {
          'x-apify-token': apiKey,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch actor schema');
      }

      console.log('Actor schema fetched successfully:', {
        actorName: data.data.name,
        hasInputSchema: !!data.data.inputSchema,
        schemaPropertiesCount: Object.keys(data.data.inputSchema?.properties || {}).length
      });

      onActorSelect(data.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={onApiKeyChange}
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group mr-4"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                  <span className="text-sm font-medium">Back</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Apify Actor Executor</h1>
                  <p className="text-sm text-slate-400">Execute web scraping actors with intelligent configuration</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-6"></div>
            <p className="text-2xl font-medium text-white mb-2">Loading Actors</p>
            <p className="text-slate-400">Fetching available actors from your account...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={onApiKeyChange}
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group mr-4"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                  <span className="text-sm font-medium">Back</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Apify Actor Executor</h1>
                  <p className="text-sm text-slate-400">Execute web scraping actors with intelligent configuration</p>
                </div>
              </div>
              <button
                onClick={onApiKeyChange}
                className="flex items-center text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 px-4 py-2.5 rounded-xl border border-slate-600/50 backdrop-blur-sm transition-all duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-0.5" />
                Change Credentials
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-20 bg-red-950/20 rounded-2xl border border-red-800/30">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-medium text-white mb-2">Failed to Load Actors</p>
            <p className="text-red-300 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => fetchActors()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }
  if (actors.length === 0 && !loading && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={onApiKeyChange}
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group mr-4"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                  <span className="text-sm font-medium">Back</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Apify Actor Executor</h1>
                  <p className="text-sm text-slate-400">Execute web scraping actors with intelligent configuration</p>
                </div>
              </div>
              <button
                onClick={onApiKeyChange}
                className="flex items-center text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 px-4 py-2.5 rounded-xl border border-slate-600/50 backdrop-blur-sm transition-all duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-0.5" />
                Change Credentials
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-2xl font-medium text-white mb-2">No Actors Available</p>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              You don&apos;t have any actors yet. Create your first actor to get started with web scraping.
            </p>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onApiKeyChange}
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group mr-4"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Apify Actor Executor</h1>
                <p className="text-sm text-slate-400">Execute web scraping actors with intelligent configuration</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* User Avatar and Info */}
              {user && (
                <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-600/50">
                  <img
                    src={user.profile.avatarUrl}
                    alt={user.profile.name}
                    className="w-8 h-8 rounded-full bg-slate-700"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{user.profile.name}</p>
                    <p className="text-xs text-slate-400 uppercase">
                      {typeof user.plan === 'string' ? user.plan : user.plan?.id || 'FREE'}
                    </p>
                  </div>
                </div>
              )}

              {userLoading && (
                <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-600/50">
                  <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse"></div>
                  <div className="text-left">
                    <div className="w-16 h-3 bg-slate-700 rounded animate-pulse mb-1"></div>
                    <div className="w-10 h-2 bg-slate-700 rounded animate-pulse"></div>
                  </div>
                </div>
              )}

              <button
                onClick={onApiKeyChange}
                className="flex items-center text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 px-4 py-2.5 rounded-xl border border-slate-600/50 backdrop-blur-sm transition-all duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-0.5" />
                Change Credentials
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="flex gap-3">
            <button
              className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 ${view === 'my'
                ? 'bg-blue-600 text-white shadow-blue-500/25'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              onClick={() => setView('my')}
            >
              My Actors
            </button>
            <button
              className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 ${view === 'store'
                ? 'bg-purple-600 text-white shadow-purple-500/25'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              onClick={() => setView('store')}
            >
              Apify Store
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search actors by name, description, or functionality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 text-white placeholder-slate-400 backdrop-blur-sm transition-all shadow-lg"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'title' | 'recent')}
                className="appearance-none bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-4 pr-10 text-white cursor-pointer hover:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 backdrop-blur-sm transition-all shadow-lg"
              >
                <option value="title">Sort by Title</option>
                <option value="name">Sort by Name</option>
                <option value="recent">Sort by Recent</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Actors Grid */}
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredActors.length === 0 ? (
            <div className="col-span-full text-center py-16 text-slate-400 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <Search className="w-16 h-16 mx-auto mb-4 text-slate-500" />
              <p className="text-xl font-medium mb-2">No actors found</p>
              <p className="text-slate-500">Try adjusting your search terms or browse different categories</p>
            </div>
          ) : (
            filteredActors.map((actor) => (
              <div
                key={actor.id}
                onClick={() => handleActorClick(actor)}
                className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-slate-700/40 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 flex flex-col h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors text-lg leading-tight">
                        {actor.title}
                      </h3>
                      <div className="flex items-center text-sm text-slate-400 mb-3">
                        <User className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="bg-slate-700/50 px-2 py-1 rounded-lg text-xs font-mono">
                          {actor.username}/{actor.name}
                        </span>
                      </div>
                    </div>
                    <Settings className="w-6 h-6 text-slate-500 ml-4 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                  </div>

                  <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed mb-4 flex-grow">
                    {actor.description || "No description available"}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 mt-auto">
                    <span>Click to configure</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800/30 backdrop-blur-sm rounded-xl px-6 py-3 border border-slate-700/50">
            <span className="text-slate-400">Showing</span>
            <span className="text-blue-400 font-semibold">{filteredActors.length}</span>
            <span className="text-slate-400">of</span>
            <span className="text-blue-400 font-semibold">{actors.length}</span>
            <span className="text-slate-400">available actors</span>
          </div>
        </div>
      </main>
    </div>
  );
}
