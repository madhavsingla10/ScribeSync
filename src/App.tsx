/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  CheckCircle2, 
  FileCode, 
  Boxes, 
  Loader2, 
  X, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Compass,
  Layers,
  Code,
  Database
} from 'lucide-react';
import { ProcessingView } from './components/ProcessingView';
import { ResultsWorkbench } from './components/ResultsWorkbench';
import { SAMPLE_PRESETS, SamplePreset } from './data/sampleSketches';
import { AnalysisResult, ActiveView } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Client } from '@gradio/client';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [view, setView] = useState<ActiveView>('landing');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track cursor movement across the entire screen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isHovering) setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovering]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    if (!selectedFile.type.match('image/.*')) {
      alert('Please upload an image file (.png, .jpg, .jpeg)');
      return;
    }
    setFile(selectedFile);
    setUrlInput(selectedFile.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handlePresetSelect = (preset: SamplePreset) => {
    setPreview(null);
    setFile(null);
    setUrlInput(preset.name);
    setView('processing');

    // Simulate the neural scanning pipeline for the preset
    setTimeout(() => {
      setResult(preset.result);
      setView('results');
    }, 3800);
  };

  const synthesizeArchitecture = async (useMock = false) => {
    if (!file && !useMock && !urlInput.trim()) {
      fileInputRef.current?.click();
      return;
    }
    
    setView('processing');
    
    try {
      if (useMock || (!file && urlInput.trim())) {
        // Find if user selected a preset or default to e-commerce preset
        const matchedPreset = SAMPLE_PRESETS.find(p => p.name.toLowerCase() === urlInput.toLowerCase()) || SAMPLE_PRESETS[0];
        setTimeout(() => {
          setResult(matchedPreset.result);
          setView('results');
        }, 4200);
        return;
      }

      const GRADIO_URL = (import.meta as any).env?.VITE_GRADIO_URL || 'http://localhost:7860';
      const gradioApp = await Client.connect(GRADIO_URL);
      const gradioResponse = await gradioApp.predict("/analyze", [file]);
      const data = (gradioResponse.data as any)[0] as AnalysisResult;

      // Augment with fallback stats/entities if missing from basic API response
      if (!data.entities) {
        const extractedModels = (data.prismaSchema.match(/model\s+(\w+)/g) || []).map(m => m.replace('model ', ''));
        data.entities = extractedModels.map(name => ({
          name,
          fieldsCount: 5,
          relationships: ['1:N Related']
        }));
      }

      setResult(data);
      setView('results');
    } catch (error: any) {
      console.error('Synthesis error:', error);
      alert(error.message || 'An error occurred during synthesis');
      setView('landing');
    }
  };

  const resetSelection = () => {
    setFile(null);
    setPreview(null);
    setUrlInput('');
  };

  const handleBackToLanding = () => {
    setView('landing');
  };

  const handleNewSynthesis = () => {
    resetSelection();
    setView('landing');
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 150);
  };

  return (
    <div className="relative min-h-screen bg-[#121110] text-[#FAF8F5] font-['Instrument_Sans',sans-serif] overflow-x-hidden selection:bg-stone-700/50">
      {/* Base Background Dot Grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, #33312e 1.25px, transparent 1.25px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* Interactive Cursor-Following Dot Pattern (Covers entire screen area) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0.6,
          backgroundImage: 'radial-gradient(circle, #857f78 1.6px, transparent 1.6px)',
          backgroundSize: '28px 28px',
          maskImage: isHovering 
            ? `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)`
            : 'radial-gradient(550px circle at 50% 35%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)',
          WebkitMaskImage: isHovering 
            ? `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)`
            : 'radial-gradient(550px circle at 50% 35%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, transparent 100%)',
        }}
      />

      {/* Interactive Subtle Cursor Ambient Glow */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(214, 211, 209, 0.04) 0%, transparent 100%)`
        }}
      />

      {/* Ambient Radial Vignette */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, transparent 35%, #121110 90%)'
        }}
      />

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/png, image/jpeg, image/jpg" 
        className="hidden" 
      />

      {/* VIEW 1: PROCESSING SCREEN */}
      {view === 'processing' && (
        <ProcessingView 
          preview={preview}
          fileName={file?.name || urlInput || 'Napkin Architecture'}
          onCancel={() => setView('landing')}
        />
      )}

      {/* VIEW 2: DEDICATED RESULTS WORKBENCH */}
      {view === 'results' && result && (
        <ResultsWorkbench 
          result={result}
          preview={preview}
          fileName={file?.name || urlInput || 'Synthesized Architecture'}
          onBack={handleBackToLanding}
          onNewSynthesis={handleNewSynthesis}
        />
      )}

      {/* VIEW 3: MAIN LANDING CANVAS */}
      {view === 'landing' && (
        <>
          {/* Top Header */}
          <header className="fixed top-0 left-0 right-0 z-30 h-16 flex items-center justify-between px-6 md:px-12 backdrop-blur-sm bg-[#121110]/40">
            <div className="flex items-center gap-3">
              <span className="font-['Big_Shoulders_Display',sans-serif] tracking-[0.2em] text-white font-extrabold text-2xl uppercase select-none">
                SCRIBESYNC
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-['JetBrains_Mono'] uppercase tracking-wider text-stone-400 bg-stone-900/80 border border-stone-800 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                GEMINI VISION & CLOUD RUN
              </span>
            </div>
          </header>

          {/* Main Landing Canvas */}
          <main className="relative z-10 pt-28 pb-48 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center">
            
            {/* Centered Hero Section with Dots Pattern */}
            <section className="relative text-center max-w-4xl mx-auto mt-4 md:mt-8 space-y-4 py-6 px-4">
              {/* Prominent Dots Pattern directly behind headline */}
              <div 
                className="absolute -inset-x-8 -inset-y-12 pointer-events-none -z-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, #48443e 1.5px, transparent 1.5px)',
                  backgroundSize: '28px 28px',
                  maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 80%)',
                  WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 80%)'
                }}
              />

              <h1 className="relative font-['Instrument_Serif',serif] text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#FAF8F5] leading-[1.08]">
                <span className="font-bold">ScribeSync, your intelligent</span>{' '}
                <span className="italic font-normal">software architecture</span>{' '}
                <span className="font-bold">synthesizer</span>
              </h1>
              <p className="relative font-['Instrument_Sans'] text-stone-400 text-sm md:text-base font-normal max-w-xl mx-auto leading-relaxed pt-1">
                Automatically translates whiteboard sketches, flowcharts, and handwritten schemas into code.
              </p>
            </section>

            {/* Feature Information Cards (2-Column Grid) */}
            <section className="w-full max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Card: Comprehensive visual artifact coverage */}
              <div className="bg-[#181715]/80 border border-stone-800/80 rounded-xl p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-white font-semibold text-lg mb-6 tracking-tight">
                    Comprehensive visual artifact coverage.
                  </h2>
                  
                  {/* Item 1 */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#22201d] border border-stone-700/50 flex items-center justify-center text-stone-300 shrink-0 mt-0.5">
                      <FileCode className="w-4 h-4 text-stone-300" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-medium">Whiteboards & Paper Napkins</span>
                      <span className="text-stone-400 text-xs mt-0.5 leading-normal">
                        Handwritten entity-relationship models & flows
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-b border-stone-800/80 my-4" />

                  {/* Item 2 */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#22201d] border border-stone-700/50 flex items-center justify-center text-stone-300 shrink-0 mt-0.5">
                      <Boxes className="w-4 h-4 text-stone-300" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-medium">System Design Flowcharts</span>
                      <span className="text-stone-400 text-xs mt-0.5 leading-normal">
                        Microservices, caches, queues & API topologies
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Card: Deep schemas compiled directly from the sketch */}
              <div className="bg-[#181715]/80 border border-stone-800/80 rounded-xl p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-white font-semibold text-lg mb-6 tracking-tight">
                    Deep schemas compiled directly from the sketch.
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Checkmark Item 1 */}
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="text-stone-400 w-5 h-5 shrink-0 mt-0.5" />
                      <span className="text-white text-sm font-normal leading-snug">
                        Extract relational schemas, keys, and foreign constraints
                      </span>
                    </div>

                    {/* Checkmark Item 2 */}
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="text-stone-400 w-5 h-5 shrink-0 mt-0.5" />
                      <span className="text-white text-sm font-normal leading-snug">
                        Generate type-safe Prisma ORM & PostgreSQL DDL migrations
                      </span>
                    </div>

                    {/* Checkmark Item 3 */}
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="text-stone-400 w-5 h-5 shrink-0 mt-0.5" />
                      <span className="text-white text-sm font-normal leading-snug">
                        Render interactive Mermaid.js architecture diagrams
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </section>

            {/* Ready Napkin Architecture Presets */}
            <section className="w-full max-w-4xl mx-auto mt-8">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-stone-400" />
                  Explore Sample Whiteboard Architectures
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_PRESETS.map((preset) => (
                  <div 
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className="p-4 rounded-xl bg-[#181715]/70 border border-stone-800 hover:border-stone-600 hover:bg-[#201e1b] transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono text-stone-400 uppercase px-2 py-0.5 bg-stone-900 rounded border border-stone-800">
                          {preset.category}
                        </span>
                        <span className="text-xs font-mono text-stone-500 group-hover:text-stone-300 flex items-center gap-1 transition">
                          Synthesize <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white font-['Instrument_Sans']">
                        {preset.name}
                      </h3>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Selected File / Napkin Preview Indicator */}
            {preview && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl mt-6 p-4 rounded-xl bg-stone-900/90 border border-stone-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-700 shrink-0 bg-stone-950">
                    <img src={preview} alt="Sketch upload preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-white truncate">{file?.name || 'Whiteboard Napkin Sketch'}</span>
                    <span className="text-xs font-mono text-emerald-400">Ready for Vision Synthesis</span>
                  </div>
                </div>
                <button 
                  onClick={resetSelection}
                  className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

          </main>

          {/* Floating Fixed Bottom Dock & Search Bar */}
          <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#121110] via-[#121110]/95 to-transparent pt-12 pb-5 px-4 w-full flex flex-col items-center pointer-events-none">
            
            {/* The Pill Container */}
            <div className="w-full max-w-3xl rounded-xl bg-[#1e1d1a]/95 border border-stone-800 px-4 py-2.5 flex items-center gap-3 shadow-2xl backdrop-blur-md pointer-events-auto">
              
              {/* Left Icon (Search / Camera Trigger) */}
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-stone-500 hover:text-stone-300 transition shrink-0"
                title="Upload sketch file"
              >
                <Camera className="w-5 h-5" />
              </button>

              {/* Monospace Input / Action Zone */}
              <div 
                className="flex-1 flex items-center gap-2 cursor-pointer min-w-0"
                onClick={() => !file && fileInputRef.current?.click()}
              >
                <input 
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="UPLOAD SKETCH IMAGE OR PASTE A DIAGRAM URL..."
                  className="font-['JetBrains_Mono'] tracking-widest text-xs uppercase text-stone-300 placeholder:text-stone-500 bg-transparent flex-1 focus:outline-none truncate"
                />
              </div>

              {/* Secondary Ghost Button: Demo Napkin */}
              <button 
                type="button"
                onClick={() => synthesizeArchitecture(true)}
                className="hidden sm:inline-flex text-xs font-mono text-stone-400 hover:text-white px-2.5 py-1.5 rounded border border-stone-800 hover:border-stone-700 transition cursor-pointer shrink-0"
              >
                Demo Napkin
              </button>

              {/* Right Action Button: Synthesize */}
              <button 
                type="button"
                onClick={() => synthesizeArchitecture(false)}
                className="rounded-lg bg-[#383531] text-stone-300 hover:bg-stone-200 hover:text-stone-900 transition font-sans font-medium text-sm px-6 py-2 cursor-pointer shrink-0 flex items-center gap-2"
              >
                <span>Synthesize</span>
              </button>
            </div>

            {/* Disclaimer / Footer Note */}
            <p className="font-['JetBrains_Mono'] text-stone-500 text-[11px] mt-3 tracking-wide text-center">
              Gemini Vision can make mistakes, verify schemas before applying production migrations.
            </p>
          </footer>
        </>
      )}

    </div>
  );
}
