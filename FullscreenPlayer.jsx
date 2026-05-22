import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, Heart, SkipBack, SkipForward, Play, Pause,
  Repeat, Shuffle, Volume2, VolumeX, List, Share2, Download, MoreHorizontal
} from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import { useApp } from '../../context/AppContext'
import { formatTime, artworkFallback } from '../../utils/helpers'
import EqBars from '../ui/EqBars'
import './FullscreenPlayer.css'

export default function FullscreenPlayer() {
  const {
    currentTrack, isPlaying, togglePlay, playNext, playPrev,
    progress, currentTime, duration, seek,
    volume, isMuted, toggleMute, changeVolume,
    isRepeat, setIsRepeat, isShuffle, setIsShuffle,
    isLoading, setIsFullscreen,
  } = usePlayer()
  const { isFavorite, toggleFavorite, addToPlaylist, playlists } = useApp()
  const [activeTab, setActiveTab] = useState('player') // player | queue | lyrics
  const seekRef = useRef(null)
  const volRef = useRef(null)

  if (!currentTrack) return null
  const fav = isFavorite(currentTrack.id)

  const handleSeek = (e) => {
    if (!seekRef.current) return
    const rect = seekRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    seek(pct * duration)
  }

  const handleVolumeClick = (e) => {
    if (!volRef.current) return
    const rect = volRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    changeVolume(pct)
  }

  return (
    <motion.div
      className="fullscreen-player"
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
    >
      {/* Dynamic blurred background from artwork */}
      <div className="fp-bg">
        <img
          src={currentTrack.artwork || artworkFallback(0)}
          alt=""
          className="fp-bg-img"
          onError={e => { e.target.src = artworkFallback(0) }}
        />
        <div className="fp-bg-overlay" />
      </div>

      {/* Header */}
      <div className="fp-header">
        <motion.button
          className="fp-back-btn"
          onClick={() => setIsFullscreen(false)}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronDown size={22} />
        </motion.button>
        <div className="fp-header-info">
          <div className="fp-now-playing">NOW PLAYING</div>
          <div className="fp-source">{(currentTrack.source || 'stream').toUpperCase()}</div>
        </div>
        <motion.button className="fp-more-btn" whileTap={{ scale: 0.9 }}>
          <MoreHorizontal size={22} color="rgba(240,240,255,0.6)" />
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="fp-tabs">
        {['player', 'queue', 'lyrics'].map(t => (
          <button
            key={t}
            className={`fp-tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'player' && (
          <motion.div
            key="player"
            className="fp-player-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Artwork */}
            <div className="fp-artwork-wrap">
              <motion.div
                className="fp-artwork-ring"
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />
              <motion.img
                src={currentTrack.artwork || artworkFallback(0)}
                alt={currentTrack.title}
                className="fp-artwork"
                animate={isPlaying ? { scale: 1 } : { scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onError={e => { e.target.src = artworkFallback(0) }}
              />
              {isLoading && (
                <div className="fp-loading-overlay">
                  <motion.div
                    className="fp-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              )}
              {isPlaying && (
                <motion.div
                  className="fp-glow-ring"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>

            {/* Track info */}
            <div className="fp-track-info">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div className="fp-title">{currentTrack.title}</div>
                  <div className="fp-artist">{currentTrack.artist}</div>
                  {currentTrack.album && <div className="fp-album">{currentTrack.album}</div>}
                </div>
                <motion.button
                  onClick={() => toggleFavorite(currentTrack)}
                  whileTap={{ scale: 0.8 }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, paddingTop: 4 }}
                >
                  <motion.div
                    animate={fav ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart size={24} fill={fav ? '#f72585' : 'none'} color={fav ? '#f72585' : 'rgba(240,240,255,0.4)'} />
                  </motion.div>
                </motion.button>
              </div>
            </div>

            {/* Seek bar */}
            <div className="fp-seek-section">
              <div className="fp-seek-track" ref={seekRef} onClick={handleSeek}>
                <div className="fp-seek-fill" style={{ width: `${progress}%` }}>
                  <div className="fp-seek-thumb" />
                </div>
              </div>
              <div className="fp-seek-times">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main controls */}
            <div className="fp-controls">
              <motion.button
                className={`fp-ctrl-secondary ${isShuffle ? 'active' : ''}`}
                onClick={() => setIsShuffle(p => !p)}
                whileTap={{ scale: 0.85 }}
              >
                <Shuffle size={20} />
              </motion.button>

              <motion.button className="fp-ctrl-main" onClick={playPrev} whileTap={{ scale: 0.9 }}>
                <SkipBack size={24} fill="currentColor" />
              </motion.button>

              <motion.button
                className="fp-play-btn"
                onClick={togglePlay}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying
                  ? <Pause size={28} fill="white" color="white" />
                  : <Play size={28} fill="white" color="white" style={{ marginLeft: 3 }} />
                }
              </motion.button>

              <motion.button className="fp-ctrl-main" onClick={playNext} whileTap={{ scale: 0.9 }}>
                <SkipForward size={24} fill="currentColor" />
              </motion.button>

              <motion.button
                className={`fp-ctrl-secondary ${isRepeat ? 'active' : ''}`}
                onClick={() => setIsRepeat(p => !p)}
                whileTap={{ scale: 0.85 }}
              >
                <Repeat size={20} />
              </motion.button>
            </div>

            {/* Volume */}
            <div className="fp-volume-row">
              <motion.button
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={toggleMute}
                whileTap={{ scale: 0.9 }}
              >
                {isMuted
                  ? <VolumeX size={18} color="rgba(144,144,187,0.5)" />
                  : <Volume2 size={18} color="rgba(144,144,187,0.7)" />
                }
              </motion.button>
              <div className="fp-vol-track" ref={volRef} onClick={handleVolumeClick}>
                <div className="fp-vol-fill" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }} />
              </div>
              <Volume2 size={18} color="rgba(240,240,255,0.4)" />
            </div>

            {/* Eq bars */}
            {isPlaying && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                <EqBars count={7} />
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'queue' && (
          <motion.div
            key="queue"
            className="fp-queue-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <QueueList />
          </motion.div>
        )}

        {activeTab === 'lyrics' && (
          <motion.div
            key="lyrics"
            className="fp-lyrics-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="fp-lyrics-placeholder">
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎵</div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: 'rgba(144,144,187,0.5)', letterSpacing: '2px' }}>
                LYRICS COMING SOON
              </div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: 'rgba(144,144,187,0.3)', marginTop: 8 }}>
                Real-time lyrics integration in next update
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function QueueList() {
  const { queue, queueIndex, playTrack } = usePlayer()
  if (!queue.length) return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(144,144,187,0.4)' }}>
      <List size={40} style={{ margin: '0 auto 12px', display: 'block' }} />
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 15 }}>Queue is empty</div>
    </div>
  )
  return (
    <div style={{ padding: '0 16px', overflowY: 'auto', height: '100%' }}>
      {queue.map((track, i) => (
        <motion.div
          key={track.id}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 0',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            opacity: i < queueIndex ? 0.4 : 1,
          }}
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
          onClick={() => playTrack(track)}
        >
          <img
            src={track.artwork || artworkFallback(i)}
            alt=""
            style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
            onError={e => { e.target.src = artworkFallback(i) }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 15, fontWeight: 600, color: i === queueIndex ? '#9b5de5' : '#f0f0ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: '#55557a' }}>{track.artist}</div>
          </div>
          {i === queueIndex && <EqBars count={3} size="small" />}
        </motion.div>
      ))}
    </div>
  )
}
