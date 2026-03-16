#!/usr/bin/env python3
"""Validate single-line commit message for git-commit-helper skill rules."""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

ALLOWED_TYPES = ("feat", "fix", "refactor", "perf", "style", "test", "docs", "chore")
HEADER_RE = re.compile(
    r"^(?P<type>feat|fix|refactor|perf|style|test|docs|chore)"
    r"\((?P<scope>[a-z0-9][a-z0-9-]*)\): (?P<summary>.+)$"
)
CJK_RE = re.compile(r"[\u4e00-\u9fff]")
FORBIDDEN_SUMMARY_PATTERNS = (
    re.compile(r"\band\b", re.IGNORECASE),
    re.compile(r"&"),
    re.compile(r"multiple changes", re.IGNORECASE),
)
PAST_TENSE_PREFIXES = (
    "已",
    "已经",
    "完成",
    "修复了",
    "新增了",
    "优化了",
    "更新了",
    "重构了",
    "添加了",
    "改了",
)
FORBIDDEN_ENDINGS = (".", "。")
MAX_SUMMARY_LEN = 50
AUTHOR_NAME = "codex"
AUTHOR_EMAIL = "codex-ice@gmail.com"


def load_message(args: argparse.Namespace) -> str:
    if args.message and args.file:
        raise ValueError("--message 与 --file 只能二选一")
    if not args.message and not args.file:
        raise ValueError("必须提供 --message 或 --file")

    if args.message:
        return args.message

    content = Path(args.file).read_text(encoding="utf-8")
    return content.rstrip("\n")


def validate_commit_message(message: str) -> list[str]:
    errors: list[str] = []
    lines = message.splitlines()

    if not lines:
        return ["提交信息不能为空"]

    header = lines[0].strip()
    if not header:
        return ["提交首行不能为空"]

    match = HEADER_RE.match(header)
    commit_type = None
    raw_summary = ""
    summary = ""
    if not match:
        errors.append("首行格式必须为 <type>(<scope>): <summary>")
    else:
        commit_type = match.group("type")
        raw_summary = match.group("summary")
        summary = raw_summary.strip()

    if len(lines) > 1:
        errors.append("当前规则仅允许单行提交信息，不要编写正文")

    if commit_type and commit_type not in ALLOWED_TYPES:
        errors.append("type 必须是 feat/fix/refactor/perf/style/test/docs/chore 之一")

    if not summary and match:
        errors.append("summary 不能为空")

    if summary:
        if raw_summary != summary:
            errors.append("summary 前后不能有空格")
        if len(summary) > MAX_SUMMARY_LEN:
            errors.append("summary 长度不能超过 50 字符")
        if summary.endswith(FORBIDDEN_ENDINGS):
            errors.append("summary 结尾不能使用句号")
        if not CJK_RE.search(summary):
            errors.append("summary 必须使用中文")
        if summary.startswith(PAST_TENSE_PREFIXES):
            errors.append("summary 必须使用祈使句，避免使用“已/完成/xxx了”开头")

        for pattern in FORBIDDEN_SUMMARY_PATTERNS:
            if pattern.search(summary):
                errors.append("summary 不能包含 and / & / multiple changes")
                break

    if "\\n" in message:
        errors.append(r"提交信息中不要包含字面量 \n")

    return errors


def commit_message(message: str) -> int:
    cmd = [
        "git",
        "-c",
        f"user.name={AUTHOR_NAME}",
        "-c",
        f"user.email={AUTHOR_EMAIL}",
        "commit",
        "-m",
        message,
    ]
    result = subprocess.run(cmd, text=True, check=False)
    return result.returncode


def main() -> int:
    parser = argparse.ArgumentParser(
        description="校验单行提交信息是否符合 git-commit-helper 规则",
    )
    parser.add_argument("--message", help="直接传入提交信息文本")
    parser.add_argument("--file", help="从文件读取提交信息")
    parser.add_argument("--commit", action="store_true", help="校验通过后直接提交")
    args = parser.parse_args()

    try:
        message = load_message(args)
    except Exception as exc:  # noqa: BLE001
        print(f"参数错误: {exc}")
        return 2

    errors = validate_commit_message(message)
    if errors:
        print("校验失败:")
        for idx, err in enumerate(errors, start=1):
            print(f"{idx}. {err}")
        return 1

    if args.commit:
        return commit_message(message)

    print("校验通过")
    return 0


if __name__ == "__main__":
    sys.exit(main())
