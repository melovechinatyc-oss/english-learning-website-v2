"use client";

import { Header } from "@/components/learning/header";
import { ProgressStats } from "@/components/learning/progress-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProgressPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-semibold">学习记录</h1>
        <ProgressStats />
        <Card>
          <CardHeader>
            <CardTitle>学习建议</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>每天至少完成 8 句连续听，保持耳朵输入稳定。</p>
            <p>优先复习收藏句子，再扩展新课程。</p>
            <p>早晚通勤各 5 分钟，累计效果最好。</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
