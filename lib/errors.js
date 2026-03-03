class CliError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "CliError";
    this.code = options.code || "ERR_CLI";
    this.cause = options.cause;
  }
}

function formatError(error) {
  if (error instanceof CliError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return String(error);
}

module.exports = {
  CliError,
  formatError
};
