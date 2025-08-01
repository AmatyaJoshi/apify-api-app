'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Zap, Globe, Code, ArrowRight, Star, Users, Activity } from 'lucide-react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  
  const controls = useAnimation();
  const isInView = useInView(featuresRef, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  useEffect(() => {
    // GSAP animations for scroll-triggered elements
    const ctx = gsap.context(() => {
      // Only animate if elements exist
      const heroSection = document.querySelector('.hero-section');
      const heroBg = document.querySelector('.hero-bg');
      const featureCards = document.querySelectorAll('.feature-card');
      const stepCards = document.querySelectorAll('.step-card');
      const statNumbers = document.querySelectorAll('.stat-number');
      const featuresSection = document.querySelector('.features-section');
      const stepsSection = document.querySelector('.steps-section');
      const statsSection = document.querySelector('.stats-section');

      // Hero background animation - only if elements exist
      if (heroBg && heroSection) {
        gsap.to(heroBg, {
          yPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }

      // Feature cards stagger animation - only if elements exist
      if (featureCards.length > 0 && featuresSection) {
        gsap.fromTo(featureCards, {
          y: 100,
          opacity: 0,
          scale: 0.8
        }, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: featuresSection,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      // Steps animation - only if elements exist
      if (stepCards.length > 0 && stepsSection) {
        gsap.fromTo(stepCards, {
          x: -100,
          opacity: 0,
          rotation: -10
        }, {
          x: 0,
          opacity: 1,
          rotation: 0,
          duration: 1,
          stagger: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stepsSection,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      // Stats counter animation - only if elements exist
      if (statNumbers.length > 0) {
        statNumbers.forEach((stat, index) => {
          const finalValue = index === 0 ? 500 : index === 1 ? 1000000 : 99.9;
          const suffix = index === 0 ? '+' : index === 1 ? 'M+' : '%';
          
          gsap.fromTo(stat, {
            textContent: 0
          }, {
            textContent: finalValue,
            duration: 2,
            delay: 2 + (index * 0.3), // Stagger the animations with delay
            ease: 'power2.out',
            snap: { textContent: index === 2 ? 0.1 : 1 },
            onUpdate: function() {
              const currentValue = parseFloat(this.targets()[0].textContent);
              if (index === 2) {
                stat.textContent = currentValue.toFixed(1) + suffix;
              } else if (index === 1) {
                stat.textContent = (currentValue / 1000000).toFixed(1) + suffix;
              } else {
                stat.textContent = Math.round(currentValue) + suffix;
              }
            }
          });
        });
      }

    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div ref={heroRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Hero Section */}
      <motion.div 
        className="hero-section relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Animated Background Pattern */}
        <div className="hero-bg absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-16 h-16 bg-green-500/10 rounded-full blur-xl"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div 
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Animated Logo */}
            <motion.div 
              className="flex justify-center mb-8"
              variants={itemVariants}
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(59, 130, 246, 0.5)",
                      "0 0 40px rgba(147, 51, 234, 0.5)",
                      "0 0 20px rgba(59, 130, 246, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-10 h-10 text-white" />
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div 
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Animated Headline */}
            <motion.h1 
              className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              variants={itemVariants}
            >
              <motion.span
                className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: "200% 100%" }}
              >
                Apify Actor
              </motion.span>
              <br />
              <motion.span 
                className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Executor
              </motion.span>
            </motion.h1>

            {/* Animated Subtitle */}
            <motion.p 
              className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Execute powerful web scraping and automation actors with a modern, intuitive interface. 
              No code required.
            </motion.p>

            {/* Redesigned Animated CTA Section */}
            <motion.div 
              className="flex flex-col md:flex-row items-center gap-8 justify-center mb-16"
              variants={itemVariants}
            >
              {/* Main CTA Button with Advanced Animations */}
              <motion.button
                onClick={onGetStarted}
                className="group relative px-12 py-6 bg-transparent rounded-2xl font-semibold text-lg transition-all duration-500 overflow-hidden border-2 border-transparent"
                whileHover={{ 
                  scale: 1.05,
                  rotateX: 5,
                  rotateY: 5,
                }}
                whileTap={{ 
                  scale: 0.95,
                  rotateX: 0,
                  rotateY: 0,
                }}
                initial={{ opacity: 0, y: 50, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  delay: 1, 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                style={{ 
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                {/* Animated Background Layers */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                />
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-2xl opacity-0 group-hover:opacity-100"
                  initial={{ scale: 1.2, rotate: -180 }}
                  whileHover={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Glowing border effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)",
                    backgroundSize: "400% 400%",
                    padding: "2px"
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <div className="w-full h-full bg-transparent rounded-2xl" />
                </motion.div>

                {/* Button Content */}
                <span className="relative flex items-center justify-center text-white font-bold tracking-wide z-10">
                  <motion.span
                    className="mr-3"
                    animate={{ 
                      textShadow: [
                        "0 0 0px rgba(255,255,255,0)",
                        "0 0 20px rgba(255,255,255,0.8)",
                        "0 0 0px rgba(255,255,255,0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Get Started Free
                  </motion.span>
                  
                  <motion.div
                    className="relative"
                    animate={{ 
                      x: [0, 8, 0],
                      rotate: [0, 15, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight className="w-6 h-6" />
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0, 0.6, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <ArrowRight className="w-6 h-6 text-cyan-300" />
                    </motion.div>
                  </motion.div>
                </span>

                {/* Particle effects */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
                    style={{
                      top: `${20 + i * 10}%`,
                      left: `${10 + i * 15}%`,
                    }}
                    animate={{
                      y: [-10, -30, -10],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.button>

              {/* Professional Text Element */}
              <motion.div
                className="text-center md:text-left max-w-sm"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 1.3, 
                  duration: 0.7,
                  ease: "easeOut"
                }}
              >
                <motion.h3 
                  className="text-lg font-semibold text-white mb-3 tracking-wide"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                >
                  Start Scraping Today
                </motion.h3>
                <motion.p 
                  className="text-gray-300 text-sm leading-relaxed mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.7, duration: 0.6 }}
                >
                  Deploy production-grade web scraping workflows with zero infrastructure setup. 
                  Trusted by 10,000+ businesses worldwide.
                </motion.p>
                
                {/* Professional badges */}
                <motion.div
                  className="flex items-center justify-center md:justify-start gap-4"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.9, duration: 0.5 }}
                >
                  <motion.div 
                    className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/20"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-xs text-gray-200 font-medium">API First</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/20"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-200 font-medium">SOC2 Compliant</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Animated Stats */}
            <motion.div 
              className="stats-section grid grid-cols-3 gap-8 max-w-md mx-auto"
              variants={itemVariants}
            >
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="stat-number text-2xl font-bold text-blue-400 mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  500+
                </motion.div>
                <div className="text-sm text-gray-400">Actors Available</div>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="stat-number text-2xl font-bold text-purple-400 mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.7, duration: 0.5 }}
                >
                  1M+
                </motion.div>
                <div className="text-sm text-gray-400">Pages Scraped</div>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="stat-number text-2xl font-bold text-green-400 mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.9, duration: 0.5 }}
                >
                  99.9%
                </motion.div>
                <div className="text-sm text-gray-400">Uptime</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        ref={featuresRef}
        className="features-section py-20 bg-slate-800/50 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-30"
          animate={{
            background: [
              "radial-gradient(600px circle at 0% 0%, rgba(59, 130, 246, 0.1), transparent 50%)",
              "radial-gradient(600px circle at 100% 100%, rgba(147, 51, 234, 0.1), transparent 50%)",
              "radial-gradient(600px circle at 0% 100%, rgba(34, 197, 94, 0.1), transparent 50%)",
              "radial-gradient(600px circle at 100% 0%, rgba(59, 130, 246, 0.1), transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Why Choose Our Platform?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Built for developers and businesses who need reliable, scalable web automation
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              className="feature-card group relative p-8 bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden"
              whileHover={{ 
                y: -10,
                borderColor: "rgba(59, 130, 246, 0.5)",
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
              <motion.div 
                className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6 relative z-10"
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "rgba(59, 130, 246, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Globe className="w-6 h-6 text-blue-400" />
                </motion.div>
              </motion.div>
              <h3 className="text-xl font-semibold mb-4 relative z-10">Universal Web Scraping</h3>
              <p className="text-gray-400 leading-relaxed relative z-10">
                Scrape any website with powerful actors. From simple data extraction to complex automation workflows.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="feature-card group relative p-8 bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden"
              whileHover={{ 
                y: -10,
                borderColor: "rgba(147, 51, 234, 0.5)",
                boxShadow: "0 20px 40px rgba(147, 51, 234, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
              <motion.div 
                className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6 relative z-10"
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "rgba(147, 51, 234, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Code className="w-6 h-6 text-purple-400" />
                </motion.div>
              </motion.div>
              <h3 className="text-xl font-semibold mb-4 relative z-10">No Code Required</h3>
              <p className="text-gray-400 leading-relaxed relative z-10">
                Simple URL input or advanced JSON configuration. Choose your preferred level of control.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="feature-card group relative p-8 bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden"
              whileHover={{ 
                y: -10,
                borderColor: "rgba(34, 197, 94, 0.5)",
                boxShadow: "0 20px 40px rgba(34, 197, 94, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
              <motion.div 
                className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-6 relative z-10"
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "rgba(34, 197, 94, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Activity className="w-6 h-6 text-green-400" />
                </motion.div>
              </motion.div>
              <h3 className="text-xl font-semibold mb-4 relative z-10">Real-time Results</h3>
              <p className="text-gray-400 leading-relaxed relative z-10">
                Watch your scraping jobs execute in real-time with detailed progress tracking and instant results.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <motion.div 
        ref={stepsRef}
        className="steps-section py-20 relative overflow-hidden"
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
              "linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
              "linear-gradient(225deg, rgba(34, 197, 94, 0.1) 0%, transparent 50%)",
              "linear-gradient(315deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              How It Works
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Get started in three simple steps
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <motion.div 
              className="step-card text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div className="relative mb-8">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-2xl"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(59, 130, 246, 0.5)",
                      "0 0 40px rgba(59, 130, 246, 0.8)",
                      "0 0 20px rgba(59, 130, 246, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.span 
                    className="text-2xl font-bold text-white"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    1
                  </motion.span>
                </motion.div>
                <motion.div 
                  className="absolute top-0 left-0 w-20 h-20 bg-blue-400/20 rounded-full mx-auto"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Connect Your API
              </motion.h3>
              <motion.p 
                className="text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Enter your Apify API key to access your actors and the Apify Store
              </motion.p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="step-card text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div className="relative mb-8">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-2xl"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(147, 51, 234, 0.5)",
                      "0 0 40px rgba(147, 51, 234, 0.8)",
                      "0 0 20px rgba(147, 51, 234, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <motion.span 
                    className="text-2xl font-bold text-white"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    2
                  </motion.span>
                </motion.div>
                <motion.div 
                  className="absolute top-0 left-0 w-20 h-20 bg-purple-400/20 rounded-full mx-auto"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Choose Your Actor
              </motion.h3>
              <motion.p 
                className="text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Select from your personal actors or browse the Apify Store marketplace
              </motion.p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              className="step-card text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div className="relative mb-8">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(34, 197, 94, 0.5)",
                      "0 0 40px rgba(34, 197, 94, 0.8)",
                      "0 0 20px rgba(34, 197, 94, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <motion.span 
                    className="text-2xl font-bold text-white"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    3
                  </motion.span>
                </motion.div>
                <motion.div 
                  className="absolute top-0 left-0 w-20 h-20 bg-green-400/20 rounded-full mx-auto"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Execute & Get Results
              </motion.h3>
              <motion.p 
                className="text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                Configure parameters and run your actor to get instant, actionable data
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="py-20 bg-gradient-to-r from-blue-900/50 to-purple-900/50 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Animated background particles */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(400px circle at 20% 20%, rgba(59, 130, 246, 0.1), transparent 50%)",
              "radial-gradient(400px circle at 80% 80%, rgba(147, 51, 234, 0.1), transparent 50%)",
              "radial-gradient(400px circle at 20% 80%, rgba(59, 130, 246, 0.1), transparent 50%)",
              "radial-gradient(400px circle at 80% 20%, rgba(147, 51, 234, 0.1), transparent 50%)"
            ]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Ready to Start Scraping?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Join thousands of developers using our platform for web automation
          </motion.p>
          <motion.button
            onClick={onGetStarted}
            className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-xl transition-all duration-300 shadow-2xl overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px rgba(59, 130, 246, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative flex items-center justify-center">
              Start Building Now
              <motion.div
                animate={{ 
                  x: [0, 5, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Play className="ml-3 w-6 h-6" />
              </motion.div>
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer 
        className="py-12 border-t border-slate-800 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              &copy; 2025 Apify Actor Executor. Built with Next.js and Apify.
            </motion.p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
