import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '../data/sampleSketches';

interface PresetsListProps {
  onSelectPreset: (preset: SamplePreset) => void;
}

export function PresetsList({ onSelectPreset }: PresetsListProps) {
  return (
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
            onClick={() => onSelectPreset(preset)}
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
  );
}
