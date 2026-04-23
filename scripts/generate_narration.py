#!/usr/bin/env python3
"""Generate a narration MP3 from the checked-in narration text."""

from __future__ import annotations

import argparse
import asyncio
from pathlib import Path

import edge_tts

DEFAULT_TEXT_FILE = Path("assets/narration.txt")
DEFAULT_OUTPUT_FILE = Path("assets/demo-narration.mp3")
DEFAULT_VOICE = "en-GB-SoniaNeural"


async def generate(text: str, output_file: Path, voice: str, rate: str) -> None:
    output_file.parent.mkdir(parents=True, exist_ok=True)
    communicator = edge_tts.Communicate(text=text, voice=voice, rate=rate)
    await communicator.save(str(output_file))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate demo narration MP3")
    parser.add_argument("--text-file", type=Path, default=DEFAULT_TEXT_FILE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_FILE)
    parser.add_argument("--voice", default=DEFAULT_VOICE)
    parser.add_argument("--rate", default="-2%", help="Speech rate, e.g. -5%% or +0%%")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    text = args.text_file.read_text(encoding="utf-8").strip()
    if not text:
        raise SystemExit(f"Narration text file is empty: {args.text_file}")

    asyncio.run(generate(text, args.output, args.voice, args.rate))
    print(f"Generated {args.output} using voice {args.voice}")


if __name__ == "__main__":
    main()
