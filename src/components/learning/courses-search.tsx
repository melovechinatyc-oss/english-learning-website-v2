"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Course, Sentence } from "@/types/learning";
import { CourseCard } from "@/components/learning/course-card";
import { Card, CardContent } from "@/components/ui/card";
import { vocabularyItems } from "@/lib/vocabulary-data";

type CoursesSearchProps = {
  courses: Course[];
  sentences: Sentence[];
  sentenceCountMap: Record<string, number>;
};

type Suggestion = {
  id: string;
  label: string;
  detail: string;
  courseSlug?: string;
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function fuzzyScore(text: string, query: string) {
  const t = normalize(text);
  const q = normalize(query);
  if (!q) return 0;
  if (t.startsWith(q)) return 120 - Math.min(20, t.length - q.length);
  if (t.includes(q)) return 90 - Math.min(20, t.length - q.length);
  let ti = 0;
  let qi = 0;
  while (ti < t.length && qi < q.length) {
    if (t[ti] === q[qi]) qi++;
    ti++;
  }
  return qi === q.length ? 50 - Math.min(20, t.length - q.length) : -1;
}

export function CoursesSearch({
  courses,
  sentences,
  sentenceCountMap,
}: CoursesSearchProps) {
  const [query, setQuery] = useState("");
  const [highFrequencyWords, setHighFrequencyWords] = useState<string[]>([]);
  const q = normalize(query);

  useEffect(() => {
    let cancelled = false;
    const loadWords = async () => {
      try {
        const response = await fetch("/data/high-frequency-3200.txt");
        if (!response.ok) return;
        const content = await response.text();
        if (cancelled) return;
        const words = content
          .split(/\r?\n/)
          .map((word) => word.trim())
          .filter(Boolean)
          .slice(0, 3200);
        setHighFrequencyWords(words);
      } catch {
        // Ignore and keep fallback vocabulary only.
      }
    };
    loadWords();
    return () => {
      cancelled = true;
    };
  }, []);

  const highFrequencySuggestions = useMemo(() => {
    const total = highFrequencyWords.length || 1;
    return highFrequencyWords.map((word, index) => {
      const ratio = index / total;
      const level =
        ratio < 0.25
          ? "零基础"
          : ratio < 0.5
            ? "初级"
            : ratio < 0.75
              ? "中级"
              : "高级";
      return {
        id: `hf-${index}`,
        label: word,
        detail: `3000+ 高频词 · ${level}`,
      };
    });
  }, [highFrequencyWords]);

  const suggestions = useMemo(() => {
    if (!q) return [] as Suggestion[];
    const pool: Suggestion[] = [
      ...courses.map((course) => ({
        id: `course-${course.slug}`,
        label: course.title,
        detail: `课程 · ${course.description}`,
        courseSlug: course.slug,
      })),
      ...sentences.slice(0, 1200).map((sentence) => ({
        id: sentence._id,
        label: sentence.english,
        detail: `对话 · ${sentence.chinese}`,
        courseSlug: sentence.courseSlug,
      })),
      ...vocabularyItems.map((item, index) => ({
        id: `vocab-${index}`,
        label: item.english,
        detail: `词汇 · ${item.chinese}`,
      })),
      ...highFrequencySuggestions,
    ];

    return pool
      .map((item) => ({
        ...item,
        score: Math.max(fuzzyScore(item.label, q), fuzzyScore(item.detail, q)),
      }))
      .filter((item) => item.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((item) => ({
        id: item.id,
        label: item.label,
        detail: item.detail,
        courseSlug: item.courseSlug,
      }));
  }, [courses, q, sentences, highFrequencySuggestions]);

  const filteredCourses = useMemo(() => {
    if (!q) return courses;
    const relatedCourseSlugs = new Set(
      suggestions
        .map((item) => item.courseSlug)
        .filter((slug): slug is string => Boolean(slug)),
    );
    return courses.filter((course) => {
      const text = `${course.title} ${course.description} ${course.category || ""}`;
      return fuzzyScore(text, q) >= 0 || relatedCourseSlugs.has(course.slug);
    });
  }, [courses, q, suggestions]);

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">搜索词汇 / 对话 / 课程</label>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="例如：deadline / negotiate / could you / 打招呼"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-primary"
        />
      </div>

      {q && suggestions.length > 0 && (
        <Card>
          <CardContent className="space-y-1 py-3">
            {suggestions.map((item) =>
              item.courseSlug ? (
                <Link
                  key={item.id}
                  href={`/courses/${item.courseSlug}`}
                  className="block rounded-md px-2 py-1 hover:bg-slate-100"
                >
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </Link>
              ) : (
                <div key={item.id} className="rounded-md px-2 py-1">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              ),
            )}
          </CardContent>
        </Card>
      )}

      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="text-sm text-muted-foreground">
            没找到匹配内容，换个关键词试试（支持英文模糊匹配与中文匹配）。
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              sentenceCount={sentenceCountMap[course.slug] || 0}
            />
          ))}
        </div>
      )}
    </section>
  );
}
