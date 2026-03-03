const path = require("node:path");

const { DEFAULT_DEST, DEFAULT_REPO } = require("./constants");
const { CliError } = require("./errors");
const { normalizeRepo } = require("./source");

function printHelp() {
  console.log(`agent-skill-installer

Usage:
  npx agent-skill-installer index [--repo <owner/repo>]
  npx agent-skill-installer get <skill...> [--dest <path>] [--force] [--repo <owner/repo>]
  npx agent-skill-installer help

Commands:
  index                  List installable skills from GitHub index.
  get <skill...>         Install one or more skills to ~/.agents/skills by default.
  help                   Show this help.

Options:
  --repo <owner/repo>    Skill source repository (default: ice909/codex-workbench).
  --dest <path>          Custom destination directory.
  --force                Overwrite destination if a skill already exists (no prompt).
  -h, --help             Show this help.
`);
}

function parseArgs(argv) {
  const command = argv[0];

  if (!command || command === "-h" || command === "--help" || command === "help") {
    return { command: "help" };
  }

  if (command === "index") {
    return parseIndexArgs(argv.slice(1));
  }

  if (command === "get") {
    return parseGetArgs(argv.slice(1));
  }

  throw new CliError(`Unknown command: ${command}`);
}

function parseIndexArgs(args) {
  const parsed = {
    command: "index",
    repo: DEFAULT_REPO
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === "--repo") {
      const value = args[i + 1];
      if (!value || value.startsWith("-")) {
        throw new CliError("Missing value for --repo");
      }
      parsed.repo = normalizeRepo(value);
      i += 1;
      continue;
    }

    if (arg === "-h" || arg === "--help") {
      parsed.command = "help";
      return parsed;
    }

    throw new CliError(`Unknown option for index: ${arg}`);
  }

  return parsed;
}

function parseGetArgs(args) {
  const parsed = {
    command: "get",
    names: [],
    repo: DEFAULT_REPO,
    dest: DEFAULT_DEST,
    force: false
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === "--repo") {
      const value = args[i + 1];
      if (!value || value.startsWith("-")) {
        throw new CliError("Missing value for --repo");
      }
      parsed.repo = normalizeRepo(value);
      i += 1;
      continue;
    }

    if (arg === "--dest") {
      const value = args[i + 1];
      if (!value || value.startsWith("-")) {
        throw new CliError("Missing value for --dest");
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
      parsed.command = "help";
      return parsed;
    }

    if (arg.startsWith("-")) {
      throw new CliError(`Unknown option: ${arg}`);
    }

    parsed.names.push(arg);
  }

  if (parsed.names.length === 0) {
    throw new CliError("Please provide at least one skill name to install.");
  }

  return parsed;
}

module.exports = {
  parseArgs,
  printHelp
};
