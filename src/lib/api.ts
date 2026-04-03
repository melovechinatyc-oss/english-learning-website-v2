import { Course, Sentence } from "@/types/learning";
import { seedCourses, seedSentences } from "@/lib/seed-data";
import { isSanityConfigured, sanityClient } from "@/lib/sanity.client";
import {
  courseBySlugQuery,
  coursesQuery,
  featuredCoursesQuery,
  sentencesByCourseSlugQuery,
} from "@/lib/queries";

function byPublishedOrder<T extends { isPublished: boolean; order: number }>(
  list: T[],
) {
  return list
    .filter((item) => item.isPublished)
    .sort((a, b) => a.order - b.order);
}

export async function getCourses() {
  if (!isSanityConfigured) return byPublishedOrder(seedCourses);
  try {
    const courses = await sanityClient.fetch<Course[]>(coursesQuery);
    if (courses.length > 0) return courses;
  } catch {
    // Ignore and fallback to seed content.
  }
  return byPublishedOrder(seedCourses);
}

export async function getFeaturedCourses() {
  if (!isSanityConfigured) {
    return byPublishedOrder(seedCourses).filter((course) => course.isFeatured);
  }
  try {
    const courses = await sanityClient.fetch<Course[]>(featuredCoursesQuery);
    if (courses.length > 0) return courses;
  } catch {
    // Ignore and fallback to seed content.
  }
  return byPublishedOrder(seedCourses).filter((course) => course.isFeatured);
}

export async function getCourseBySlug(slug: string) {
  if (!isSanityConfigured) {
    return (
      byPublishedOrder(seedCourses).find((course) => course.slug === slug) ||
      null
    );
  }
  try {
    const course = await sanityClient.fetch<Course | null>(courseBySlugQuery, {
      slug,
    });
    if (course) return course;
  } catch {
    // Ignore and fallback to seed content.
  }
  return byPublishedOrder(seedCourses).find((course) => course.slug === slug) || null;
}

export async function getSentencesByCourseSlug(slug: string) {
  if (!isSanityConfigured) {
    return byPublishedOrder(seedSentences).filter(
      (sentence) => sentence.courseSlug === slug,
    );
  }
  try {
    const sentences = await sanityClient.fetch<Sentence[]>(
      sentencesByCourseSlugQuery,
      { slug },
    );
    if (sentences.length > 0) return sentences;
  } catch {
    // Ignore and fallback to seed content.
  }
  return byPublishedOrder(seedSentences).filter(
    (sentence) => sentence.courseSlug === slug,
  );
}
