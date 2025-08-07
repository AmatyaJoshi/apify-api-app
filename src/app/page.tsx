'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import LandingPage from '@/components/LandingPage';
import ApiKeyForm from '@/components/ApiKeyForm';
import ActorSelector from '@/components/ActorSelector';
import ActorExecutor from '@/components/ActorExecutor';
import { Actor } from '@/types/apify';

type AppState = 'landing' | 'auth' | 'selector' | 'executor';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);

  const handleGetStarted = () => {
    setAppState('auth');
  };

  const handleBackToLanding = () => {
    setAppState('landing');
  };

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    setSelectedActor(null);
    setAppState('selector');
  };

  const handleActorSelect = (actor: Actor) => {
    setSelectedActor(actor);
    setAppState('executor');
  };

  const handleBack = () => {
    setSelectedActor(null);
    setAppState('selector');
  };

  const handleApiKeyChange = () => {
    setApiKey('');
    setSelectedActor(null);
    setAppState('auth');
  };

  // Show landing page first
  if (appState === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <>
      {appState === 'auth' && (
        <main className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-gray-900 to-black flex flex-col">
          <div className="flex-1 flex flex-col justify-center items-center w-full">
            <div className="w-full max-w-screen-2xl px-4 sm:px-8 xl:px-16 flex flex-col items-center">
              <div className="relative w-full flex justify-center mb-4 sm:mb-6 lg:mb-8 flex-shrink-0">
                <button
                  onClick={handleBackToLanding}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center text-gray-300 hover:text-white transition-all duration-200 group bg-slate-800/30 hover:bg-slate-700/40 px-3 py-2 rounded-lg border border-slate-600/30 hover:border-slate-500/50 backdrop-blur-sm"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </button>
                <div className="text-center">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-1 sm:mb-2 leading-tight">
                    Apify Actor Executor
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto font-normal">
                    Execute web scraping actors with intelligent, schema-driven configuration
                  </p>
                </div>
              </div>
              <div className="w-full flex-1 flex flex-col justify-center items-center">
                <ApiKeyForm
                  onSubmit={handleApiKeySubmit}
                  onBack={handleBackToLanding}
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {appState === 'selector' && (
        <ActorSelector
          apiKey={apiKey}
          onActorSelect={handleActorSelect}
          onApiKeyChange={handleApiKeyChange}
        />
      )}

      {appState === 'executor' && selectedActor && (
        <main className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-auto">
          <ActorExecutor
            actor={selectedActor}
            apiKey={apiKey}
            onBack={handleBack}
          />
        </main>
      )}
    </>
  );
}
