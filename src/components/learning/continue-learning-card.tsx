"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLearning } from "@/contexts/learning-context";

export function ContinueLearningCard() {
  const { stats } = useLearning();
  const latest = stats.recentCourseSlugs[0];

  if (!latest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>继续上次学习</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          你还没有学习记录，先从推荐课程开始吧。
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>继续上次学习</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">最近课程：{latest}</p>
        <div className="flex gap-2">
          <Link href={`/courses/${latest}`}>
            <Button>继续学习</Button>
          </Link>
          <Link href={`/listen/${latest}`}>
            <Button variant="outline">继续连续听</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
