import { pickYoutubeTrailer, youtubeEmbedUrl } from '../src/lib/tmdbVideos.js';
import {
  isYoutubeEndedMessage,
  isYoutubeErrorMessage,
  isYoutubePlayingMessage,
  isYoutubeActiveMessage,
} from '../src/lib/youtubeEmbed.js';

const sample = {
  results: [
    { site: 'Vimeo', key: 'x', type: 'Trailer' },
    { site: 'YouTube', key: 'abc123', type: 'Teaser' },
    { site: 'YouTube', key: 'official1', type: 'Trailer', official: true },
  ],
};

const picked = pickYoutubeTrailer(sample);
if (!picked || picked.key !== 'official1') {
  throw new Error('pickYoutubeTrailer failed');
}
if (!youtubeEmbedUrl('k', { mute: true }).includes('mute=1')) {
  throw new Error('youtubeEmbedUrl failed');
}
if (!youtubeEmbedUrl('k', { controls: false }).includes('controls=0')) {
  throw new Error('youtubeEmbedUrl controls failed');
}
if (!isYoutubeEndedMessage({ event: 'onStateChange', info: 0 })) {
  throw new Error('isYoutubeEndedMessage failed');
}
if (!isYoutubePlayingMessage({ event: 'onStateChange', info: 1 })) {
  throw new Error('isYoutubePlayingMessage failed');
}
if (!isYoutubeActiveMessage({ event: 'onStateChange', info: 3 })) {
  throw new Error('isYoutubeActiveMessage failed');
}
if (!isYoutubeErrorMessage({ event: 'onError', info: 101 })) {
  throw new Error('isYoutubeErrorMessage failed');
}
console.log('tmdbVideos-selfcheck ok');
