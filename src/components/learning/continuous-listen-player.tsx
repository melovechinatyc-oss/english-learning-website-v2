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

function splitTextForTTS(text: string) {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) return [];
  // Keep normal sentences as a single utterance to avoid choppy pauses.
  if (normalized.length <= 180) return [normalized];
  const roughParts = normalized
    .split(/(?<=[,.!?;:，。！？；：])/)
    .map((part) => part.trim())
    .filter(Boolean);
  const maxLen = 180;
  const chunks: string[] = [];
  for (const part of roughParts) {
    if (part.length <= maxLen) {
      chunks.push(part);
      continue;
    }
    let buffer = "";
    const words = part.split(" ");
    for (const word of words) {
      const next = buffer ? `${buffer} ${word}` : word;
      if (next.length > maxLen) {
        if (buffer) chunks.push(buffer);
        buffer = word;
      } else {
        buffer = next;
      }
    }
    if (buffer) chunks.push(buffer);
  }
  return chunks.length > 0 ? chunks : [normalized];
}

function pickVoice(
  lang: string,
  preference: "auto" | "male" | "female",
) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;
  const languageMatched =
    voices.filter((voice) =>
      voice.lang.toLowerCase().startsWith(lang.toLowerCase()),
    ).length > 0
      ? voices.filter((voice) =>
          voice.lang.toLowerCase().startsWith(lang.toLowerCase()),
        )
      : voices.filter((voice) =>
          voice.lang
            .toLowerCase()
            .startsWith(lang.split("-")[0].toLowerCase()),
        );
  const pool = languageMatched.length > 0 ? languageMatched : voices;

  if (preference !== "auto") {
    const maleHints = ["male", "man", "david", "daniel", "tom", "alex"];
    const femaleHints = ["female", "woman", "samantha", "victoria", "karen"];
    const hints = preference === "male" ? maleHints : femaleHints;
    const preferred = pool.find((voice) =>
      hints.some((hint) => voice.name.toLowerCase().includes(hint)),
    );
    if (preferred) return preferred;
  }
  return pool[0] || null;
}

function speakChunk(
  text: string,
  rate: number,
  lang: string,
  voicePreference: "auto" | "male" | "female",
  shouldStop: () => boolean,
) {
  return new Promise<void>((resolve) => {
    if (
      typeof window === "undefined" ||
      !window.speechSynthesis ||
      shouldStop() ||
      !text.trim()
    ) {
      resolve();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.lang = lang;
    const voice = pickVoice(lang, voicePreference);
    if (voice) utterance.voice = voice;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

async function speakText(
  text: string,
  rate: number,
  lang: string,
  voicePreference: "auto" | "male" | "female",
  shouldStop: () => boolean,
) {
  const chunks = splitTextForTTS(text);
  for (const chunk of chunks) {
    if (shouldStop()) return;
    await speakChunk(chunk, rate, lang, voicePreference, shouldStop);
  }
}

async function playAudio(url: string, rate: number, setAudio: (audio: HTMLAudioElement | null) => void) {
  const audio = new Audio(url);
  setAudio(audio);
  audio.playbackRate = rate;
  await audio.play();
  await new Promise<void>((resolve) => {
    audio.onended = () => {
      setAudio(null);
      resolve();
    };
    audio.onerror = () => {
      setAudio(null);
      resolve();
    };
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
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  const sentence = sentences[index];
  const progress = useMemo(() => {
    if (sentences.length === 0) return 0;
    return ((index + 1) / sentences.length) * 100;
  }, [index, sentences.length]);

  const playEnglish = async (item: Sentence) => {
    if (item.audioNormal) {
      await playAudio(item.audioNormal, settings.speed, (audio) => {
        activeAudioRef.current = audio;
      });
      return;
    }
    await speakText(
      item.english,
      settings.speed,
      "en-US",
      settings.ttsVoicePreference,
      () => stopRef.current,
    );
  };

  const playChinese = async (item: Sentence) => {
    if (item.audioChinese) {
      await playAudio(item.audioChinese, 1, (audio) => {
        activeAudioRef.current = audio;
      });
      return;
    }
    await speakText(
      item.chinese,
      1,
      "zh-CN",
      settings.ttsVoicePreference,
      () => stopRef.current,
    );
  };

  const playPronunciation = async (item: Sentence) => {
    await speakText(
      item.pronunciationCn,
      0.9,
      "zh-CN",
      settings.ttsVoicePreference,
      () => stopRef.current,
    );
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
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
        activeAudioRef.current = null;
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
