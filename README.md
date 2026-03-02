# codex-workbench

用于迭代维护个人 Codex 能力资产的工作仓库。

## 目录结构

```text
.
├── skills/      # 各个 skill 的主目录（一项能力一个子目录）
├── scripts/     # 跨 skill 的通用脚本
├── templates/   # 可复用模板（提交信息、报告、提示词等）
└── docs/        # 设计说明与维护文档
```

## 当前 Skills

- `codex-session-daily-report`
- `git-commit-helper`

## 约定

1. 单一 skill 放在 `skills/<skill-name>/`。
2. 每个 skill 至少包含 `SKILL.md`。
3. 优先小步提交，每次只做一个明确意图的变更。
