const os = require("node:os");
const path = require("node:path");

const DEFAULT_DEST = path.join(os.homedir(), ".agents", "skills");
const DEFAULT_REPO = "ice909/codex-workbench";
const DEFAULT_BRANCH = "main";
const INDEX_FILE = "skills-index.json";

module.exports = {
  DEFAULT_DEST,
  DEFAULT_REPO,
  DEFAULT_BRANCH,
  INDEX_FILE
};
