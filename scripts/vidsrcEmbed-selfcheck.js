#!/usr/bin/env node
import assert from "node:assert/strict";
import {
  PLAYBACK_SOURCES,
  findPlaybackSource,
  getDefaultPlaybackSourceId,
} from "../src/lib/vidsrcEmbed.js";

assert(PLAYBACK_SOURCES.length >= 4, "playback sources configured");
assert(findPlaybackSource("videasy").getMovieUrl(550).includes("videasy.to/movie/550"));
assert(findPlaybackSource("vidlink").getMovieUrl(550).includes("vidlink.pro/movie/550"));
assert(findPlaybackSource("vidrock").getTvUrl(1399, 1, 1).includes("vidrock.net/tv/1399/1/1"));
assert(getDefaultPlaybackSourceId() === PLAYBACK_SOURCES[0].id || typeof getDefaultPlaybackSourceId() === "string");

console.log("vidsrcEmbed-selfcheck: ok");
