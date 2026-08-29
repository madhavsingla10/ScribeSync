import React from 'react';

export function Header() {
  return (
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
  );
}
