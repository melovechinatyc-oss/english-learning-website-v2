import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/learning/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseBySlug, getSentenceById } from "@/lib/api";
import { Button } from "@/components/ui/button";

type SentenceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SentenceDetailPage({ params }: SentenceDetailPageProps) {
  const { id } = await params;
  const sentence = await getSentenceById(id);
  if (!sentence) notFound();
  const course = await getCourseBySlug(sentence.courseSlug);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-3xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-semibold">长句详情</h1>
        <Card>
          <CardHeader>
            <CardTitle>{sentence.english}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg">{sentence.chinese}</p>
            <p className="text-sm text-muted-foreground">{sentence.pronunciationCn}</p>
            {sentence.ipa && (
              <p className="text-sm text-muted-foreground">音标：{sentence.ipa}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {sentence.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-2 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            {course && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href={`/courses/${course.slug}`}>
                  <Button className="w-full">回到课程</Button>
                </Link>
                <Link href={`/listen/${course.slug}`}>
                  <Button variant="outline" className="w-full">
                    连续听
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
