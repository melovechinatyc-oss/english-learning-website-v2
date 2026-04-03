"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLearning } from "@/contexts/learning-context";
import { cn } from "@/lib/utils";

export function FavoriteButton({ sentenceId }: { sentenceId: string }) {
  const { favorites, toggleFavorite } = useLearning();
  const active = favorites.includes(sentenceId);
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={() => toggleFavorite(sentenceId)}
      className={cn("min-w-20", active && "bg-rose-500 hover:bg-rose-600")}
    >
      <Heart className={cn("size-4", active && "fill-current")} />
      收藏
    </Button>
  );
}
