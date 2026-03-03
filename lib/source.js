const { CliError } = require("./errors");

function normalizeRepo(repo) {
  if (typeof repo !== "string" || repo.trim() === "") {
    throw new CliError("Repository cannot be empty.");
  }

  const value = repo.trim();
  const parts = value.split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new CliError(`Invalid repository "${repo}". Expected format: owner/repo.`);
  }

  return value;
}

function buildRawUrl(repo, branch, filePath) {
  return `https://raw.githubusercontent.com/${repo}/${branch}/${filePath}`;
}

module.exports = {
  normalizeRepo,
  buildRawUrl
};
