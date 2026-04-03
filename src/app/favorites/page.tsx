"use client";

import Link from "next/link";
import { Header } from "@/components/learning/header";
import { FavoriteButton } from "@/components/learning/favorite-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { seedSentences } from "@/lib/seed-data";
import { useLearning } from "@/contexts/learning-context";

export default function FavoritesPage() {
  const { favorites } = useLearning();
  const list = seedSentences.filter((sentence) => favorites.includes(sentence._id));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-4xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-semibold">收藏</h1>
        {list.length === 0 ? (
          <Card>
            <CardContent className="text-sm text-muted-foreground">
              还没有收藏句子，在课程详情页点击收藏后会显示在这里。
            </CardContent>
          </Card>
        ) : (
          list.map((sentence) => (
            <Card key={sentence._id}>
              <CardHeader>
                <CardTitle className="text-lg">{sentence.english}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>{sentence.chinese}</p>
                <p className="text-sm text-muted-foreground">
                  所属课程：{sentence.courseSlug}
                </p>
                <div className="flex gap-2">
                  <Link href={`/courses/${sentence.courseSlug}`}>
                    <Button variant="outline">返回原课程</Button>
                  </Link>
                  <FavoriteButton sentenceId={sentence._id} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
