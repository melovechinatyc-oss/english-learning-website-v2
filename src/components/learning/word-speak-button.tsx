"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type WordSpeakButtonProps = {
  text: string;
};

export function WordSpeakButton({ text }: WordSpeakButtonProps) {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.95;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  return (
    <Button type="button" variant="outline" onClick={handleSpeak}>
      {speaking ? "朗读中..." : "朗读单词"}
    </Button>
  );
}
