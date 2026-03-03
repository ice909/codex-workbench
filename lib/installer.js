const fs = require("node:fs/promises");
const path = require("node:path");
const readline = require("node:readline/promises");

const { CliError } = require("./errors");
const { fetchBuffer } = require("./http");
const { DEFAULT_BRANCH } = require("./constants");
const { buildRawUrl } = require("./source");

async function dirExists(targetPath) {
  try {
    const stat = await fs.stat(targetPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

function safeRelativePath(relative) {
  if (relative.includes("\\")) {
    throw new CliError(`Unsafe relative path "${relative}".`);
  }

  const normalized = path.posix.normalize(relative);
  if (
    normalized === "." ||
    normalized.startsWith("../") ||
    normalized.includes("/../") ||
    path.posix.isAbsolute(normalized)
  ) {
    throw new CliError(`Unsafe relative path "${relative}".`);
  }

  return normalized;
}

async function confirmOverwrite(name, targetPath) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new CliError(
      `Destination already exists for "${name}": ${targetPath} (non-interactive mode, use --force to overwrite)`
    );
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    const answer = (
      await rl.question(
        `Skill "${name}" already exists at ${targetPath}. Overwrite it? [y/N] `
      )
    )
      .trim()
      .toLowerCase();

    return answer === "y" || answer === "yes";
  } finally {
    rl.close();
  }
}

async function installOneSkill({ repo, skill, dest, force }) {
  const to = path.join(dest, skill.name);
  const exists = await dirExists(to);

  if (exists && force) {
    await fs.rm(to, { recursive: true, force: true });
  }

  if (exists && !force) {
    const shouldOverwrite = await confirmOverwrite(skill.name, to);
    if (!shouldOverwrite) {
      console.log(`Skipped "${skill.name}" (kept existing skill).`);
      return;
    }

    await fs.rm(to, { recursive: true, force: true });
  }

  const tmpDir = path.join(dest, `.${skill.name}.tmp-${process.pid}-${Date.now()}`);
  await fs.mkdir(tmpDir, { recursive: true });

  try {
    for (const relativeFile of skill.files) {
      const relative = safeRelativePath(relativeFile);
      const targetFile = path.join(tmpDir, relative);
      await fs.mkdir(path.dirname(targetFile), { recursive: true });
      const remotePath = path.posix.join(skill.path, relative);
      const body = await fetchBuffer(buildRawUrl(repo, DEFAULT_BRANCH, remotePath));
      await fs.writeFile(targetFile, body);
    }

    await fs.rename(tmpDir, to);
    console.log(`Installed "${skill.name}" -> ${to}`);
  } catch (error) {
    await fs.rm(tmpDir, { recursive: true, force: true });
    throw error;
  }
}

async function installSkills({ repo, skills, dest, force }) {
  await fs.mkdir(dest, { recursive: true });

  for (const skill of skills) {
    await installOneSkill({ repo, skill, dest, force });
  }

  console.log("Done. Restart Codex to pick up new skills.");
}

module.exports = {
  installSkills
};
