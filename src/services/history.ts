import { AnalysisResult } from '../types';

export interface HistoryItem {
  id: string;
  timestamp: number;
  title: string;
  preview: string | null;
  fileName: string;
  result: AnalysisResult;
}

export interface UserProfile {
  email: string;
  name: string;
  avatar?: string;
  loggedInAt: number;
}

const STORAGE_KEY_HISTORY = 'scribesync_synthesis_history_v1';
const STORAGE_KEY_USER = 'scribesync_user_profile_v1';

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  } catch (err) {
    console.error('Failed to save user profile', err);
  }
}

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(result: AnalysisResult, preview: string | null, fileName: string): HistoryItem {
  const item: HistoryItem = {
    id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: Date.now(),
    title: result.title || 'Untitled Architecture',
    preview: preview || null,
    fileName: fileName || 'Whiteboard Napkin Sketch',
    result
  };

  try {
    const existing = getHistory();
    // Prepend new item and keep up to 30 most recent
    const updated = [item, ...existing.filter(h => h.title !== item.title || (Date.now() - h.timestamp > 5000))].slice(0, 30);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save history item', err);
  }

  return item;
}

export function deleteHistoryItem(id: string): HistoryItem[] {
  try {
    const updated = getHistory().filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch {}
}
