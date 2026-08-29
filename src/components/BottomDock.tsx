import React from 'react';
import { Camera } from 'lucide-react';

interface BottomDockProps {
  urlInput: string;
  setUrlInput: (val: string) => void;
  onUploadClick: () => void;
  onSynthesize: (useMock?: boolean) => void;
}

export function BottomDock({
  urlInput,
  setUrlInput,
  onUploadClick,
  onSynthesize
}: BottomDockProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#121110] via-[#121110]/95 to-transparent pt-12 pb-5 px-4 w-full flex flex-col items-center pointer-events-none">
      <div className="w-full max-w-3xl rounded-xl bg-[#1e1d1a]/95 border border-stone-800 px-4 py-2.5 flex items-center gap-3 shadow-2xl backdrop-blur-md pointer-events-auto">
        <button 
          type="button"
          onClick={onUploadClick}
          className="text-stone-500 hover:text-stone-300 transition shrink-0"
          title="Upload sketch file"
        >
          <Camera className="w-5 h-5" />
        </button>

        <div 
          className="flex-1 flex items-center gap-2 cursor-pointer min-w-0"
          onClick={onUploadClick}
        >
          <input 
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="UPLOAD SKETCH IMAGE OR PASTE A DIAGRAM URL..."
            className="font-['JetBrains_Mono'] tracking-widest text-xs uppercase text-stone-300 placeholder:text-stone-500 bg-transparent flex-1 focus:outline-none truncate"
          />
        </div>

        <button 
          type="button"
          onClick={() => onSynthesize(true)}
          className="hidden sm:inline-flex text-xs font-mono text-stone-400 hover:text-white px-2.5 py-1.5 rounded border border-stone-800 hover:border-stone-700 transition cursor-pointer shrink-0"
        >
          Demo Napkin
        </button>

        <button 
          type="button"
          onClick={() => onSynthesize(false)}
          className="rounded-lg bg-[#383531] text-stone-300 hover:bg-stone-200 hover:text-stone-900 transition font-sans font-medium text-sm px-6 py-2 cursor-pointer shrink-0 flex items-center gap-2"
        >
          <span>Synthesize</span>
        </button>
      </div>

      <p className="font-['JetBrains_Mono'] text-stone-500 text-[11px] mt-3 tracking-wide text-center">
        Gemini Vision can make mistakes, verify schemas before applying production migrations.
      </p>
    </footer>
  );
}
