---
name: codex-session-daily-report
description: Read Codex session files for a target date, summarize completed work from assistant final answers, and produce a concise daily report. Use when the user asks to summarize today's Codex activity, generate a daily report from `~/.codex/sessions`, or review completed outcomes across sessions.
---

Produce a daily report from local Codex sessions.

## Workflow

1. Resolve target date to absolute date `YYYY-MM-DD`.
- If user says `today`, convert explicitly (for example `2026-03-02`).
- If user says relative dates (`yesterday`, `tomorrow`), convert to concrete dates first.

2. Extract `assistant final_answer` entries with bundled script.

```bash
python3 skills/codex-session-daily-report/scripts/extract_final_answers.py --date 2026-03-02
```

3. If user asks for a custom session root, pass `--root`.

```bash
python3 skills/codex-session-daily-report/scripts/extract_final_answers.py \
  --date 2026-03-02 \
  --root ~/.codex/sessions
```

4. Summarize only completed outcomes from extracted lines.
- Merge similar tasks into one topic.
- Keep concrete evidence when present: file paths, test commands/results, commit hashes.
- Keep neutral wording and avoid guessing missing facts.

5. Output report only, not raw logs, unless user explicitly asks for raw lines.

## Output Format

Use this structure:

1. 日期：`YYYY-MM-DD`
2. 统计快照：`会话文件 N`、`final_answer N`、`覆盖时段 HH:mm-HH:mm`
3. 今日业务事项：按主题列 2-6 条，每条包含 `动作`、`结果`、`证据`
4. 关键产出：按类型分组输出
- 代码改动：关键文件路径
- 验证结果：命令与结论
- 提交记录：提交哈希与提交说明
5. 风险与待办：每条包含 `风险/阻塞`、`影响`、`下一步`
6. 数据缺口说明：若无会话文件、无 final_answer 或证据不足，明确说明影响范围

## Constraints

- Use `assistant final_answer` only; do not use `commentary` as completion evidence.
- Do not output raw JSONL unless user explicitly asks.
- Keep report concise and factual.
- If no session files or no `final_answer` are found, state that clearly in the report.
- Prefer explicit evidence fields over narrative paragraphs.
- If evidence is missing for a topic, mark it as `证据不足` instead of guessing.

## Resource

- `skills/codex-session-daily-report/scripts/extract_final_answers.py`
  - Input: `--date YYYY-MM-DD`, optional `--root`.
  - Output: `timestamp<TAB>session_file<TAB>text`.
