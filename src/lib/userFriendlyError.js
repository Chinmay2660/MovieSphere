const NETWORK_PATTERN = /network|fetch failed|failed to fetch|econn|enotfound/i;
const TIMEOUT_PATTERN = /timeout|timed out/i;
const DOWNLOAD_UNAVAILABLE_PATTERN =
  /no stream url|stream resolver|embed providers|hls playlist|download failed \(\d+\)/i;

export const USER_MESSAGES = {
  generic: "Something went wrong. Please try again.",
  loadContent: "We couldn't load this content right now. Please try again.",
  search: "We couldn't load search results. Please try again.",
  download: "Download didn't complete. Please try again.",
  downloadUnavailable:
    "This title isn't available for download right now. Try watching online instead.",
  network: "We couldn't connect right now. Check your internet and try again.",
  timeout: "This is taking longer than expected. Please try again.",
  playback: "This download can't be played in your browser. Try playing it online instead.",
  rateLimit: "We're getting a lot of requests. Please wait a moment and try again.",
};

export const toUserMessage = (error, context = "generic") => {
  const message = typeof error === "string" ? error : error?.message ?? "";
  const status = error?.response?.status ?? error?.status;

  if (!message && !status) {
    if (context === "download") return USER_MESSAGES.download;
    if (context === "search") return USER_MESSAGES.search;
    if (context === "load") return USER_MESSAGES.loadContent;
    return USER_MESSAGES.generic;
  }

  if (TIMEOUT_PATTERN.test(message)) return USER_MESSAGES.timeout;
  if (NETWORK_PATTERN.test(message)) return USER_MESSAGES.network;
  if (status === 429 || /too many requests/i.test(message)) return USER_MESSAGES.rateLimit;

  if (context === "download" || context === "download-display") {
    if (
      DOWNLOAD_UNAVAILABLE_PATTERN.test(message) ||
      /isn't available for download/i.test(message) ||
      /streaming not supported/i.test(message)
    ) {
      return USER_MESSAGES.downloadUnavailable;
    }
    if (/didn't complete|was interrupted/i.test(message)) return message;
    if (context === "download-display" && message.length < 120 && !/[{}[\]\\]/.test(message)) {
      const looksTechnical =
        /ECONN|ETIMEDOUT|ERR_|axios|javascript|iframe|html|mp4|mpeg|hls|status code/i.test(
          message
        );
      if (!looksTechnical) return message;
    }
    return USER_MESSAGES.download;
  }

  if (context === "search") return USER_MESSAGES.search;
  if (context === "load") return USER_MESSAGES.loadContent;
  if (context === "playback") return USER_MESSAGES.playback;

  return USER_MESSAGES.generic;
};
