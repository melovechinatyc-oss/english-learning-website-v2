"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLearning } from "@/contexts/learning-context";
import { cn } from "@/lib/utils";

export function MasteryToggle({ sentenceId }: { sentenceId: string }) {
  const { mastered, toggleMastered } = useLearning();
  const active = mastered.includes(sentenceId);
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={() => toggleMastered(sentenceId)}
      className={cn("min-w-24", active && "bg-emerald-600 hover:bg-emerald-700")}
    >
      <CheckCircle2 className={cn("size-4", active && "fill-current")} />
      {active ? "已掌握" : "未掌握"}
    </Button>
  );
}
