"use client";

import { LearningStats, ListenSettings } from "@/types/learning";

const FAVORITES_KEY = "elw:favorites";
const MASTERED_KEY = "elw:mastered";
const SETTINGS_KEY = "elw:listen-settings";
const STATS_KEY = "elw:stats";

const defaultSettings: ListenSettings = {
  playChinese: true,
  playPronunciation: true,
  englishOnly: false,
  ttsVoicePreference: "male",
  repeatCount: 1,
  speed: 1,
  pauseSeconds: 1,
  loopCourse: false,
  autoNext: true,
};

const defaultStats: LearningStats = {
  dailyLearnedSentenceMap: {},
  streakDays: 0,
  recentCourseSlugs: [],
  lastPlayedPosition: {},
};

function parseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function safeRead(key: string) {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function safeWrite(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getFavorites() {
  return parseJSON<string[]>(safeRead(FAVORITES_KEY), []);
}

export function setFavorites(sentenceIds: string[]) {
  safeWrite(FAVORITES_KEY, sentenceIds);
}

export function getMastered() {
  return parseJSON<string[]>(safeRead(MASTERED_KEY), []);
}

export function setMastered(sentenceIds: string[]) {
  safeWrite(MASTERED_KEY, sentenceIds);
}

export function getListenSettings() {
  const settings = parseJSON<Partial<ListenSettings>>(
    safeRead(SETTINGS_KEY),
    defaultSettings,
  );
  return { ...defaultSettings, ...settings };
}

export function setListenSettings(settings: ListenSettings) {
  safeWrite(SETTINGS_KEY, settings);
}

export function getStats() {
  return parseJSON<LearningStats>(safeRead(STATS_KEY), defaultStats);
}

export function setStats(stats: LearningStats) {
  safeWrite(STATS_KEY, stats);
}

export function incrementTodayLearned(sentenceCount = 1) {
  const stats = getStats();
  const today = new Date().toISOString().slice(0, 10);
  const previousDate = stats.lastStudyDate;
  const previousCount = stats.dailyLearnedSentenceMap[today] ?? 0;
  stats.dailyLearnedSentenceMap[today] = previousCount + sentenceCount;
  stats.lastStudyDate = today;
  if (!previousDate) {
    stats.streakDays = 1;
  } else if (previousDate === today) {
    stats.streakDays = Math.max(1, stats.streakDays);
  } else {
    const diffDays = Math.floor(
      (new Date(today).getTime() - new Date(previousDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    stats.streakDays = diffDays === 1 ? Math.max(1, stats.streakDays + 1) : 1;
  }
  setStats(stats);
  return stats;
}

export function updateRecentCourse(courseSlug: string) {
  const stats = getStats();
  stats.recentCourseSlugs = [
    courseSlug,
    ...stats.recentCourseSlugs.filter((slug) => slug !== courseSlug),
  ].slice(0, 5);
  setStats(stats);
  return stats;
}

export function updateLastPlayback(courseSlug: string, sentenceIndex: number) {
  const stats = getStats();
  stats.lastPlayedAt = new Date().toISOString();
  stats.lastPlayedPosition[courseSlug] = sentenceIndex;
  setStats(stats);
  return stats;
}

export function getDefaultListenSettings() {
  return defaultSettings;
}
