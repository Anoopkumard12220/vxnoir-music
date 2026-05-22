// ═══════════════════════════════════════════════
// VXNOIR MUSIC — Centralized API Manager
// Supports: Audius, iTunes, Jamendo, Archive.org
// ═══════════════════════════════════════════════

const AUDIUS_HOSTS = [
  'https://discoveryprovider.audius.co',
  'https://discoveryprovider2.audius.co',
  'https://discoveryprovider3.audius.co',
]

let audiusHost = AUDIUS_HOSTS[0]

// ── Normalize track shape ──────────────────────────
const normalizeAudius = (t) => ({
  id: `audius_${t.id}`,
  title: t.title || 'Unknown',
  artist: t.user?.name || 'Unknown Artist',
  album: '',
  artwork: t.artwork?.['480x480'] || t.artwork?.['150x150'] || null,
  streamUrl: `${audiusHost}/v1/tracks/${t.id}/stream?app_name=VXNOIR`,
  previewUrl: null,
  duration: t.duration || 0,
  genre: t.genre || '',
  playCount: t.play_count || 0,
  source: 'audius',
})

const normalizeiTunes = (t) => ({
  id: `itunes_${t.trackId}`,
  title: t.trackName || 'Unknown',
  artist: t.artistName || 'Unknown Artist',
  album: t.collectionName || '',
  artwork: t.artworkUrl100?.replace('100x100', '500x500') || null,
  streamUrl: null,
  previewUrl: t.previewUrl || null,
  duration: Math.floor((t.trackTimeMillis || 30000) / 1000),
  genre: t.primaryGenreName || '',
  playCount: 0,
  source: 'itunes',
})

const normalizeJamendo = (t) => ({
  id: `jamendo_${t.id}`,
  title: t.name || 'Unknown',
  artist: t.artist_name || 'Unknown Artist',
  album: t.album_name || '',
  artwork: t.album_image || t.image || null,
  streamUrl: t.audio || null,
  previewUrl: t.audiodownload || t.audio || null,
  duration: t.duration || 0,
  genre: '',
  playCount: t.shareurl ? 0 : 0,
  source: 'jamendo',
})

const normalizeArchive = (t) => ({
  id: `archive_${t.identifier}`,
  title: t.title || t.identifier || 'Unknown',
  artist: t.creator || 'Unknown Artist',
  album: '',
  artwork: t.thumb ? `https://archive.org${t.thumb}` : null,
  streamUrl: null,
  previewUrl: null,
  duration: 0,
  genre: t.subject || '',
  playCount: t.downloads || 0,
  source: 'archive',
})

// ── Audius API ────────────────────────────────────
async function fetchAudiusTrending(limit = 20) {
  try {
    const res = await fetch(
      `${audiusHost}/v1/tracks/trending?app_name=VXNOIR&limit=${limit}`,
      { signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) throw new Error('Audius failed')
    const data = await res.json()
    return (data.data || []).map(normalizeAudius)
  } catch {
    // Try fallback host
    audiusHost = AUDIUS_HOSTS[1]
    try {
      const res = await fetch(
        `${audiusHost}/v1/tracks/trending?app_name=VXNOIR&limit=${limit}`,
        { signal: AbortSignal.timeout(5000) }
      )
      const data = await res.json()
      return (data.data || []).map(normalizeAudius)
    } catch { return [] }
  }
}

async function searchAudius(query, limit = 20) {
  try {
    const res = await fetch(
      `${audiusHost}/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=VXNOIR&limit=${limit}`,
      { signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) throw new Error()
    const data = await res.json()
    return (data.data || []).map(normalizeAudius)
  } catch { return [] }
}

async function fetchAudiusGenre(genre, limit = 15) {
  try {
    const res = await fetch(
      `${audiusHost}/v1/tracks/trending?genre=${encodeURIComponent(genre)}&app_name=VXNOIR&limit=${limit}`,
      { signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) throw new Error()
    const data = await res.json()
    return (data.data || []).map(normalizeAudius)
  } catch { return [] }
}

// ── iTunes API ────────────────────────────────────
async function fetchiTunesSearch(query, limit = 20, entity = 'song') {
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=${entity}&limit=${limit}&media=music`,
      { signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) throw new Error()
    const data = await res.json()
    return (data.results || []).map(normalizeiTunes)
  } catch { return [] }
}

async function fetchiTunesTopCharts(limit = 20) {
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=top+hits+2024&entity=song&limit=${limit}&media=music`,
      { signal: AbortSignal.timeout(6000) }
    )
    const data = await res.json()
    return (data.results || []).map(normalizeiTunes)
  } catch { return [] }
}

// ── Jamendo API ───────────────────────────────────
const JAMENDO_CLIENT = '5db5d1dc'

async function fetchJamendoTrending(limit = 15) {
  try {
    const res = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT}&format=json&limit=${limit}&order=popularity_total&include=musicinfo+stats&audioformat=mp31`,
      { signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) throw new Error()
    const data = await res.json()
    return (data.results || []).map(normalizeJamendo)
  } catch { return [] }
}

async function searchJamendo(query, limit = 10) {
  try {
    const res = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT}&format=json&limit=${limit}&search=${encodeURIComponent(query)}&audioformat=mp31`,
      { signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) throw new Error()
    const data = await res.json()
    return (data.results || []).map(normalizeJamendo)
  } catch { return [] }
}

