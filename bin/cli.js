#!/usr/bin/env node

const { run } = require("../lib/cli");
const { formatError } = require("../lib/errors");

run(process.argv.slice(2)).catch((error) => {
  console.error(`Error: ${formatError(error)}`);
  process.exitCode = 1;
});
