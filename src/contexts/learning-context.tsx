"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { ListenSettings } from "@/types/learning";
import {
  getDefaultListenSettings,
  getFavorites,
  getListenSettings,
  getMastered,
  getStats,
  incrementTodayLearned,
  setFavorites,
  setListenSettings,
  setMastered,
  updateLastPlayback,
  updateRecentCourse,
} from "@/lib/learning-storage";

type LearningContextValue = {
  favorites: string[];
  mastered: string[];
  settings: ListenSettings;
  stats: ReturnType<typeof getStats>;
  loaded: boolean;
  toggleFavorite: (sentenceId: string) => void;
  toggleMastered: (sentenceId: string) => void;
  updateSettings: (settings: Partial<ListenSettings>) => void;
  recordSentenceLearned: (courseSlug: string) => void;
  recordPlayback: (courseSlug: string, sentenceIndex: number) => void;
};

const LearningContext = createContext<LearningContextValue | null>(null);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavoritesState] = useState<string[]>(() => getFavorites());
  const [mastered, setMasteredState] = useState<string[]>(() => getMastered());
  const [settings, setSettingsState] = useState<ListenSettings>(() =>
    typeof window === "undefined" ? getDefaultListenSettings() : getListenSettings(),
  );
  const [stats, setStatsState] = useState(() => getStats());
  const loaded = true;

  const value = useMemo<LearningContextValue>(
    () => ({
      favorites,
      mastered,
      settings,
      stats,
      loaded,
      toggleFavorite: (sentenceId) => {
        const next = favorites.includes(sentenceId)
          ? favorites.filter((id) => id !== sentenceId)
          : [...favorites, sentenceId];
        setFavoritesState(next);
        setFavorites(next);
      },
      toggleMastered: (sentenceId) => {
        const exists = mastered.includes(sentenceId);
        const next = exists
          ? mastered.filter((id) => id !== sentenceId)
          : [...mastered, sentenceId];
        setMasteredState(next);
        setMastered(next);
      },
      updateSettings: (partial) => {
        const next = { ...settings, ...partial };
        setSettingsState(next);
        setListenSettings(next);
      },
      recordSentenceLearned: (courseSlug) => {
        updateRecentCourse(courseSlug);
        setStatsState(incrementTodayLearned(1));
      },
      recordPlayback: (courseSlug, sentenceIndex) => {
        setStatsState(updateLastPlayback(courseSlug, sentenceIndex));
      },
    }),
    [favorites, mastered, settings, stats, loaded],
  );

  return (
    <LearningContext.Provider value={value}>{children}</LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error("useLearning must be used within LearningProvider");
  }
  return context;
}
