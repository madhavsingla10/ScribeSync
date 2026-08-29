import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Check, 
  Terminal, 
  Cpu, 
  Scan, 
  Layers, 
  Zap, 
  ShieldCheck, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProcessingViewProps {
  preview: string | null;
  fileName: string | null;
  onCancel: () => void;
}

const LOG_MESSAGES = [
  "⚡ Initializing Gemini 3.7 Flash multimodal vision pipeline...",
  "📐 Rasterizing whiteboard sketch & applying contrast normalization...",
  "🔍 Running spatial contour recognition on hand-drawn boxes...",
  "📝 Parsing handwritten text nodes: detected entities [User, Order, Product, Payment]...",
  "🔗 Trace cardinalities & arrowheads (detected 1:N and 1:1 foreign constraints)...",
  "🛡️ Enforcing referential integrity & cascading delete rules...",
  "💎 Compiling Prisma schema models with standard datatypes (@id, @unique, @default)...",
  "🗄️ Emitting PostgreSQL 14+ compatible DDL migration with optimal B-Tree indexes...",
  "📊 Synthesizing Mermaid.js Entity-Relationship diagram topology...",
  "⚡ Deriving type-safe RESTful API endpoint signatures...",
  "✨ Finalizing architectural synthesis package..."
];

export function ProcessingView({ preview, fileName, onCancel }: ProcessingViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([LOG_MESSAGES[0]]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [nodesDetected, setNodesDetected] = useState(1);
  const [relationsFound, setRelationsFound] = useState(0);

  const steps = [
    { title: "Spatial Contour Scanning", desc: "Isolating drawn nodes & arrows" },
    { title: "Entity & Field Recognition", desc: "Extracting handwritten model names & attributes" },
    { title: "Relational Constraint Graph", desc: "Determining 1:1, 1:N, and N:M cardinalities" },
    { title: "Prisma & SQL DDL Compilation", desc: "Generating type-safe database schemas" },
    { title: "Visual Architecture Synthesis", desc: "Rendering Mermaid topology & API spec" }
  ];

  // Timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => +(prev + 0.1).toFixed(1));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Step progression & dynamic logs
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2200);

    const logInterval = setInterval(() => {
      setLogs(prev => {
        if (prev.length < LOG_MESSAGES.length) {
          return [...prev, LOG_MESSAGES[prev.length]];
        }
        return prev;
      });
      setNodesDetected(prev => Math.min(prev + Math.floor(Math.random() * 2) + 1, 6));
      setRelationsFound(prev => Math.min(prev + Math.floor(Math.random() * 2) + 1, 7));
    }, 1400);

    return () => {
      clearInterval(stepInterval);
      clearInterval(logInterval);
    };
  }, []);

  const progressPercent = Math.min(Math.round(((currentStep + 1) / steps.length) * 100), 96);

  return (
    <div className="fixed inset-0 z-50 bg-[#121110]/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden text-[#FAF8F5]">
      {/* Background Dots */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, #383531 1.25px, transparent 1.25px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* Top Header Bar */}
      <header className="relative z-10 h-16 border-b border-stone-800/80 px-6 md:px-12 flex items-center justify-between bg-[#181715]/60">
        <div className="flex items-center gap-3">
          <span className="font-['Big_Shoulders_Display',sans-serif] tracking-[0.2em] text-white font-extrabold text-2xl uppercase">
            SCRIBESYNC
          </span>
          <span className="text-stone-600">/</span>
          <span className="text-xs font-['JetBrains_Mono'] text-stone-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            NEURAL SYNTHESIS ENGINE
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-[11px] font-mono text-stone-400">
            <span>Latency:</span>
            <span className="text-emerald-400 font-semibold">{elapsedTime}s</span>
          </div>
          
          <button 
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-800 hover:border-stone-700 bg-stone-900/80 text-stone-400 hover:text-white text-xs font-mono transition cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      </header>

      {/* Main Processing Canvas */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col lg:flex-row gap-6 items-stretch justify-center my-auto overflow-hidden">
        
        {/* Left: Sketch Scanner Card */}
        <div className="flex-1 max-w-md w-full bg-[#181715]/80 border border-stone-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-sm">
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-stone-400 tracking-wider flex items-center gap-2">
                <Scan className="w-3.5 h-3.5 text-blue-400" />
                Input Visual Artifact
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                {fileName || 'Whiteboard Napkin'}
              </span>
            </div>

            {/* Thumbnail Canvas with Laser Scanline */}
            <div className="relative w-full h-64 rounded-xl border border-stone-800 bg-[#0e0d0c] overflow-hidden flex items-center justify-center">
              {preview ? (
                <img 
                  src={preview} 
                  alt="Analyzing whiteboard" 
                  className="w-full h-full object-contain filter contrast-125"
                />
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-stone-900/80 border border-stone-700/50 flex items-center justify-center mb-3">
                    <Layers className="w-8 h-8 text-stone-400" />
                  </div>
                  <span className="text-sm font-medium text-stone-300">Whiteboard Architecture Sketch</span>
                  <span className="text-xs text-stone-500 font-mono mt-1">Simulating high-resolution OCR & spatial parsing</span>
                </div>
              )}

              {/* Animated Laser Scanning Line */}
              <motion.div 
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_rgba(96,165,250,0.8)] z-20 pointer-events-none"
                animate={{
                  top: ["0%", "100%", "0%"]
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Grid Overlay on Image */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(to right, #383531 1px, transparent 1px), linear-gradient(to bottom, #383531 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
            </div>
          </div>

          {/* Telemetry Counters */}
          <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-stone-800/80">
            <div className="bg-[#121110] border border-stone-800 p-3 rounded-xl">
              <span className="text-[10px] font-mono text-stone-500 uppercase">Nodes Isolated</span>
              <div className="text-lg font-bold text-white font-mono mt-0.5 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-400" />
                {nodesDetected} entities
              </div>
            </div>
            <div className="bg-[#121110] border border-stone-800 p-3 rounded-xl">
              <span className="text-[10px] font-mono text-stone-500 uppercase">Foreign Keys</span>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {relationsFound} relations
              </div>
            </div>
          </div>
        </div>

        {/* Right: Steps Tracker & Live Terminal Logs */}
        <div className="flex-1 bg-[#181715]/80 border border-stone-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-2xl backdrop-blur-sm">
          
          {/* Header & Overall Progress */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-stone-300 animate-spin" />
                <h2 className="text-lg font-semibold text-white font-['Instrument_Sans']">
                  Synthesis in Progress
                </h2>
              </div>
              <span className="text-xs font-mono text-stone-400 bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-md">
                {progressPercent}% COMPLETE
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#121110] rounded-full h-2 overflow-hidden border border-stone-800 mb-6">
              <motion.div 
                className="bg-gradient-to-r from-stone-400 to-stone-200 h-full rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Stage Steps List */}
            <div className="space-y-3">
              {steps.map((s, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div 
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      isCurrent 
                        ? 'bg-[#22201d] border-stone-700 text-white' 
                        : isDone 
                        ? 'bg-[#121110]/60 border-stone-800/80 text-stone-300' 
                        : 'bg-transparent border-transparent text-stone-600'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-5 h-5 rounded-full bg-blue-950 border border-blue-600 flex items-center justify-center text-blue-400 animate-spin">
                          <Loader2 className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-[10px] font-mono text-stone-600">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs font-medium ${isCurrent ? 'text-white' : isDone ? 'text-stone-300' : 'text-stone-500'}`}>
                        {s.title}
                      </span>
                      <span className="text-[11px] text-stone-500 font-normal">
                        {s.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </main>

      {/* Bottom Processing Footer Note */}
      <footer className="relative z-10 h-12 border-t border-stone-800/80 px-6 flex items-center justify-center bg-[#181715]/40 text-center">
        <p className="font-['JetBrains_Mono'] text-[11px] text-stone-500">
          Compiling production artifacts with Google Gemini 3.7 Flash multimodal vision
        </p>
      </footer>
    </div>
  );
}
