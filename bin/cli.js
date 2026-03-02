#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");

const REPO_ROOT = path.resolve(__dirname, "..");
const SKILLS_SOURCE_DIR = path.join(REPO_ROOT, "skills");
const DEFAULT_DEST = path.join(os.homedir(), ".agents", "skills");

function printHelp() {
  console.log(`agent-skill-installer

Usage:
  npx agent-skill-installer list
  npx agent-skill-installer install <skill...> [--dest <path>] [--force]

Commands:
  list                   List installable skills in this package.
  install <skill...>     Install one or more skills to ~/.agents/skills by default.

Options:
  --dest <path>          Custom destination directory.
  --force                Overwrite destination if a skill already exists.
  -h, --help             Show this help.
`);
}

async function dirExists(targetPath) {
  try {
    const stat = await fs.stat(targetPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function getAvailableSkills() {
  const entries = await fs.readdir(SKILLS_SOURCE_DIR, { withFileTypes: true });
  const skills = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const skillDir = path.join(SKILLS_SOURCE_DIR, entry.name);
    const skillFile = path.join(skillDir, "SKILL.md");

    try {
      await fs.access(skillFile);
      skills.push(entry.name);
    } catch {
      // Skip folders that are not valid skills.
    }
  }

  return skills.sort();
}

function parseInstallArgs(args) {
  const parsed = {
    names: [],
    dest: DEFAULT_DEST,
    force: false
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === "--dest") {
      const value = args[i + 1];
      if (!value || value.startsWith("-")) {
        throw new Error("Missing value for --dest");
      }
      parsed.dest = path.resolve(value);
      i += 1;
      continue;
    }

    if (arg === "--force") {
      parsed.force = true;
      continue;
    }

    if (arg === "-h" || arg === "--help") {
      parsed.help = true;
      continue;
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    parsed.names.push(arg);
  }

  return parsed;
}

async function listSkills() {
  const skills = await getAvailableSkills();

  if (skills.length === 0) {
    console.log("No installable skills found in this package.");
    return;
  }

  console.log("Installable skills:");
  for (const skill of skills) {
    console.log(`- ${skill}`);
  }
}

async function installSkills(rawArgs) {
  const parsed = parseInstallArgs(rawArgs);
  if (parsed.help) {
    printHelp();
    return;
  }

  if (parsed.names.length === 0) {
    throw new Error("Please provide at least one skill name to install.");
  }

  const available = new Set(await getAvailableSkills());
  for (const name of parsed.names) {
    if (!available.has(name)) {
      throw new Error(`Skill "${name}" not found. Run "list" to view available skills.`);
    }
  }

  await fs.mkdir(parsed.dest, { recursive: true });

  for (const name of parsed.names) {
    const from = path.join(SKILLS_SOURCE_DIR, name);
    const to = path.join(parsed.dest, name);
    const exists = await dirExists(to);

    if (exists && !parsed.force) {
      throw new Error(
        `Destination already exists for "${name}": ${to} (use --force to overwrite)`
      );
    }

    if (exists && parsed.force) {
      await fs.rm(to, { recursive: true, force: true });
    }

    await fs.cp(from, to, { recursive: true });
    console.log(`Installed "${name}" -> ${to}`);
  }

  console.log("Done. Restart Codex to pick up new skills.");
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "-h" || command === "--help") {
    printHelp();
    return;
  }

  if (command === "list") {
    await listSkills();
    return;
  }

  if (command === "install") {
    await installSkills(args.slice(1));
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
