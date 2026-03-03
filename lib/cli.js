const { parseArgs, printHelp } = require("./args");
const { fetchSkillsIndex, createSkillsMap } = require("./index-client");
const { CliError } = require("./errors");
const { installSkills } = require("./installer");

async function run(argv) {
  const parsed = parseArgs(argv);

  if (parsed.command === "help") {
    printHelp();
    return;
  }

  if (parsed.command === "index") {
    const index = await fetchSkillsIndex({ repo: parsed.repo });
    if (index.skills.length === 0) {
      console.log(`No installable skills found in ${parsed.repo}.`);
      return;
    }

    console.log(`Installable skills from ${parsed.repo}:`);
    for (const skill of index.skills) {
      if (skill.description) {
        console.log(`- ${skill.name}: ${skill.description}`);
      } else {
        console.log(`- ${skill.name}`);
      }
    }
    return;
  }

  if (parsed.command === "get") {
    const index = await fetchSkillsIndex({ repo: parsed.repo });
    const skillMap = createSkillsMap(index);

    const selected = parsed.names.map((name) => {
      const skill = skillMap.get(name);
      if (!skill) {
        throw new CliError(
          `Skill "${name}" not found in ${parsed.repo}. Run "index" to view available skills.`
        );
      }
      return skill;
    });

    await installSkills({
      repo: parsed.repo,
      skills: selected,
      dest: parsed.dest,
      force: parsed.force
    });
    return;
  }

  throw new CliError(`Unsupported command: ${parsed.command}`);
}

module.exports = {
  run
};
