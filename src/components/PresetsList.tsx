import React, { useRef } from 'react';
import { Compass, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '../data/sampleSketches';

interface PresetsListProps {
  onSelectPreset: (preset: SamplePreset) => void;
}

export function PresetsList({ onSelectPreset }: PresetsListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto mt-8">
      {/* Section Header with Navigation Controls */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-stone-400" />
          Explore Sample Whiteboard Architectures
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-stone-900/90 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 transition cursor-pointer"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-stone-900/90 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 transition cursor-pointer"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div 
        ref={scrollRef}
        className="flex items-stretch gap-3.5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 px-0.5"
      >
        {SAMPLE_PRESETS.map((preset) => (
          <div 
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className="snap-start shrink-0 w-[280px] sm:w-[320px] p-4 rounded-xl bg-[#181715]/80 border border-stone-800 hover:border-stone-600 hover:bg-[#201e1b] transition cursor-pointer group flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
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
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed line-clamp-2">
                {preset.description}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] font-mono text-stone-500">
              <span>{preset.result.endpoints.length} Routes</span>
              <span>PostgreSQL & Prisma</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
