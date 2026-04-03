"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLearning } from "@/contexts/learning-context";

export function ProgressStats() {
  const { favorites, mastered, stats } = useLearning();
  const today = new Date().toISOString().slice(0, 10);
  const todayLearned = stats.dailyLearnedSentenceMap[today] ?? 0;
  const recentCourse = stats.recentCourseSlugs[0] || "暂无";
  const lastPlayedAt = stats.lastPlayedAt
    ? new Date(stats.lastPlayedAt).toLocaleString("zh-CN")
    : "暂无";

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>今日学习句子</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">{todayLearned}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>收藏数量</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">{favorites.length}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>已掌握数量</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">{mastered.length}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>连续学习天数</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">{stats.streakDays}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>最近学习课程</CardTitle>
        </CardHeader>
        <CardContent>{recentCourse}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>最近播放时间</CardTitle>
        </CardHeader>
        <CardContent>{lastPlayedAt}</CardContent>
      </Card>
    </div>
  );
}
