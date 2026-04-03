export type Difficulty = "beginner" | "elementary" | "intermediate";

export type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  order: number;
};

export type Course = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  coverImage?: string;
  category?: string;
  order: number;
  isFeatured: boolean;
  isPublished: boolean;
};

export type Sentence = {
  _id: string;
  courseSlug: string;
  english: string;
  chinese: string;
  pronunciationCn: string;
  ipa?: string;
  audioNormal?: string;
  audioSlow?: string;
  audioChinese?: string;
  tags: string[];
  order: number;
  isPublished: boolean;
};

export type ListenSettings = {
  playChinese: boolean;
  playPronunciation: boolean;
  englishOnly: boolean;
  repeatCount: 1 | 2 | 3 | 4 | 5;
  speed: 0.75 | 1 | 1.25;
  pauseSeconds: 1 | 2 | 3;
  loopCourse: boolean;
  autoNext: boolean;
};

export type LearningStats = {
  dailyLearnedSentenceMap: Record<string, number>;
  streakDays: number;
  lastStudyDate?: string;
  recentCourseSlugs: string[];
  lastPlayedAt?: string;
  lastPlayedPosition: Record<string, number>;
};
