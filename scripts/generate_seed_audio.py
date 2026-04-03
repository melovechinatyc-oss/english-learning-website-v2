#!/usr/bin/env python3
import asyncio
import os
import re
from pathlib import Path

import edge_tts
from gtts import gTTS

ROOT = Path(__file__).resolve().parents[1]
SEED_FILE = ROOT / "src/lib/seed-data.ts"
OUT_DIR = ROOT / "public/audio/seed"

EN_VOICE = "en-US-GuyNeural"
ZH_VOICE = "zh-CN-YunxiNeural"


def parse_seed_sentences(seed_text: str):
  block_pattern = re.compile(
    r'\.\.\.createSentences\("([^"]+)",\s*(\d+),\s*\[(.*?)\]\),',
    re.S,
  )
  item_pattern = re.compile(
    r'\{\s*english:\s*"((?:\\"|[^"])*)",\s*chinese:\s*"((?:\\"|[^"])*)",\s*pronunciationCn:\s*"((?:\\"|[^"])*)"',
    re.S,
  )
  sentences = []
  for _, base_id_str, block in block_pattern.findall(seed_text):
    base_id = int(base_id_str)
    items = item_pattern.findall(block)
    for index, (english, chinese, pronunciation_cn) in enumerate(items):
      sentence_id = f"s{base_id + index}"
      sentences.append(
        {
          "id": sentence_id,
          "english": english.replace('\\"', '"'),
          "chinese": chinese.replace('\\"', '"'),
          "pronunciation_cn": pronunciation_cn.replace('\\"', '"'),
        }
      )
  return sentences


async def save_tts(text: str, voice: str, file_path: Path):
  try:
    communicate = edge_tts.Communicate(text, voice=voice, rate="+0%")
    await communicate.save(str(file_path))
    return
  except Exception:
    pass

  lang = "en" if voice.startswith("en-") else "zh-cn"
  tts = gTTS(text=text, lang=lang, slow=False)
  tts.save(str(file_path))


async def generate():
  seed_text = SEED_FILE.read_text(encoding="utf-8")
  sentences = parse_seed_sentences(seed_text)
  OUT_DIR.mkdir(parents=True, exist_ok=True)
  count = 0
  for sentence in sentences:
    file_en = OUT_DIR / f"{sentence['id']}-en.mp3"
    file_zh = OUT_DIR / f"{sentence['id']}-zh.mp3"
    file_pron = OUT_DIR / f"{sentence['id']}-pron.mp3"
    if not file_en.exists():
      await save_tts(sentence["english"], EN_VOICE, file_en)
      count += 1
    if not file_zh.exists():
      await save_tts(sentence["chinese"], ZH_VOICE, file_zh)
      count += 1
    if not file_pron.exists():
      await save_tts(sentence["pronunciation_cn"], ZH_VOICE, file_pron)
      count += 1
  print(f"Generated/updated {count} audio files in {OUT_DIR}")


if __name__ == "__main__":
  asyncio.run(generate())
