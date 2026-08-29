import React, { useState } from 'react';
import { X, User, Mail, Sparkles, LogOut, ArrowRight, Shield } from 'lucide-react';
import { UserProfile, saveUser } from '../services/history';

interface LoginModalProps {
  user: UserProfile | null;
  onClose: () => void;
  onUserChange: (user: UserProfile | null) => void;
}

export function LoginModal({ user, onClose, onUserChange }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const displayName = name.trim() || email.split('@')[0];
    const newUser: UserProfile = {
      email: email.trim(),
      name: displayName,
      loggedInAt: Date.now()
    };

    saveUser(newUser);
    onUserChange(newUser);
    onClose();
  };

  const handleLogout = () => {
    saveUser(null);
    onUserChange(null);
    onClose();
  };

  const handleGuestLogin = () => {
    const guestUser: UserProfile = {
      email: 'guest@scribesync.dev',
      name: 'Architect Guest',
      loggedInAt: Date.now()
    };
    saveUser(guestUser);
    onUserChange(guestUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#181715] border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#FAF8F5]">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-['Big_Shoulders_Display',sans-serif] tracking-wider text-xl font-bold uppercase text-white">
                {user ? 'Architect Profile' : 'Sign In to ScribeSync'}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {user ? (
          /* Logged In View */
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-stone-400 uppercase">Current Session</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Active
                </span>
              </div>
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs font-mono text-stone-400">{user.email}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 px-4 rounded-xl border border-red-900/50 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-xs font-mono flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        ) : (
          /* Sign In Form */
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-stone-400 uppercase mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="architect@domain.com"
                    className="w-full bg-stone-900/90 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-stone-600 font-mono"
                  />
                  <Mail className="w-4 h-4 text-stone-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-stone-400 uppercase mb-1">Name (Optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Principal Architect"
                  className="w-full bg-stone-900/90 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-stone-600 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-stone-200 text-stone-900 hover:bg-white font-medium text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
            >
              <span>Continue with Email</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-stone-800" />
              <span className="flex-shrink mx-3 text-[10px] font-mono uppercase text-stone-600">or</span>
              <div className="flex-grow border-t border-stone-800" />
            </div>

            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-800 bg-stone-900/60 hover:bg-stone-900 text-stone-300 text-xs font-mono flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Guest Mode</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
