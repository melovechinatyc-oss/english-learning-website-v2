"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { Sentence } from "@/types/learning";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/learning/favorite-button";
import { MasteryToggle } from "@/components/learning/mastery-toggle";
import { useLearning } from "@/contexts/learning-context";

const audioCache = new Map<string, HTMLAudioElement>();

type ActivePlayback = {
  ownerId: string;
  sessionId: number;
  stop: () => void;
};

let activePlayback: ActivePlayback | null = null;

function claimActivePlayback(next: ActivePlayback) {
  if (
    activePlayback &&
    (activePlayback.ownerId !== next.ownerId ||
      activePlayback.sessionId !== next.sessionId)
  ) {
    activePlayback.stop();
  }
  activePlayback = next;
}

function releaseActivePlayback(ownerId: string, sessionId: number) {
  if (
    activePlayback?.ownerId === ownerId &&
    activePlayback.sessionId === sessionId
  ) {
    activePlayback = null;
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function splitTextForTTS(text: string) {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) return [];
  if (normalized.length <= 180) return [normalized];
  const roughParts = normalized
    .split(/(?<=[,.!?;:])/)
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

function getUnifiedAudioUrl(item: Sentence) {
  return `/audio/seed/${item._id}-en.mp3`;
}

function getOrCreateCachedAudio(url: string) {
  let audio = audioCache.get(url);
  if (!audio) {
    audio = new Audio(url);
    audio.preload = "auto";
    audioCache.set(url, audio);
  }
  return audio;
}

async function ensureAudioReady(audio: HTMLAudioElement) {
  if (audio.readyState >= 3) return;
  await new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      audio.removeEventListener("canplaythrough", finish);
      audio.removeEventListener("loadeddata", finish);
      audio.removeEventListener("error", finish);
      resolve();
    };
    audio.addEventListener("canplaythrough", finish, { once: true });
    audio.addEventListener("loadeddata", finish, { once: true });
    audio.addEventListener("error", finish, { once: true });
    setTimeout(finish, 1200);
  });
}

export function SentenceCard({ sentence }: { sentence: Sentence }) {
  const { settings } = useLearning();
  const [looping, setLooping] = useState(false);
  const stopRef = useRef(false);
  const sessionRef = useRef(0);
  const mountedRef = useRef(true);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const ownerIdRef = useRef(
    `sentence-card-${sentence._id}-${Math.random().toString(36).slice(2, 8)}`,
  );

  const getNormalAudioUrl = () => sentence.audioNormal || getUnifiedAudioUrl(sentence);
  const getSlowAudioUrl = () =>
    sentence.audioSlow || sentence.audioNormal || getUnifiedAudioUrl(sentence);

  const stopPlayback = (resetLoopState = true) => {
    stopRef.current = true;
    const currentSessionId = sessionRef.current;
    sessionRef.current += 1;
    releaseActivePlayback(ownerIdRef.current, currentSessionId);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
    if (resetLoopState && mountedRef.current) {
      setLooping(false);
    }
  };

  useEffect(() => {
    const preloadTargets = Array.from(new Set([getNormalAudioUrl(), getSlowAudioUrl()]));
    for (const url of preloadTargets) {
      const audio = getOrCreateCachedAudio(url);
      audio.load();
    }
  }, [sentence._id, sentence.audioNormal, sentence.audioSlow]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stopPlayback(false);
    };
  }, []);

  const playAudio = async (url: string, rate = 1) => {
    let audio: HTMLAudioElement | null = null;
    try {
      audio = getOrCreateCachedAudio(url);
      activeAudioRef.current = audio;
      await ensureAudioReady(audio);
      if (stopRef.current) {
        if (activeAudioRef.current === audio) {
          activeAudioRef.current = null;
        }
        return false;
      }
      audio.currentTime = 0;
      audio.playbackRate = rate;

      const currentAudio = audio;
      const finished = new Promise<boolean>((resolve) => {
        let done = false;
        const finish = (result: boolean) => {
          if (done) return;
          done = true;
          currentAudio.onended = null;
          currentAudio.onerror = null;
          currentAudio.onpause = null;
          if (activeAudioRef.current === currentAudio) {
            activeAudioRef.current = null;
          }
          resolve(result);
        };
        currentAudio.onended = () => finish(true);
        currentAudio.onerror = () => finish(false);
        currentAudio.onpause = () => finish(false);
      });

      await currentAudio.play();
      return await finished;
    } catch {
      if (audio && activeAudioRef.current === audio) {
        activeAudioRef.current = null;
      }
      return false;
    }
  };

  const playEnglish = async (primaryUrl: string, rate: number) => {
    const ok = await playAudio(primaryUrl, rate);
    if (ok || stopRef.current) return;
    await speakText(
      sentence.english,
      rate,
      "en-US",
      settings.ttsVoicePreference,
      () => stopRef.current,
    );
  };

  const startSinglePlayback = async (mode: "normal" | "slow") => {
    stopPlayback();
    stopRef.current = false;
    const sessionId = sessionRef.current;
    claimActivePlayback({
      ownerId: ownerIdRef.current,
      sessionId,
      stop: () => stopPlayback(),
    });
    const primaryUrl = mode === "normal" ? getNormalAudioUrl() : getSlowAudioUrl();
    const rate = mode === "normal" ? 1 : 0.75;
    await playEnglish(primaryUrl, rate);
    releaseActivePlayback(ownerIdRef.current, sessionId);
  };

  const playNormal = async () => startSinglePlayback("normal");

  const playSlow = async () => startSinglePlayback("slow");

  const toggleLoop = async () => {
    if (looping) {
      stopPlayback();
      return;
    }
    stopPlayback(false);
    stopRef.current = false;
    const sessionId = sessionRef.current;
    claimActivePlayback({
      ownerId: ownerIdRef.current,
      sessionId,
      stop: () => stopPlayback(),
    });
    setLooping(true);
    while (!stopRef.current) {
      await playEnglish(getNormalAudioUrl(), 1);
      if (stopRef.current || sessionRef.current !== sessionId) break;
      await wait(800);
    }
    releaseActivePlayback(ownerIdRef.current, sessionId);
    if (sessionRef.current === sessionId && mountedRef.current) {
      setLooping(false);
    }
  };

  const handlePlayNormal = () => {
    void playNormal();
  };

  const handlePlaySlow = () => {
    void playSlow();
  };

  const handleToggleLoop = () => {
    void toggleLoop();
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
          <Button onClick={handlePlayNormal} size="sm">
            <Volume2 className="size-4" />
            {"标准"}
          </Button>
          <Button onClick={handlePlaySlow} variant="outline" size="sm">
            <Play className="size-4" />
            {"慢速"}
          </Button>
          <Button onClick={handleToggleLoop} variant="outline" size="sm">
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
