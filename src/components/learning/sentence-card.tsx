"use client";

import { useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { Sentence } from "@/types/learning";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/learning/favorite-button";
import { MasteryToggle } from "@/components/learning/mastery-toggle";

function speakText(text: string, rate = 1, lang = "en-US") {
  return new Promise<void>((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.lang = lang;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
}

async function playAudio(url: string, rate = 1) {
  const audio = new Audio(url);
  audio.playbackRate = rate;
  await audio.play();
  await new Promise<void>((resolve) => {
    audio.onended = () => resolve();
    audio.onerror = () => resolve();
  });
}

export function SentenceCard({ sentence }: { sentence: Sentence }) {
  const [looping, setLooping] = useState(false);
  const stopRef = useRef(false);

  const playNormal = async () => {
    if (sentence.audioNormal) {
      await playAudio(sentence.audioNormal, 1);
      return;
    }
    await speakText(sentence.english, 1, "en-US");
  };

  const playSlow = async () => {
    if (sentence.audioSlow) {
      await playAudio(sentence.audioSlow, 0.75);
      return;
    }
    await speakText(sentence.english, 0.75, "en-US");
  };

  const toggleLoop = async () => {
    if (looping) {
      stopRef.current = true;
      setLooping(false);
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
      return;
    }
    stopRef.current = false;
    setLooping(true);
    while (!stopRef.current) {
      await playNormal();
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  };

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <p className="text-xl font-semibold leading-snug">{sentence.english}</p>
          <p className="text-base text-slate-700">{sentence.chinese}</p>
          <p className="text-sm text-slate-500">{sentence.pronunciationCn}</p>
          {sentence.ipa ? <p className="text-xs text-slate-500">{sentence.ipa}</p> : null}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Button onClick={playNormal} size="sm">
            <Volume2 className="size-4" />
            标准
          </Button>
          <Button onClick={playSlow} variant="outline" size="sm">
            <Play className="size-4" />
            慢速
          </Button>
          <Button onClick={toggleLoop} variant="outline" size="sm">
            {looping ? <Pause className="size-4" /> : <RotateCcw className="size-4" />}
            {looping ? "停止循环" : "单句循环"}
          </Button>
          <FavoriteButton sentenceId={sentence._id} />
          <MasteryToggle sentenceId={sentence._id} />
        </div>
      </CardContent>
    </Card>
  );
}
