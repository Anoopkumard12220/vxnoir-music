import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Music, Plus, Trash2, Play } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { usePlayer } from '../context/PlayerContext'
import { TrackListItem } from '../components/ui/TrackCard'
import toast from 'react-hot-toast'
import './LibraryPage.css'

const TABS = ['Liked Songs', 'Playlists', 'Downloads']

export default function LibraryPage() {
  const [tab, setTab] = useState(0)
  const { favorites, playlists, createPlaylist, deletePlaylist } = useApp()
  const { playTrack } = usePlayer()

  const handleNew = () => {
    const name = prompt('Playlist name:')
    if (name?.trim()) { createPlaylist(name.trim()); toast.success('Playlist created! 🎵') }
  }

  return (
    <div className="library-page page-content">
      <div className="library-header">
        <div className="section-title" style={{ fontSize: 20 }}>Your Library</div>
        {tab === 1 && (
          <motion.button className="lib-add-btn" onClick={handleNew} whileTap={{ scale: 0.9 }}>
            <Plus size={16} /> New Playlist
          </motion.button>
        )}
      </div>

      {/* Tabs */}
      <div className="lib-tabs">
        {TABS.map((t, i) => (
          <button key={t} className={`lib-tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Liked Songs */}
        {tab === 0 && (
          <motion.div key="liked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {favorites.length === 0 ? (
              <EmptyState icon={<Heart size={40} />} title="No liked songs yet" sub="Tap the heart on any track to save it here" />
            ) : (
              <>
                <div className="liked-banner">
                  <div className="liked-banner-bg" />
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 28, fontWeight: 900, color: 'white' }}>Liked Songs</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 15, color: 'rgba(240,240,255,0.6)', marginTop: 4 }}>{favorites.length} tracks</div>
                    <motion.button
                      style={{ marginTop: 16, background: 'linear-gradient(135deg,#9b5de5,#00b4ff)', border: 'none', borderRadius: 99, color: 'white', fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                      onClick={() => playTrack(favorites[0], favorites)}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play size={14} fill="white" /> PLAY ALL
                    </motion.button>
                  </div>
                  <Heart size={80} fill="rgba(247,37,133,0.2)" color="rgba(247,37,133,0.3)" style={{ position: 'absolute', right: 20, bottom: 10 }} />
                </div>
                {favorites.map((t, i) => <TrackListItem key={t.id} track={t} queue={favorites} index={i} />)}
              </>
            )}
          </motion.div>
        )}

        {/* Playlists */}
        {tab === 1 && (
          <motion.div key="playlists" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {playlists.length === 0 ? (
              <EmptyState icon={<Music size={40} />} title="No playlists yet" sub="Create a playlist to organize your music" />
            ) : (
              <div className="playlists-grid">
                {playlists.map((pl, i) => (
                  <motion.div key={pl.id} className="playlist-card"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }} whileHover={{ y: -4 }}
                  >
                    <div className="pl-card-art">
                      <Music size={28} color="rgba(155,93,229,0.6)" />
                    </div>
                    <div style={{ padding: '0 4px 4px' }}>
                      <div className="pl-card-name">{pl.name}</div>
                      <div className="pl-card-count">{pl.tracks.length} tracks</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                        {pl.tracks.length > 0 && (
                          <button className="pl-play-btn" onClick={() => playTrack(pl.tracks[0], pl.tracks)}>
                            <Play size={12} fill="white" />
                          </button>
                        )}
                        <button className="pl-del-btn" onClick={() => { deletePlaylist(pl.id); toast.success('Deleted') }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Downloads */}
        {tab === 2 && (
          <motion.div key="downloads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState icon={<span style={{ fontSize: 40 }}>📥</span>} title="No downloads yet" sub="Songs with a download URL can be saved offline" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ color: 'rgba(144,144,187,0.3)', marginBottom: 16 }}>{icon}</div>
      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, color: 'var(--text2)', letterSpacing: 1, marginBottom: 8 }}>{title}</div>
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: 'var(--text3)' }}>{sub}</div>
    </div>
  )
}
