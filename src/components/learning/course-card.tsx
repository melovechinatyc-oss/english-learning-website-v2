import Link from "next/link";
import { Course } from "@/types/learning";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type CourseCardProps = {
  course: Course;
  sentenceCount: number;
};

const difficultyMap = {
  beginner: "零基础",
  elementary: "初级",
  intermediate: "中级",
  advanced: "高级",
};

export function CourseCard({ course, sentenceCount }: CourseCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{difficultyMap[course.difficulty]}</Badge>
          <Badge variant="outline">{sentenceCount} 句</Badge>
          <Badge variant="outline">{course.estimatedMinutes} 分钟</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link href={`/courses/${course.slug}`}>
            <Button className="w-full">学习</Button>
          </Link>
          <Link href={`/listen/${course.slug}`}>
            <Button variant="outline" className="w-full">
              连续听
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
