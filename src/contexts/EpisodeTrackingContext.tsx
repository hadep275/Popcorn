import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface EpisodeProgress {
  showId: number;
  currentSeason: number;
  currentEpisode: number;
  watchedEpisodes: string[]; // Format: "season-episode" e.g., "1-1", "2-5"
  lastWatchedAt: number;
}

interface EpisodeTrackingContextType {
  getShowProgress: (showId: number) => EpisodeProgress | null;
  updateProgress: (showId: number, season: number, episode: number) => void;
  markEpisodeWatched: (showId: number, season: number, episode: number) => void;
  isEpisodeWatched: (showId: number, season: number, episode: number) => boolean;
  getSeasonProgress: (showId: number, season: number, totalEpisodes: number) => { watched: number; total: number; percentage: number };
}

const EpisodeTrackingContext = createContext<EpisodeTrackingContextType | undefined>(undefined);

export function EpisodeTrackingProvider({ children }: { children: ReactNode }) {
  const [tracking, setTracking] = useLocalStorage<Record<string, EpisodeProgress>>('episode-tracking', {});

  const getShowProgress = (showId: number): EpisodeProgress | null => {
    return tracking[showId.toString()] || null;
  };

  const updateProgress = (showId: number, season: number, episode: number) => {
    const key = showId.toString();
    const existing = tracking[key];
    
    setTracking({
      ...tracking,
      [key]: {
        showId,
        currentSeason: season,
        currentEpisode: episode,
        watchedEpisodes: existing?.watchedEpisodes || [],
        lastWatchedAt: Date.now(),
      },
    });
  };

  const markEpisodeWatched = (showId: number, season: number, episode: number) => {
    const key = showId.toString();
    const existing = tracking[key];
    const episodeKey = `${season}-${episode}`;
    
    const watchedEpisodes = existing?.watchedEpisodes || [];
    if (!watchedEpisodes.includes(episodeKey)) {
      setTracking({
        ...tracking,
        [key]: {
          showId,
          currentSeason: season,
          currentEpisode: episode,
          watchedEpisodes: [...watchedEpisodes, episodeKey],
          lastWatchedAt: Date.now(),
        },
      });
    }
  };

  const isEpisodeWatched = (showId: number, season: number, episode: number): boolean => {
    const progress = getShowProgress(showId);
    if (!progress) return false;
    const episodeKey = `${season}-${episode}`;
    return progress.watchedEpisodes.includes(episodeKey);
  };

  const getSeasonProgress = (showId: number, season: number, totalEpisodes: number) => {
    const progress = getShowProgress(showId);
    if (!progress) return { watched: 0, total: totalEpisodes, percentage: 0 };
    
    const watchedInSeason = progress.watchedEpisodes.filter(
      (ep) => ep.startsWith(`${season}-`)
    ).length;
    
    return {
      watched: watchedInSeason,
      total: totalEpisodes,
      percentage: totalEpisodes > 0 ? Math.round((watchedInSeason / totalEpisodes) * 100) : 0,
    };
  };

  return (
    <EpisodeTrackingContext.Provider
      value={{
        getShowProgress,
        updateProgress,
        markEpisodeWatched,
        isEpisodeWatched,
        getSeasonProgress,
      }}
    >
      {children}
    </EpisodeTrackingContext.Provider>
  );
}

export function useEpisodeTracking() {
  const context = useContext(EpisodeTrackingContext);
  if (context === undefined) {
    throw new Error('useEpisodeTracking must be used within an EpisodeTrackingProvider');
  }
  return context;
}
