#!/usr/bin/env python3
"""Extract assistant final answers from Codex session JSONL files."""

from __future__ import annotations

import argparse
import glob
import json
import os
import re
import sys
from pathlib import Path

WHITESPACE_RE = re.compile(r"\s+")


def normalize_text(text: str) -> str:
    return WHITESPACE_RE.sub(" ", text).strip()


def parse_date(value: str) -> tuple[str, str, str]:
    parts = value.split("-")
    if len(parts) != 3 or not all(part.isdigit() for part in parts):
        raise ValueError("日期格式必须为 YYYY-MM-DD")

    year, month, day = parts
    if len(year) != 4 or len(month) != 2 or len(day) != 2:
        raise ValueError("日期格式必须为 YYYY-MM-DD")

    return year, month, day


def collect_session_files(root: str, date_value: str) -> list[str]:
    year, month, day = parse_date(date_value)
    pattern = os.path.join(root, year, month, day, "*.jsonl")
    return sorted(glob.glob(pattern))


def extract_records(file_path: str) -> list[str]:
    records: list[str] = []
    with Path(file_path).open("r", encoding="utf-8") as handle:
        for line in handle:
            if not line.strip():
                continue

            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                continue

            if item.get("type") != "response_item":
                continue

            payload = item.get("payload") or {}
            if payload.get("type") != "message":
                continue
            if payload.get("role") != "assistant":
                continue
            if payload.get("phase") != "final_answer":
                continue

            content = payload.get("content") or []
            text_parts = [
                part.get("text", "")
                for part in content
                if isinstance(part, dict) and part.get("type") == "output_text"
            ]
            text = normalize_text(" ".join(text_parts))
            if not text:
                continue

            timestamp = item.get("timestamp", "")
            session_file = os.path.basename(file_path)
            records.append(f"{timestamp}\t{session_file}\t{text}")

    return records


def main() -> int:
    parser = argparse.ArgumentParser(
        description="提取指定日期的 assistant final_answer 内容",
    )
    parser.add_argument(
        "--date",
        required=True,
        help="目标日期，格式 YYYY-MM-DD",
    )
    parser.add_argument(
        "--root",
        default="~/.codex/sessions",
        help="sessions 根目录，默认 ~/.codex/sessions",
    )
    args = parser.parse_args()

    root = os.path.expanduser(args.root)
    files = collect_session_files(root, args.date)

    if not files:
        print(f"未找到会话文件: {args.date}", file=sys.stderr)
        return 1

    wrote = False
    for file_path in files:
        for record in extract_records(file_path):
            print(record)
            wrote = True

    if not wrote:
        print(f"未找到 final_answer: {args.date}", file=sys.stderr)
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
