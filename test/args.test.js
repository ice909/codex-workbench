const test = require("node:test");
const assert = require("node:assert/strict");

const { parseArgs } = require("../lib/args");

test("parseArgs: help by default", () => {
  assert.deepEqual(parseArgs([]), { command: "help" });
});

test("parseArgs: index with default repo", () => {
  const parsed = parseArgs(["index"]);
  assert.equal(parsed.command, "index");
  assert.equal(parsed.repo, "ice909/codex-workbench");
});

test("parseArgs: get with names and options", () => {
  const parsed = parseArgs(["get", "a", "b", "--force", "--dest", "./tmp", "--repo", "x/y"]);
  assert.equal(parsed.command, "get");
  assert.equal(parsed.names.length, 2);
  assert.equal(parsed.names[0], "a");
  assert.equal(parsed.names[1], "b");
  assert.equal(parsed.force, true);
  assert.equal(parsed.repo, "x/y");
});

test("parseArgs: get requires at least one skill", () => {
  assert.throws(() => parseArgs(["get"]), /Please provide at least one skill name/);
});

test("parseArgs: unknown command", () => {
  assert.throws(() => parseArgs(["list"]), /Unknown command/);
});
