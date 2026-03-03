# codex-workbench

用于迭代维护个人 Codex 能力资产的工作仓库。

## 目录结构

```text
.
├── skills/            # 各个 skill 的主目录（一项能力一个子目录）
├── skills-index.json  # 远程安装索引（CLI 运行时读取）
├── scripts/           # 跨 skill 的通用脚本
├── templates/         # 可复用模板（提交信息、报告、提示词等）
└── docs/              # 设计说明与维护文档
```

## 当前 Skills

- `codex-session-daily-report`
- `git-commit-helper`

## npm CLI（npx 从 GitHub 安装 skills）

本仓库已提供可执行 CLI，包名/命令名为 `agent-skill-installer`。

```bash
# 查看可安装 skills
npx agent-skill-installer index

# 安装一个 skill（默认安装到 ~/.agents/skills）
npx agent-skill-installer get git-commit-helper

# 一次安装多个 skills
npx agent-skill-installer get git-commit-helper codex-session-daily-report

# 安装到自定义目录
npx agent-skill-installer get git-commit-helper --dest ~/.codex/skills

# 覆盖已存在 skill
npx agent-skill-installer get git-commit-helper --force

# 切换 skill 源仓库（owner/repo）
npx agent-skill-installer index --repo your-org/your-skill-repo
```

CLI 每次执行 `index/get` 都会实时请求 GitHub 上的 `skills-index.json`，并通过
`raw.githubusercontent.com` 下载文件，不依赖 `api.github.com` 速率额度。
因此更新 skills 时无需同步发布 CLI 新版本。

`skills-index.json`（`schemaVersion: 2`）示例：

```json
{
  "schemaVersion": 2,
  "skills": [
    {
      "name": "git-commit-helper",
      "path": "skills/git-commit-helper",
      "files": ["SKILL.md", "agents/openai.yaml", "scripts/validate_commit_message.py"]
    }
  ]
}
```

## 约定

1. 单一 skill 放在 `skills/<skill-name>/`。
2. 每个 skill 至少包含 `SKILL.md`。
3. `skills-index.json` 必须维护到最新，确保 `name/path/files` 与实际目录一致。
4. 优先小步提交，每次只做一个明确意图的变更。
