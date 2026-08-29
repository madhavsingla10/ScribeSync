import React from 'react';
import { X, Clock, Trash2, ArrowRight, Layers, Database, Sparkles, FolderOpen } from 'lucide-react';
import { HistoryItem, clearAllHistory } from '../services/history';

interface HistoryDrawerProps {
  isOpen: boolean;
  history: HistoryItem[];
  onClose: () => void;
  onSelectHistory: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryDrawer({
  isOpen,
  history,
  onClose,
  onSelectHistory,
  onDeleteItem,
  onClearAll
}: HistoryDrawerProps) {
  if (!isOpen) return null;

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div 
        className="w-full max-w-md bg-[#181715] border-l border-stone-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 text-[#FAF8F5]"
      >
        {/* Drawer Header */}
        <div className="h-16 px-6 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h2 className="font-['Big_Shoulders_Display',sans-serif] tracking-wider text-xl font-bold uppercase text-white">
              Architecture History
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearAll}
                className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-stone-900 transition"
                title="Clear all history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-600">
                <FolderOpen className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-stone-300">No architecture syntheses yet</p>
              <p className="text-xs text-stone-500 max-w-xs">
                Upload a napkin sketch or whiteboard photo and your generated schemas will be saved here automatically.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-stone-700 transition group space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {item.preview ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-800 shrink-0 bg-stone-950">
                        <img src={item.preview} alt="Sketch thumbnail" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-400 shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate group-hover:text-stone-200">
                        {item.title}
                      </h3>
                      <span className="text-[11px] font-mono text-stone-500">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-stone-600 hover:text-red-400 transition"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400">
                    <span className="px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800">
                      {item.result.endpoints?.length || 0} Routes
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800">
                      PostgreSQL DDL
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectHistory(item);
                      onClose();
                    }}
                    className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
