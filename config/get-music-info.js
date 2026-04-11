const mm = require('music-metadata');
const fetch = require('node-fetch').default;

async function getSongInfoFromUrl(url) {
  const response = await fetch(url);
  const stream = response.body;

  const metadata = await mm.parseStream(stream, {
    mimeType: 'audio/mpeg', // or 'audio/flac', 'audio/ogg', etc.
    size: parseInt(response.headers.get('content-length'))
  });

  const duration = metadata.format.duration;
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60).toString().padStart(2, '0');

  return {
    title:            metadata.common.title,
    artist:           metadata.common.artist,
    album:            metadata.common.album,
    duration_ms:      Math.round(duration * 1000),
    duration_display: `${minutes}:${seconds}`
  };
}

// Usage
module.exports = getSongInfoFromUrl;