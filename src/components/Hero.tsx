import React from 'react';
import { FileCode, Boxes, CheckCircle2 } from 'lucide-react';

export function Hero() {
  return (
    <>
      {/* Centered Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto mt-4 md:mt-8 space-y-4 py-6 px-4">
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
        {/* Left Card: Visual artifact coverage */}
        <div className="bg-[#181715]/80 border border-stone-800/80 rounded-xl p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg mb-6 tracking-tight">
              Comprehensive visual artifact coverage.
            </h2>
            
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

            <div className="border-b border-stone-800/80 my-4" />

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

        {/* Right Card: Schema generation info */}
        <div className="bg-[#181715]/80 border border-stone-800/80 rounded-xl p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg mb-6 tracking-tight">
              Deep schemas compiled directly from the sketch.
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-stone-400 w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-white text-sm font-normal leading-snug">
                  Extract relational schemas, keys, and foreign constraints
                </span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-stone-400 w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-white text-sm font-normal leading-snug">
                  Generate type-safe Prisma ORM & PostgreSQL DDL migrations
                </span>
              </div>

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
    </>
  );
}
