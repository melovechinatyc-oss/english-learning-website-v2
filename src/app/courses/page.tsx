import { CourseCard } from "@/components/learning/course-card";
import { Header } from "@/components/learning/header";
import { Card, CardContent } from "@/components/ui/card";
import { getCourses, getSentencesByCourseSlug } from "@/lib/api";

export default async function CoursesPage() {
  const courses = await getCourses();
  const sentenceCountMap = Object.fromEntries(
    await Promise.all(
      courses.map(async (course) => [
        course.slug,
        (await getSentencesByCourseSlug(course.slug)).length,
      ]),
    ),
  );

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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                sentenceCount={sentenceCountMap[course.slug] || 0}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
