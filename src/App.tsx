import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { ProcessingView } from './components/ProcessingView';
import { ResultsWorkbench } from './components/ResultsWorkbench';
import { BackgroundGrid } from './components/BackgroundGrid';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PresetsList } from './components/PresetsList';
import { BottomDock } from './components/BottomDock';
import { SAMPLE_PRESETS, SamplePreset } from './data/sampleSketches';
import { AnalysisResult, ActiveView } from './types';
import { synthesizeSketch } from './services/api';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [view, setView] = useState<ActiveView>('landing');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handlePresetSelect = (preset: SamplePreset) => {
    setPreview(null);
    setFile(null);
    setUrlInput(preset.name);
    setView('processing');
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
        const matchedPreset = SAMPLE_PRESETS.find(p => p.name.toLowerCase() === urlInput.toLowerCase()) || SAMPLE_PRESETS[0];
        setTimeout(() => {
          setResult(matchedPreset.result);
          setView('results');
        }, 4200);
        return;
      }

      if (!file) throw new Error('No file selected');
      const data = await synthesizeSketch(file);
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

  return (
    <div className="relative min-h-screen bg-[#121110] text-[#FAF8F5] font-['Instrument_Sans',sans-serif] overflow-x-hidden selection:bg-stone-700/50">
      <BackgroundGrid />

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/png, image/jpeg, image/jpg" 
        className="hidden" 
      />

      {view === 'processing' && (
        <ProcessingView 
          preview={preview}
          fileName={file?.name || urlInput || 'Napkin Architecture'}
          onCancel={() => setView('landing')}
        />
      )}

      {view === 'results' && result && (
        <ResultsWorkbench 
          result={result}
          preview={preview}
          fileName={file?.name || urlInput || 'Synthesized Architecture'}
          onBack={() => setView('landing')}
          onNewSynthesis={() => {
            resetSelection();
            setView('landing');
            setTimeout(() => fileInputRef.current?.click(), 150);
          }}
        />
      )}

      {view === 'landing' && (
        <>
          <Header />
          <main className="relative z-10 pt-28 pb-48 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center">
            <Hero />
            <PresetsList onSelectPreset={handlePresetSelect} />

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

          <BottomDock 
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            onUploadClick={() => fileInputRef.current?.click()}
            onSynthesize={synthesizeArchitecture}
          />
        </>
      )}
    </div>
  );
}
