---
name: git-commit-helper
description: "严格生成与校验中文 Git 提交信息，固定格式为 type(scope): summary，type 仅允许 feat/fix/refactor/perf/style/test/docs/chore，summary 必须用祈使句、不超过 50 字符、不得以句号结尾且不得包含 and/&/multiple changes。使用该技能于编写提交说明、检查提交文本是否合规，或执行使用 codex (codex-ice@gmail.com) 身份的提交时。"
---

按固定规范生成中文提交信息，并在提交前进行格式校验。
统一使用作者身份：`codex <codex-ice@gmail.com>`。

## 工作流

1. 先查看暂存变更，确认本次提交只表达一个意图：`git diff --cached --name-status`。
2. 选择 `type`，必须是以下之一：`feat` `fix` `refactor` `perf` `style` `test` `docs` `chore`。
3. 写首行：`<type>(<scope>): <summary>`。
4. 首行后可选正文；若 `type=perf`，必须写正文说明优化原因。
5. 使用脚本校验：`python3 scripts/validate_commit_message.py --file <msg-file>`。
6. 通过校验后提交，并固定作者身份：
   `git -c user.name='codex' -c user.email='codex-ice@gmail.com' commit -F <msg-file>`。

## 强制规则

1. 格式必须严格为：`<type>(<scope>): <summary>`。
2. `type` 只能从这 8 个值中选择：`feat` `fix` `refactor` `perf` `style` `test` `docs` `chore`。
3. `summary` 必须满足：
   - 使用祈使句。
   - 不超过 50 字符。
   - 不要句号（`。` 或 `.`）。
   - 不要出现 `and`、`&`、`multiple changes`。
   - 使用中文表达。
4. 提交文本（`summary` 与可选正文）使用中文。
5. `perf` 类型必须在正文说明优化原因。

## 示例

正确：
- `fix(album): 避免滚动时重复渲染`
- `docs(api): 补充鉴权参数说明`

错误：
- `update code`
- `fix bug and refactor logic`
- `optimize`

## 脚本资源

- `scripts/validate_commit_message.py`
  校验提交文本是否符合本技能的强制规则。
