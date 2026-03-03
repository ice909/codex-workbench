const test = require("node:test");
const assert = require("node:assert/strict");

const { validateSkillsIndex } = require("../lib/index-client");

test("validateSkillsIndex accepts valid schema", () => {
  const input = {
    schemaVersion: 2,
    skills: [
      {
        name: "demo-skill",
        path: "skills/demo-skill",
        description: "demo",
        files: ["SKILL.md", "agents/openai.yaml"]
      }
    ]
  };

  const output = validateSkillsIndex(input);
  assert.equal(output.schemaVersion, 2);
  assert.equal(output.skills.length, 1);
  assert.equal(output.skills[0].name, "demo-skill");
});

test("validateSkillsIndex rejects duplicate names", () => {
  const input = {
    schemaVersion: 2,
    skills: [
      { name: "dup", path: "skills/dup", files: ["SKILL.md"] },
      { name: "dup", path: "skills/dup-2", files: ["SKILL.md"] }
    ]
  };

  assert.throws(() => validateSkillsIndex(input), /duplicated skill name/);
});

test("validateSkillsIndex rejects invalid path", () => {
  const input = {
    schemaVersion: 2,
    skills: [{ name: "bad", path: "../bad", files: ["SKILL.md"] }]
  };

  assert.throws(() => validateSkillsIndex(input), /invalid path/);
});

test("validateSkillsIndex requires SKILL.md in files", () => {
  const input = {
    schemaVersion: 2,
    skills: [{ name: "bad", path: "skills/bad", files: ["agents/openai.yaml"] }]
  };

  assert.throws(() => validateSkillsIndex(input), /must include SKILL.md/);
});
