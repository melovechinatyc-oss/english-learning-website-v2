import { ContinueLearningCard } from "@/components/learning/continue-learning-card";
import { CourseCard } from "@/components/learning/course-card";
import { Header } from "@/components/learning/header";
import { HeroSection } from "@/components/learning/hero-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFeaturedCourses, getSentencesByCourseSlug } from "@/lib/api";

export default async function Home() {
  const featuredCourses = await getFeaturedCourses();
  const sentenceCountMap = Object.fromEntries(
    await Promise.all(
      featuredCourses.map(async (course) => [
        course.slug,
        (await getSentencesByCourseSlug(course.slug)).length,
      ]),
    ),
  );
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
        <HeroSection />
        <ContinueLearningCard />
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">推荐课程</h2>
          {featuredCourses.length === 0 ? (
            <Card>
              <CardContent className="text-sm text-muted-foreground">
                暂无推荐课程，请在 Sanity 后台将课程标记为推荐并发布。
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  sentenceCount={sentenceCountMap[course.slug] || 0}
                />
              ))}
            </div>
          )}
        </section>
        <section className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>快速开始</CardTitle>
            </CardHeader>
            <CardContent>先选一节课，按顺序学 8 句核心表达。</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>连续听优先</CardTitle>
            </CardHeader>
            <CardContent>进入连续听后，戴耳机不用频繁点屏幕。</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>后台可持续维护</CardTitle>
            </CardHeader>
            <CardContent>课程与句子从 Sanity 读取，不依赖写死 JSON。</CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
