import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
  addedAt: number;
}

export interface ContinueWatchingItem extends WatchlistItem {
  season?: number;
  episode?: number;
  progress?: number; // percentage watched
  lastWatchedAt: number;
}

interface WatchlistContextType {
  favorites: WatchlistItem[];
  watchlist: WatchlistItem[];
  continueWatching: ContinueWatchingItem[];
  addToFavorites: (item: WatchlistItem) => void;
  removeFromFavorites: (id: number) => void;
  isFavorite: (id: number) => boolean;
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  addToContinueWatching: (item: ContinueWatchingItem) => void;
  removeFromContinueWatching: (id: number) => void;
  updateProgress: (id: number, progress: number, season?: number, episode?: number) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useLocalStorage<WatchlistItem[]>('favorites', []);
  const [watchlist, setWatchlist] = useLocalStorage<WatchlistItem[]>('watchlist', []);
  const [continueWatching, setContinueWatching] = useLocalStorage<ContinueWatchingItem[]>('continueWatching', []);

  const addToFavorites = (item: WatchlistItem) => {
    setFavorites(prev => {
      if (prev.some(i => i.id === item.id)) return prev;
      return [{ ...item, addedAt: Date.now() }, ...prev];
    });
  };

  const removeFromFavorites = (id: number) => {
    setFavorites(prev => prev.filter(i => i.id !== id));
  };

  const isFavorite = (id: number) => {
    return favorites.some(i => i.id === id);
  };

  const addToWatchlist = (item: WatchlistItem) => {
    setWatchlist(prev => {
      if (prev.some(i => i.id === item.id)) return prev;
      return [{ ...item, addedAt: Date.now() }, ...prev];
    });
  };

  const removeFromWatchlist = (id: number) => {
    setWatchlist(prev => prev.filter(i => i.id !== id));
  };

  const isInWatchlist = (id: number) => {
    return watchlist.some(i => i.id === id);
  };

  const addToContinueWatching = (item: ContinueWatchingItem) => {
    setContinueWatching(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      return [{ ...item, lastWatchedAt: Date.now() }, ...filtered].slice(0, 20); // Keep last 20
    });
  };

  const removeFromContinueWatching = (id: number) => {
    setContinueWatching(prev => prev.filter(i => i.id !== id));
  };

  const updateProgress = (id: number, progress: number, season?: number, episode?: number) => {
    setContinueWatching(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, progress, season, episode, lastWatchedAt: Date.now() }
          : item
      )
    );
  };

  return (
    <WatchlistContext.Provider 
      value={{ 
        favorites, 
        watchlist, 
        continueWatching,
        addToFavorites, 
        removeFromFavorites, 
        isFavorite,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        addToContinueWatching,
        removeFromContinueWatching,
        updateProgress
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
