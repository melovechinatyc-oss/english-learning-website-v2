"use client";

import { useMemo, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { Sentence } from "@/types/learning";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLearning } from "@/contexts/learning-context";
import { ListenSettingsPanel } from "@/components/learning/listen-settings-panel";

type ContinuousListenPlayerProps = {
  title: string;
  courseSlug: string;
  sentences: Sentence[];
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function speakText(text: string, rate: number, lang: string) {
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

async function playAudio(url: string, rate: number) {
  const audio = new Audio(url);
  audio.playbackRate = rate;
  await audio.play();
  await new Promise<void>((resolve) => {
    audio.onended = () => resolve();
    audio.onerror = () => resolve();
  });
}

export function ContinuousListenPlayer({
  title,
  courseSlug,
  sentences,
}: ContinuousListenPlayerProps) {
  const { settings, recordPlayback, recordSentenceLearned } = useLearning();
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const stopRef = useRef(false);

  const sentence = sentences[index];
  const progress = useMemo(() => {
    if (sentences.length === 0) return 0;
    return ((index + 1) / sentences.length) * 100;
  }, [index, sentences.length]);

  const playEnglish = async (item: Sentence) => {
    if (item.audioNormal) {
      await playAudio(item.audioNormal, settings.speed);
      return;
    }
    await speakText(item.english, settings.speed, "en-US");
  };

  const playChinese = async (item: Sentence) => {
    if (item.audioChinese) {
      await playAudio(item.audioChinese, 1);
      return;
    }
    await speakText(item.chinese, 1, "zh-CN");
  };

  const playPronunciation = async (item: Sentence) => {
    await speakText(item.pronunciationCn, 0.9, "zh-CN");
  };

  const playCurrentSentence = async (current: Sentence) => {
    for (let repeat = 0; repeat < settings.repeatCount; repeat++) {
      await playEnglish(current);
      if (stopRef.current) return;
      await wait(settings.pauseSeconds * 1000);
      if (!settings.englishOnly && settings.playChinese) {
        await playChinese(current);
        if (stopRef.current) return;
        await wait(settings.pauseSeconds * 1000);
      }
      if (!settings.englishOnly && settings.playPronunciation) {
        await playPronunciation(current);
        if (stopRef.current) return;
        await wait(settings.pauseSeconds * 1000);
      }
      await playEnglish(current);
      if (stopRef.current) return;
      await wait(Math.max(2, settings.pauseSeconds) * 1000);
    }
  };

  const playFromIndex = async (startIndex: number) => {
    if (sentences.length === 0) return;
    stopRef.current = false;
    setIsPlaying(true);
    let currentIndex = startIndex;
    while (!stopRef.current) {
      const current = sentences[currentIndex];
      setIndex(currentIndex);
      recordPlayback(courseSlug, currentIndex);
      await playCurrentSentence(current);
      recordSentenceLearned(courseSlug);
      if (stopRef.current || !settings.autoNext) break;
      const next = currentIndex + 1;
      if (next >= sentences.length) {
        if (!settings.loopCourse) break;
        currentIndex = 0;
      } else {
        currentIndex = next;
      }
    }
    setIsPlaying(false);
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      stopRef.current = true;
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }
    await playFromIndex(index);
  };

  const goPrev = () => {
    const prev = index === 0 ? 0 : index - 1;
    setIndex(prev);
    recordPlayback(courseSlug, prev);
  };

  const goNext = () => {
    const next = index >= sentences.length - 1 ? sentences.length - 1 : index + 1;
    setIndex(next);
    recordPlayback(courseSlug, next);
  };

  if (!sentence) {
    return (
      <Card>
        <CardContent>当前课程暂无可播放句子。</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-primary/20">
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">
            第 {index + 1} / {sentences.length} 句
          </p>
          <p className="text-3xl font-semibold leading-tight">{sentence.english}</p>
          <p className="text-lg text-slate-700">{sentence.chinese}</p>
          <p className="text-sm text-slate-500">{sentence.pronunciationCn}</p>
          <Progress value={progress} />
          <div className="grid grid-cols-3 gap-2">
            <Button size="lg" variant="outline" onClick={goPrev}>
              <SkipBack className="size-5" />
              上一句
            </Button>
            <Button size="lg" onClick={handlePlayPause}>
              {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
              {isPlaying ? "暂停" : "播放"}
            </Button>
            <Button size="lg" variant="outline" onClick={goNext}>
              <SkipForward className="size-5" />
              下一句
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            自动播放：{settings.autoNext ? "开启" : "关闭"} ｜ 循环整课：
            {settings.loopCourse ? "开启" : "关闭"}
          </p>
        </CardContent>
      </Card>
      <ListenSettingsPanel />
    </div>
  );
}
