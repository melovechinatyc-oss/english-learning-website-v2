import { CoursesSearch } from "@/components/learning/courses-search";
import { Header } from "@/components/learning/header";
import { Card, CardContent } from "@/components/ui/card";
import { getCourses, getSentencesByCourseSlug } from "@/lib/api";
import { Sentence } from "@/types/learning";

export default async function CoursesPage() {
  const courses = await getCourses();
  const sentencesByCourse: Record<string, Sentence[]> = Object.fromEntries(
    await Promise.all(
      courses.map(async (course) => [
        course.slug,
        await getSentencesByCourseSlug(course.slug),
      ]),
    ),
  );
  const sentenceCountMap = Object.fromEntries(
    Object.entries(sentencesByCourse).map(([slug, sentences]) => [
      slug,
      sentences.length,
    ]),
  );
  const allSentences: Sentence[] = Object.values(sentencesByCourse).flat();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-semibold">课程列表</h1>
        {courses.length === 0 ? (
          <Card>
            <CardContent className="text-sm text-muted-foreground">
              暂无课程，请先在后台发布课程内容。
            </CardContent>
          </Card>
        ) : (
          <CoursesSearch
            courses={courses}
            sentences={allSentences}
            sentenceCountMap={sentenceCountMap}
          />
        )}
      </main>
    </div>
  );
}
