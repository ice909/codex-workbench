const { CliError } = require("./errors");

const BASE_HEADERS = {
  "user-agent": "agent-skill-installer"
};

async function request(url, headers = {}) {
  let response;
  try {
    response = await fetch(url, { headers: { ...BASE_HEADERS, ...headers } });
  } catch (error) {
    throw new CliError(`Network request failed: ${url}`, { cause: error });
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new CliError(`Resource not found: ${url}`);
    }

    if (response.status === 403) {
      throw new CliError(`Access denied or rate limited by GitHub: ${url}`);
    }

    throw new CliError(`Request failed (${response.status}): ${url}`);
  }

  return response;
}

async function fetchJson(url) {
  const response = await request(url, { accept: "application/json" });

  try {
    return await response.json();
  } catch (error) {
    throw new CliError(`Failed to parse JSON response: ${url}`, { cause: error });
  }
}

async function fetchBuffer(url) {
  const response = await request(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
}

module.exports = {
  fetchJson,
  fetchBuffer
};
