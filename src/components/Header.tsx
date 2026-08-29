import React from 'react';
import { Clock, User } from 'lucide-react';
import { UserProfile } from '../services/history';

interface HeaderProps {
  user: UserProfile | null;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenLogin: () => void;
}

export function Header({ user, historyCount, onOpenHistory, onOpenLogin }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 flex items-center justify-between px-6 md:px-12 backdrop-blur-sm bg-[#121110]/40">
      <div className="flex items-center gap-3">
        <span className="font-['Big_Shoulders_Display',sans-serif] tracking-[0.2em] text-white font-extrabold text-2xl uppercase select-none">
          SCRIBESYNC
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-stone-300 hover:text-white bg-stone-900/80 hover:bg-stone-800 border border-stone-800 rounded-lg transition"
          title="View synthesis history"
        >
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>History</span>
          {historyCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded bg-stone-800 text-[10px] text-stone-300">
              {historyCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenLogin}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-stone-300 hover:text-white bg-stone-900/80 hover:bg-stone-800 border border-stone-800 rounded-lg transition"
        >
          <User className="w-3.5 h-3.5 text-stone-400" />
          <span>{user ? user.name.split(' ')[0] : 'Sign In'}</span>
        </button>
      </div>
    </header>
  );
}
