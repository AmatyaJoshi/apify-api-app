'use client';

import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Shield, Key } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";

interface ApiKeyFormProps {
  onSubmit: (apiKey: string) => void;
  onBack?: () => void;
}

export default function ApiKeyForm({ onSubmit, onBack }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter your Apify API key');
      return;
    }
    if (!apiKey.startsWith('apify_api_')) {
      setError('Invalid API key format. API key should start with "apify_api_"');
      return;
    }
    setError('');
    onSubmit(apiKey.trim());
  };

  return (
    <motion.div
      ref={cardRef}
      className="max-w-lg mx-auto w-full rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl shadow-2xl border border-slate-700/50 p-8 sm:p-10 flex flex-col items-center relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />
      
      <div className="w-full relative z-10">
        <div className="text-center mb-8 sm:mb-10">
          {/* Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
            Connect to Apify
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-md mx-auto">
            Authenticate with your Apify API credentials to access your actors and start automating
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div>
            <label htmlFor="apiKey" className="flex items-center text-sm font-semibold text-gray-200 mb-3">
              <Key className="w-4 h-4 mr-2" />
              API Authentication Key
            </label>
            <div className="relative group">
              <Input
                type={showKey ? 'text' : 'password'}
                id="apiKey"
                value={apiKey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
                placeholder="apify_api_..."
                className="w-full h-14 pr-14 text-white placeholder-gray-400 bg-slate-800/70 border-2 border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all text-base group-hover:border-slate-600/50 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <motion.div
                className="mt-3 text-sm text-red-300 bg-red-900/30 border border-red-800/50 p-3 rounded-lg backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2 flex-shrink-0" />
                  {error}
                </div>
              </motion.div>
            )}
          </div>

          <motion.button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #3B82F6)',
              backgroundSize: '200% 100%',
            }}
          >
            <span className="relative z-10">Authenticate & Continue</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.button>
        </form>

        <div className="mt-8 sm:mt-10 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400 mb-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-600" />
            <span>Need API credentials?</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-600" />
          </div>
          <motion.a
            href="https://console.apify.com/account/integrations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium underline decoration-blue-400/30 hover:decoration-blue-300 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
          >
            Generate API key
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