async function fetchJamendoByMood(tags, limit = 10) {
  try {
    const res = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT}&format=json&limit=${limit}&tags=${encodeURIComponent(tags)}&audioformat=mp31&order=popularity_total`,
      { signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) throw new Error()
    const data = await res.json()
    return (data.results || []).map(normalizeJamendo)
  } catch { return [] }
}

// ── Archive.org ───────────────────────────────────
async function fetchArchiveMusic(query = 'jazz', limit = 10) {
  try {
    const res = await fetch(
      `https://archive.org/advancedsearch.php?q=mediatype:audio+subject:${encodeURIComponent(query)}&fl[]=identifier,title,creator,subject,downloads,thumb&rows=${limit}&output=json`,
      { signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) throw new Error()
    const data = await res.json()
    return (data.response?.docs || []).map(normalizeArchive)
  } catch { return [] }
}

// ── Merged search ─────────────────────────────────
export async function globalSearch(query) {
  const [audius, itunes, jamendo] = await Promise.all([
    searchAudius(query, 15),
    fetchiTunesSearch(query, 15),
    searchJamendo(query, 10),
  ])
  // Interleave results
  const merged = []
  const maxLen = Math.max(audius.length, itunes.length, jamendo.length)
  for (let i = 0; i < maxLen; i++) {
    if (audius[i]) merged.push(audius[i])
    if (itunes[i]) merged.push(itunes[i])
    if (jamendo[i]) merged.push(jamendo[i])
  }
  return merged
}

// ── Home feed ─────────────────────────────────────
export async function fetchHomeFeed() {
  const [trending, newReleases, jamendo, electronic, hiphop, chill] = await Promise.all([
    fetchAudiusTrending(20),
    fetchiTunesTopCharts(20),
    fetchJamendoTrending(15),
    fetchAudiusGenre('Electronic', 10),
    fetchAudiusGenre('Hip-Hop/Rap', 10),
    fetchJamendoByMood('chill+lofi', 10),
  ])

  return {
    trending: trending.length ? trending : jamendo.slice(0, 10),
    newReleases: newReleases.length ? newReleases : trending.slice(5, 15),
    jamendoPicks: jamendo,
    electronic,
    hiphop,
    chill,
    allTracks: [...trending, ...jamendo, ...newReleases],
  }
}

// ── Artists from Audius ───────────────────────────
export async function fetchTrendingArtists() {
  try {
    const res = await fetch(
      `${audiusHost}/v1/users/trending?app_name=VXNOIR&limit=12`,
      { signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) throw new Error()
    const data = await res.json()
    return (data.data || []).map(u => ({
      id: u.id,
      name: u.name,
      avatar: u.profile_picture?.['480x480'] || u.profile_picture?.['150x150'] || null,
      followers: u.follower_count || 0,
      tracks: u.track_count || 0,
    }))
  } catch { return [] }
}

// ── Mood map ──────────────────────────────────────
export const MOOD_MAP = {
  'Chill': { audius: 'Electronic', jamendo: 'chill+lofi', color: '#00b4ff' },
  'Hype': { audius: 'Hip-Hop/Rap', jamendo: 'hiphop+rap', color: '#f72585' },
  'Focus': { audius: 'Electronic', jamendo: 'electronic+ambient', color: '#9b5de5' },
  'Happy': { audius: 'Pop', jamendo: 'pop+happy', color: '#fee440' },
  'Dark': { audius: 'Metal', jamendo: 'metal+dark', color: '#55557a' },
  'Romantic': { audius: 'R&B/Soul', jamendo: 'soul+romantic', color: '#f72585' },
}

export async function fetchMoodTracks(mood) {
  const config = MOOD_MAP[mood]
  if (!config) return []
  const [audius, jamendo] = await Promise.all([
    fetchAudiusGenre(config.audius, 10),
    fetchJamendoByMood(config.jamendo, 10),
  ])
  return [...audius, ...jamendo]
}

export { fetchAudiusTrending, fetchiTunesTopCharts, fetchJamendoTrending, searchAudius, fetchiTunesSearch }
