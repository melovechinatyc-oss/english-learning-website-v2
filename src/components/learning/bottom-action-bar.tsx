import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BottomActionBar({ slug }: { slug: string }) {
  return (
    <div className="sticky bottom-0 z-30 border-t bg-background/95 p-3 backdrop-blur">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2">
        <Link href={`/courses/${slug}`}>
          <Button className="w-full" variant="outline" size="lg">
            句子学习
          </Button>
        </Link>
        <Link href={`/listen/${slug}`}>
          <Button className="w-full" size="lg">
            连续听
          </Button>
        </Link>
      </div>
    </div>
  );
}
