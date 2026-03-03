const path = require("node:path");

const { DEFAULT_BRANCH, INDEX_FILE } = require("./constants");
const { CliError } = require("./errors");
const { fetchJson } = require("./http");
const { buildRawUrl } = require("./source");

function validateSkillPath(skillPath) {
  if (typeof skillPath !== "string" || skillPath.trim() === "") {
    return false;
  }

  if (skillPath.includes("\\")) {
    return false;
  }

  if (!skillPath.startsWith("skills/")) {
    return false;
  }

  if (path.posix.isAbsolute(skillPath)) {
    return false;
  }

  const normalized = path.posix.normalize(skillPath);
  if (normalized !== skillPath) {
    return false;
  }

  if (normalized.includes("..")) {
    return false;
  }

  const parts = normalized.split("/");
  return parts.every((part) => part.length > 0);
}

function validateSkillFilePath(filePath) {
  if (typeof filePath !== "string" || filePath.trim() === "") {
    return false;
  }

  if (filePath.includes("\\")) {
    return false;
  }

  if (path.posix.isAbsolute(filePath)) {
    return false;
  }

  const normalized = path.posix.normalize(filePath);
  if (normalized !== filePath) {
    return false;
  }

  if (
    normalized === "." ||
    normalized.includes("..") ||
    normalized.startsWith("/") ||
    normalized.endsWith("/")
  ) {
    return false;
  }

  return normalized.split("/").every((part) => part.length > 0);
}

function validateSkillsIndex(index) {
  if (!index || typeof index !== "object" || Array.isArray(index)) {
    throw new CliError("Invalid skills-index.json: root must be an object.");
  }

  if (index.schemaVersion !== 2) {
    throw new CliError(
      `Invalid skills-index.json: schemaVersion must be 2, got ${String(index.schemaVersion)}.`
    );
  }

  if (!Array.isArray(index.skills)) {
    throw new CliError("Invalid skills-index.json: skills must be an array.");
  }

  const nameSet = new Set();
  const normalizedSkills = [];

  for (const item of index.skills) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new CliError("Invalid skills-index.json: each skill entry must be an object.");
    }

    const { name, path: skillPath, description, files } = item;
    if (typeof name !== "string" || name.trim() === "") {
      throw new CliError("Invalid skills-index.json: skill.name must be a non-empty string.");
    }

    if (nameSet.has(name)) {
      throw new CliError(`Invalid skills-index.json: duplicated skill name "${name}".`);
    }
    nameSet.add(name);

    if (!validateSkillPath(skillPath)) {
      throw new CliError(
        `Invalid skills-index.json: skill "${name}" has invalid path "${String(skillPath)}".`
      );
    }

    if (!Array.isArray(files) || files.length === 0) {
      throw new CliError(`Invalid skills-index.json: skill "${name}" must define files[].`);
    }

    const fileSet = new Set();
    const normalizedFiles = [];
    for (const filePath of files) {
      if (!validateSkillFilePath(filePath)) {
        throw new CliError(
          `Invalid skills-index.json: skill "${name}" has invalid file path "${String(filePath)}".`
        );
      }

      if (fileSet.has(filePath)) {
        throw new CliError(
          `Invalid skills-index.json: skill "${name}" has duplicated file "${filePath}".`
        );
      }

      fileSet.add(filePath);
      normalizedFiles.push(filePath);
    }

    if (!fileSet.has("SKILL.md")) {
      throw new CliError(`Invalid skills-index.json: skill "${name}" must include SKILL.md.`);
    }

    normalizedSkills.push({
      name,
      path: skillPath,
      description: typeof description === "string" ? description : "",
      files: normalizedFiles.sort()
    });
  }

  return {
    schemaVersion: 2,
    skills: normalizedSkills
  };
}

async function fetchSkillsIndex({ repo }) {
  const indexUrl = buildRawUrl(repo, DEFAULT_BRANCH, INDEX_FILE);
  const raw = await fetchJson(indexUrl);
  return validateSkillsIndex(raw);
}

function createSkillsMap(index) {
  return new Map(index.skills.map((skill) => [skill.name, skill]));
}

module.exports = {
  fetchSkillsIndex,
  createSkillsMap,
  validateSkillsIndex
};
