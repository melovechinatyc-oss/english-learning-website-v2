import { notFound } from "next/navigation";
import { ContinuousListenPlayer } from "@/components/learning/continuous-listen-player";
import { Header } from "@/components/learning/header";
import { getCourseBySlug, getSentencesByCourseSlug } from "@/lib/api";

type ListenPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ListenPage({ params }: ListenPageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();
  const sentences = await getSentencesByCourseSlug(slug);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-3xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-semibold">连续听模式</h1>
        <p className="text-sm text-muted-foreground">
          首次播放如浏览器提示权限，请点击一次播放按钮解锁音频。
        </p>
        <ContinuousListenPlayer
          title={course.title}
          courseSlug={slug}
          sentences={sentences}
        />
      </main>
    </div>
  );
}
