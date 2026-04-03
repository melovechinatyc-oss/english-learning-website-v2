import Link from "next/link";
import { notFound } from "next/navigation";
import { BottomActionBar } from "@/components/learning/bottom-action-bar";
import { Header } from "@/components/learning/header";
import { SentenceCard } from "@/components/learning/sentence-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCourseBySlug, getSentencesByCourseSlug } from "@/lib/api";

type CourseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();
  const sentences = await getSentencesByCourseSlug(slug);

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <main className="mx-auto w-full max-w-4xl space-y-4 px-4 py-6">
        <section className="space-y-2 rounded-xl border bg-card p-4">
          <h1 className="text-2xl font-semibold">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{course.difficulty}</Badge>
            <Badge variant="outline">{sentences.length} 句</Badge>
          </div>
          <div className="flex gap-2">
            <Link href={`/listen/${course.slug}`}>
              <Button>进入连续听模式</Button>
            </Link>
            <Link href={`/listen/${course.slug}`}>
              <Button variant="outline">播放全部</Button>
            </Link>
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">句子列表</h2>
          {sentences.map((sentence) => (
            <SentenceCard key={sentence._id} sentence={sentence} />
          ))}
        </section>
      </main>
      <BottomActionBar slug={slug} />
    </div>
  );
}
