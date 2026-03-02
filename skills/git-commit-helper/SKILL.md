---
name: git-commit-helper
description: "严格生成与校验中文 Git 提交信息，固定格式为 type(scope): summary，type 仅允许 feat/fix/refactor/perf/style/test/docs/chore，summary 必须用祈使句、不超过 50 字符、不得以句号结尾且不得包含 and/&/multiple changes。使用该技能于编写提交说明、检查提交文本是否合规，或执行使用 codex (codex-ice@gmail.com) 身份的提交时。"
---

生成中文提交信息，先校验再提交。统一使用作者身份：`codex <codex-ice@gmail.com>`。

## 工作流

1. 检查暂存区，只允许一个明确意图：
`git diff --cached --name-status`
2. 选择 `type`：`feat` `fix` `refactor` `perf` `style` `test` `docs` `chore`。
3. 写提交消息文件，固定首行格式：
`<type>(<scope>): <summary>`
4. 若 `type=perf`，在空行后写正文并说明优化原因。
5. 执行校验：
`python3 skills/git-commit-helper/scripts/validate_commit_message.py --file <msg-file>`
6. 校验通过后提交：
`git -c user.name='codex' -c user.email='codex-ice@gmail.com' commit -F <msg-file>`

## 强制规则

1. 首行必须是：`<type>(<scope>): <summary>`。
2. `scope` 只允许小写字母、数字、连字符（例如 `album`、`build-cache`）。
3. `summary` 必须使用中文祈使句，且不超过 50 字符。
4. `summary` 不能以 `。` 或 `.` 结尾。
5. `summary` 不能包含 `and`、`&`、`multiple changes`。
6. `summary` 与正文必须使用中文表达。
7. 若包含正文，第 2 行必须是空行。
8. `perf` 必须包含正文说明优化原因。

## 快速模板

```text
fix(scope): 优化某个单一行为

仅在需要时写正文，说明原因或背景
```

## 失败处理

1. 阅读脚本返回的逐条错误。
2. 仅修改被指出的问题，避免一次改多个意图。
3. 重新执行校验，直到输出“校验通过”。

## 资源

- `skills/git-commit-helper/scripts/validate_commit_message.py`：提交信息规则校验器
