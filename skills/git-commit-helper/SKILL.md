---
name: git-commit-helper
description: "快速生成中文 Git 单行提交信息，固定格式为 type(scope): summary，type 仅允许 feat/fix/refactor/perf/style/test/docs/chore，summary 必须用祈使句、不超过 50 字符、不得以句号结尾且不得包含 and/&/multiple changes。使用该技能于编写提交说明、检查提交文本是否合规，或执行使用 codex (codex-ice@gmail.com) 身份的提交时。"
---

生成中文单行提交信息。默认直接提交，不编写正文，不把校验脚本当成必经步骤。统一使用作者身份：`codex <codex-ice@gmail.com>`。

## 快路径

1. 检查暂存区，确认这次提交的主要目的：
`git diff --cached --name-status`
2. 先判断 `type`，不要默认写成 `fix`。
3. 写首行，固定格式：
`<type>(<scope>): <summary>`
4. 直接提交：
`git -c user.name='codex' -c user.email='codex-ice@gmail.com' commit -m "<type>(<scope>): <summary>"`
5. 不要在 `-m` 参数里拼接 `\n`，也不要补正文；字面量 `\n` 提交后会原样显示。

## 强制规则

1. 首行必须是：`<type>(<scope>): <summary>`。
2. `scope` 只允许小写字母、数字、连字符（例如 `album`、`build-cache`）。
3. `summary` 必须使用中文祈使句，且不超过 50 字符。
4. `summary` 不能以 `。` 或 `.` 结尾。
5. `summary` 不能包含 `and`、`&`、`multiple changes`。
6. `summary` 必须使用中文表达。
7. 当前技能只生成单行提交信息，不编写正文。

## 类型判断

1. 先看变更结果，再选 `type`，不要因为“改了代码”就直接用 `fix`。
2. 新增能力、新入口、新页面、新接口、新命令、新选项、新交互、新配置能力，统一优先用 `feat`。
3. 修复既有错误、回归、异常、错误文案、错误状态、崩溃、兼容性问题，才用 `fix`。
4. 仅重组实现、不改变外部行为，用 `refactor`。
5. 明确以性能为目标的优化，用 `perf`。
6. 样式微调且不涉及新能力，用 `style`。
7. 仅测试改动，用 `test`；仅文档改动，用 `docs`；杂项工具链或脚手架调整，用 `chore`。

## feat / fix 决策

1. 如果这次提交让用户、调用方或开发者“现在可以做一件之前做不到的事”，用 `feat`。
2. 如果这次提交只是把“本来就该能做的事恢复正常”，用 `fix`。
3. 即使实现里顺手修了旧逻辑，只要主效果是新增能力，仍然用 `feat`。
4. 只有在暂存区或任务上下文里能明确指出被修复的问题时，才使用 `fix`。
5. 当 `feat` 和 `fix` 难以判断时，默认先排查是否是“新增能力”；是则用 `feat`，不是再考虑 `fix`。
6. 禁止把 `fix` 当默认类型。没有明确 bug 证据时，不要用 `fix`。

## 执行原则

1. 默认不要先调用校验脚本，直接按规则生成并提交。
2. 始终使用单条 `git commit -m "<header>"`。
3. 不要使用第二个 `-m`，也不要在提交信息里手写 `\n`。
4. 暂存区优先保持单一提交目的，但不要把“只能改一种文件或一个目录”当成硬约束。
5. 只有在用户明确要求校验提交信息，或连续两次写错格式时，才调用校验脚本兜底。

## 快速模板

```text
feat(scope): 增加某个新能力
```

```text
fix(scope): 修复某个已知问题
```

```text
refactor(scope): 重组某处实现
```

```text
perf(scope): 优化某个热点路径
```

## 资源

- `skills/git-commit-helper/scripts/validate_commit_message.py`：可选的单行提交信息校验器，仅在需要兜底时使用
