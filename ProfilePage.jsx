import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Clock, Music, Settings, Edit3, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { usePlayer } from '../context/PlayerContext'
import { getGenderConfig, formatDate } from '../utils/helpers'
import { useNavigate } from 'react-router-dom'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, favorites, playlists, recentlyPlayed } = useApp()
  const { currentTrack } = usePlayer()
  const navigate = useNavigate()
  const gender = getGenderConfig(user?.gender)

  const stats = [
    { label: 'Liked Songs', value: favorites.length, icon: <Heart size={16} />, color: '#f72585' },
    { label: 'Playlists', value: playlists.length, icon: <Music size={16} />, color: '#9b5de5' },
    { label: 'Played', value: recentlyPlayed.length, icon: <Clock size={16} />, color: '#00b4ff' },
  ]

  return (
    <div className="profile-page page-content">
      {/* Hero */}
      <motion.div className="profile-hero" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="profile-hero-bg" />
        <div className="profile-avatar-wrap">
          <div className="profile-avatar" style={{ background: gender.bg, borderColor: `${gender.color}44` }}>
            <span style={{ fontSize: 40, color: gender.color }}>{gender.icon}</span>
          </div>
          <motion.div className="profile-avatar-ring"
            animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            style={{ borderTopColor: gender.color, borderRightColor: `${gender.color}40` }}
          />
        </div>
        <div className="profile-info">
          <div className="profile-name">{user?.name}</div>
          <div className="profile-handle" style={{ color: gender.color }}>@anoop_.exe · {gender.label}</div>
          <div className="profile-since">Member since {formatDate(user?.createdAt || Date.now())}</div>
        </div>
        <button className="profile-settings-btn" onClick={() => navigate('/settings')}>
          <Settings size={18} />
        </button>
      </motion.div>

      {/* Stats */}
      <div className="profile-stats">
        {stats.map((s, i) => (
          <motion.div key={s.label} className="stat-card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ '--s-color': s.color }}
          >
            <div className="stat-icon" style={{ color: s.color, background: `${s.color}18` }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <motion.div className="now-playing-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="now-playing-label">🎵 NOW PLAYING</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
            <img src={currentTrack.artwork} alt="" style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover' }} />
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{currentTrack.title}</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: 'var(--text3)' }}>{currentTrack.artist}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Favorite genres */}
      {favorites.length > 0 && (
        <section>
          <div className="section-header">
            <div className="section-title">Liked Songs</div>
          </div>
          {favorites.slice(0, 5).map((t, i) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <img src={t.artwork} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{t.title}</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, color: 'var(--text3)' }}>{t.artist}</div>
              </div>
              <Heart size={14} fill="#f72585" color="#f72585" />
            </div>
          ))}
        </section>
      )}

      {/* Developer card */}
      <motion.div className="profile-dev-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="profile-dev-bg" />
        <div className="profile-dev-inner">
          <div className="profile-dev-avatar">
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 900, color: 'white' }}>AK</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, fontWeight: 900, color: 'white', letterSpacing: 1 }}>ANOOP KUMAR DUBEY</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#9b5de5', marginTop: 4 }}>@anoop_.exe</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: 'rgba(144,144,187,0.6)', marginTop: 4 }}>Developer · VXNOIR Brand</div>
          </div>
        </div>
        <div className="profile-dev-badge">
          <Star size={10} fill="#fee440" color="#fee440" style={{ display: 'inline', marginRight: 4 }} />
          CRAFTED WITH LOVE
        </div>
      </motion.div>
    </div>
  )
}
