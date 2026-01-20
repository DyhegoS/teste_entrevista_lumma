const axios = require("axios");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWithRetry(url, config, maxRetries = 6) {
  let attempt = 0;

  while (true) {
    try {
      return await axios.get(url, config);
    } catch (err) {
      const status = err?.response?.status;
      const retryable = status === 429 || (status >= 500 && status <= 599);

      if (!retryable || attempt >= maxRetries) {
        throw err;
      }

      const retryAfter = err?.response?.headers?.["retry-after"];
      let waitMs;

      if (retryAfter && !isNaN(retryAfter)) {
        waitMs = Number(retryAfter) * 1000;
      } else {
        const base = 800;
        const backoff = base * Math.pow(2, attempt);
        const jitter = Math.floor(Math.random() * 300);
        waitMs = backoff + jitter;
      }

      attempt++;
      console.log(
        `Rate limit (${status}). Tentando novamente em ${waitMs}ms (tentativa ${attempt}/${maxRetries})`
      );

      await sleep(waitMs);
    }
  }
}

module.exports = {
  getWithRetry,
  sleep
};
