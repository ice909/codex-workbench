# codex-workbench

用于迭代维护个人 Codex 能力资产的工作仓库。

## 目录结构

```text
.
├── skills/            # 各个 skill 的主目录（一项能力一个子目录）
├── scripts/           # 仓库级辅助说明
├── templates/         # 可复用模板（提交信息、报告、提示词等）
└── docs/              # 设计说明与维护文档
```

## 当前 Skills

- `codex-session-daily-report`
- `git-commit-helper`

## 安装 Skills

本仓库不再提供自带 CLI。安装请使用第三方 CLI：[`vercel-labs/skills`](https://github.com/vercel-labs/skills/blob/main/README.md)。

这个 CLI 会从 GitHub 仓库中自动发现 `SKILL.md`，不需要本仓库额外维护安装器或索引文件。
下文示例统一使用当前仓库的 GitHub shorthand：`ice909/codex-workbench`。

### 常用命令

```bash
# 查看本仓库可安装的 skills
npx skills add ice909/codex-workbench --list

# 安装一个 skill
npx skills add ice909/codex-workbench --skill git-commit-helper

# 一次安装多个 skills
npx skills add ice909/codex-workbench --skill git-commit-helper --skill codex-session-daily-report

# 为 Codex 全局安装一个 skill
npx skills add ice909/codex-workbench -a codex -g --skill git-commit-helper -y

# 为 Codex 全局安装本仓库全部 skills
npx skills add ice909/codex-workbench -a codex -g --skill '*' -y
```

### 参数说明

- `--list`：只列出仓库里的可安装 skills，不执行安装
- `--skill <name>`：按名称安装指定 skill，可重复传入多个
- `-a, --agent <agent>`：安装到指定 agent，例如 `codex`
- `-g, --global`：安装到用户级目录，而不是当前项目
- `-y, --yes`：跳过交互确认，适合脚本或 CI

### 源地址写法

```bash
# GitHub shorthand
npx skills add ice909/codex-workbench

# 完整 GitHub URL
npx skills add https://github.com/ice909/codex-workbench

# 直接指向仓库内某个 skill 目录
npx skills add https://github.com/ice909/codex-workbench/tree/main/skills/git-commit-helper
```

### 安装位置

根据上游 README，`skills` CLI 默认会安装到项目目录；加 `-g` 时安装到用户目录。

- Codex 项目级目录：`.agents/skills/`
- Codex 全局目录：`~/.codex/skills/`

如果不显式指定 `--agent`，CLI 会自动检测本机可用的 agent；如果没有检测到，会提示你选择。

## 约定

1. 单一 skill 放在 `skills/<skill-name>/`。
2. 每个 skill 至少包含 `SKILL.md`。
3. 优先小步提交，每次只做一个明确意图的变更。
