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

## npm CLI（npx 安装 skills）

本仓库已提供可执行 CLI，包名/命令名为 `agent-skill-installer`。

```bash
# 查看可安装 skills
npx agent-skill-installer list

# 安装一个 skill（默认安装到 ~/.agent/skills）
npx agent-skill-installer install git-commit-helper

# 一次安装多个 skills
npx agent-skill-installer install git-commit-helper codex-session-daily-report

# 安装到自定义目录
npx agent-skill-installer install git-commit-helper --dest ~/.agent/skills

# 覆盖已存在 skill
npx agent-skill-installer install git-commit-helper --force
```

发布到 npm 后，其他人即可直接使用上述 `npx` 命令。

## 约定

1. 单一 skill 放在 `skills/<skill-name>/`。
2. 每个 skill 至少包含 `SKILL.md`。
3. 优先小步提交，每次只做一个明确意图的变更。
