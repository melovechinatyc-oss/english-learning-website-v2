import Link from "next/link";
import { Header } from "@/components/learning/header";
import { WordSpeakButton } from "@/components/learning/word-speak-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { findWordDetail, fromWordSlug } from "@/lib/vocabulary-data";

type VocabularyDetailPageProps = {
  params: Promise<{ word: string }>;
};

export default async function VocabularyDetailPage({
  params,
}: VocabularyDetailPageProps) {
  const { word } = await params;
  const normalizedWord = fromWordSlug(word);
  const item = findWordDetail(normalizedWord);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-3xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-semibold">词汇详情</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{normalizedWord}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg">
              {item?.chinese || `${normalizedWord}（常用词）`}
            </p>
            {item?.ipa ? (
              <p className="text-sm text-muted-foreground">音标：/{item.ipa}/</p>
            ) : null}
            <p className="text-sm text-muted-foreground">
              分类：{item?.category || "3000+ 高频词分级包"}
            </p>
            <WordSpeakButton text={normalizedWord} />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link href="/courses">
                <Button className="w-full">回到课程搜索</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  回首页搜索
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
