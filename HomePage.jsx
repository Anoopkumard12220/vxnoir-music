import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Zap, Music2, Headphones, RefreshCw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { usePlayer } from '../context/PlayerContext'
import { fetchHomeFeed, fetchTrendingArtists, MOOD_MAP, fetchMoodTracks } from '../api/musicApi'
import { TrackCardHorizontal, TrackListItem } from '../components/ui/TrackCard'
import { getGreeting, artworkFallback } from '../utils/helpers'
import toast from 'react-hot-toast'
import './HomePage.css'

const MOODS = Object.keys(MOOD_MAP)

export default function HomePage() {
  const { user, recentlyPlayed } = useApp()
  const { playTrack } = usePlayer()
  const [feed, setFeed] = useState(null)
  const [artists, setArtists] = useState([])
  const [activeMood, setActiveMood] = useState(null)
  const [moodTracks, setMoodTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [moodLoading, setMoodLoading] = useState(false)

  const loadFeed = useCallback(async () => {
    setLoading(true)
    try {
      const [feedData, artistData] = await Promise.all([
        fetchHomeFeed(),
        fetchTrendingArtists(),
      ])
      setFeed(feedData)
      setArtists(artistData)
    } catch (e) {
      toast.error('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadFeed() }, [loadFeed])

  const handleMood = async (mood) => {
    if (activeMood === mood) { setActiveMood(null); setMoodTracks([]); return }
    setActiveMood(mood)
    setMoodLoading(true)
    const tracks = await fetchMoodTracks(mood)
    setMoodTracks(tracks)
    setMoodLoading(false)
    if (tracks.length) toast.success(`${mood} vibes loaded 🎵`)
  }

  const bannerTrack = feed?.trending?.[0]

  return (
    <div className="home-page page-content">
      {/* Welcome banner */}
      <motion.div
        className="welcome-banner"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="welcome-text">
          <div className="welcome-greeting">{getGreeting(user?.name || 'Listener')}</div>
          <div className="welcome-sub">What are we listening to today?</div>
        </div>
        <button className="refresh-btn" onClick={loadFeed} title="Refresh feed">
          <RefreshCw size={16} />
        </button>
      </motion.div>

      {/* Hero Banner */}
      {bannerTrack && !loading && (
        <motion.div
          className="hero-banner"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          onClick={() => playTrack(bannerTrack, feed.trending)}
        >
          <img
            src={bannerTrack.artwork || artworkFallback(0)}
            alt=""
            className="hero-bg-img"
            onError={e => { e.target.src = artworkFallback(0) }}
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-badge"><Zap size={10} /> TRENDING NOW</div>
            <div className="hero-title">{bannerTrack.title}</div>
            <div className="hero-artist">{bannerTrack.artist}</div>
            <button className="hero-play-btn">▶ Play Now</button>
          </div>
        </motion.div>
      )}
      {loading && <div className="skeleton" style={{ height: 200, borderRadius: 20, marginBottom: 32 }} />}

      {/* Mood categories */}
      <section>
        <div className="section-header">
          <div className="section-title">Mood</div>
        </div>
        <div className="mood-row">
          {MOODS.map((mood) => (
            <motion.button
              key={mood}
              className={`mood-chip ${activeMood === mood ? 'active' : ''}`}
              style={{
                '--mood-color': MOOD_MAP[mood].color,
                borderColor: activeMood === mood ? MOOD_MAP[mood].color : 'transparent',
                background: activeMood === mood ? `${MOOD_MAP[mood].color}22` : 'rgba(255,255,255,0.05)',
              }}
              onClick={() => handleMood(mood)}
              whileTap={{ scale: 0.92 }}
            >
              {mood}
            </motion.button>
          ))}
        </div>
        {moodLoading && <div className="skeleton" style={{ height: 80, borderRadius: 12, marginTop: 12 }} />}
        {moodTracks.length > 0 && !moodLoading && (
          <div className="h-scroll" style={{ marginTop: 14 }}>
            {moodTracks.map((t, i) => (
              <TrackCardHorizontal key={t.id} track={t} queue={moodTracks} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Trending */}
      <section>
        <div className="section-header">
          <div className="section-title"><TrendingUp size={14} style={{ display: 'inline', marginRight: 6 }} />Trending</div>
          <span className="section-see-all">See all</span>
        </div>
        {loading ? (
          <div className="h-scroll">{Array(5).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ width: 160, height: 220, borderRadius: 16, flexShrink: 0 }} />
          ))}</div>
        ) : (
          <div className="h-scroll">
            {feed?.trending?.map((t, i) => (
              <TrackCardHorizontal key={t.id} track={t} queue={feed.trending} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Jamendo Picks */}
      <section>
        <div className="section-header">
          <div className="section-title"><Music2 size={14} style={{ display: 'inline', marginRight: 6 }} />Fresh Picks</div>
          <span className="section-see-all">See all</span>
        </div>
        {loading ? (
          <div className="h-scroll">{Array(5).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ width: 160, height: 220, borderRadius: 16, flexShrink: 0 }} />
          ))}</div>
        ) : (
          <div className="h-scroll">
            {feed?.jamendoPicks?.map((t, i) => (
              <TrackCardHorizontal key={t.id} track={t} queue={feed.jamendoPicks} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Trending Artists */}
      {artists.length > 0 && (
        <section>
          <div className="section-header">
            <div className="section-title">Top Artists</div>
          </div>
          <div className="h-scroll">
            {artists.map((a, i) => (
              <motion.div
                key={a.id}
                className="artist-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <div className="artist-avatar-wrap">
                  <img
                    src={a.avatar || artworkFallback(i)}
                    alt={a.name}
                    className="artist-avatar"
                    onError={e => { e.target.src = artworkFallback(i) }}
                  />
                  <div className="artist-avatar-ring" />
                </div>
                <div className="artist-name">{a.name.split(' ')[0]}</div>
                <div className="artist-followers">{(a.followers / 1000).toFixed(1)}K</div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* New Releases */}
      <section>
        <div className="section-header">
          <div className="section-title"><Headphones size={14} style={{ display: 'inline', marginRight: 6 }} />New Releases</div>
          <span className="section-see-all">See all</span>
        </div>
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 62, borderRadius: 10, marginBottom: 8 }} />
          ))
        ) : (
          <div>
            {feed?.newReleases?.slice(0, 10).map((t, i) => (
              <TrackListItem key={t.id} track={t} queue={feed.newReleases} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <section>
          <div className="section-header">
            <div className="section-title">Recently Played</div>
          </div>
          <div className="h-scroll">
            {recentlyPlayed.slice(0, 10).map((t, i) => (
              <TrackCardHorizontal key={t.id} track={t} queue={recentlyPlayed} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Electronic section */}
      {feed?.electronic?.length > 0 && (
        <section>
          <div className="section-header">
            <div className="section-title">Electronic</div>
          </div>
          <div className="h-scroll">
            {feed.electronic.map((t, i) => (
              <TrackCardHorizontal key={t.id} track={t} queue={feed.electronic} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Developer Credit */}
      <motion.div
        className="dev-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="dev-card-bg" />
        <div className="dev-card-inner">
          <div className="dev-avatar">AK</div>
          <div>
            <div className="dev-name">ANOOP KUMAR DUBEY</div>
            <div className="dev-handle">@anoop_.exe</div>
            <div className="dev-brand">VXNOIR · Crafted with ❤️</div>
          </div>
        </div>
        <div className="dev-tag">DEVELOPER</div>
      </motion.div>

      <div style={{ height: 20 }} />
    </div>
  )
}
