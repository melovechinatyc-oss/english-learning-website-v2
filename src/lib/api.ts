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
  return sanityClient.fetch<Course[]>(coursesQuery);
}

export async function getFeaturedCourses() {
  if (!isSanityConfigured) {
    return byPublishedOrder(seedCourses).filter((course) => course.isFeatured);
  }
  return sanityClient.fetch<Course[]>(featuredCoursesQuery);
}

export async function getCourseBySlug(slug: string) {
  if (!isSanityConfigured) {
    return (
      byPublishedOrder(seedCourses).find((course) => course.slug === slug) ||
      null
    );
  }
  return sanityClient.fetch<Course | null>(courseBySlugQuery, { slug });
}

export async function getSentencesByCourseSlug(slug: string) {
  if (!isSanityConfigured) {
    return byPublishedOrder(seedSentences).filter(
      (sentence) => sentence.courseSlug === slug,
    );
  }
  return sanityClient.fetch<Sentence[]>(sentencesByCourseSlugQuery, { slug });
}
