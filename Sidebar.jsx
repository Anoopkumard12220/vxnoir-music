import React from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { getGenderConfig } from '../../utils/helpers'
import { Heart, Plus, Music } from 'lucide-react'
import './Sidebar.css'

export default function Sidebar({ navItems, currentPath, navigate }) {
  const { user, playlists, favorites, createPlaylist } = useApp()
  const gender = getGenderConfig(user?.gender)

  const handleCreate = () => {
    const name = prompt('Playlist name:')
    if (name?.trim()) createPlaylist(name.trim())
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" onClick={() => navigate('/')}>
        <span className="logo-text">VXNOIR</span>
        <span className="logo-sub">MUSIC</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = currentPath === path
          return (
            <motion.button
              key={path}
              className={`nav-item ${active ? 'active' : ''}`}
              onClick={() => navigate(path)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
              {active && <motion.div className="nav-indicator" layoutId="sidebarIndicator" />}
            </motion.button>
          )
        })}
      </nav>

      <div className="sidebar-divider" />

      {/* Library section */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <span>Your Library</span>
          <button className="sidebar-add-btn" onClick={handleCreate} title="New playlist">
            <Plus size={14} />
          </button>
        </div>

        {/* Favorites shortcut */}
        <motion.div
          className="sidebar-playlist-item"
          whileHover={{ x: 4 }}
          onClick={() => navigate('/library')}
        >
          <div className="playlist-icon-wrap" style={{ background: 'rgba(247,37,133,0.15)' }}>
            <Heart size={14} fill="#f72585" color="#f72585" />
          </div>
          <div>
            <div className="playlist-name">Liked Songs</div>
            <div className="playlist-count">{favorites.length} tracks</div>
          </div>
        </motion.div>

        {/* User playlists */}
        {playlists.slice(0, 6).map(pl => (
          <motion.div
            key={pl.id}
            className="sidebar-playlist-item"
            whileHover={{ x: 4 }}
            onClick={() => navigate('/library')}
          >
            <div className="playlist-icon-wrap">
              <Music size={14} color="#9b5de5" />
            </div>
            <div>
              <div className="playlist-name">{pl.name}</div>
              <div className="playlist-count">{pl.tracks.length} tracks</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User profile */}
      {user && (
        <motion.div
          className="sidebar-user"
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
          onClick={() => navigate('/profile')}
        >
          <div className="user-avatar" style={{ background: gender.bg, borderColor: `${gender.color}44` }}>
            <span style={{ color: gender.color }}>{gender.icon}</span>
          </div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-label">@anoop_.exe</div>
          </div>
        </motion.div>
      )}
    </aside>
  )
}
