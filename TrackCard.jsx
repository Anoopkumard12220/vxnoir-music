import React from 'react'
import { motion } from 'framer-motion'
import { Play, Heart, MoreHorizontal } from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import { useApp } from '../../context/AppContext'
import { formatTime, truncate, artworkFallback } from '../../utils/helpers'
import EqBars from './EqBars'
import './TrackCard.css'

export function TrackCardHorizontal({ track, queue, index = 0 }) {
  const { playTrack, currentTrack, isPlaying } = usePlayer()
  const { isFavorite, toggleFavorite } = useApp()
  const isActive = currentTrack?.id === track.id
  const fav = isFavorite(track.id)

  return (
    <motion.div
      className="track-card-h"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4 }}
      onClick={() => playTrack(track, queue)}
    >
      <div className="tch-artwork-wrap">
        <img
          src={track.artwork || artworkFallback(index)}
          alt={track.title}
          className="tch-artwork"
          onError={e => { e.target.src = artworkFallback(index) }}
        />
        <div className="tch-play-overlay">
          {isActive && isPlaying
            ? <EqBars count={4} size="small" />
            : <Play size={20} fill="white" color="white" style={{ marginLeft: 2 }} />
          }
        </div>
        {isActive && <div className="tch-active-border" />}
      </div>
      <div className="tch-info">
        <div className={`tch-title ${isActive ? 'active' : ''}`}>{truncate(track.title, 22)}</div>
        <div className="tch-artist">{truncate(track.artist, 20)}</div>
        <div className="tch-source">{track.source}</div>
      </div>
      <button
        className="tch-fav-btn"
        onClick={e => { e.stopPropagation(); toggleFavorite(track) }}
      >
        <Heart size={14} fill={fav ? '#f72585' : 'none'} color={fav ? '#f72585' : 'rgba(144,144,187,0.4)'} />
      </button>
    </motion.div>
  )
}

export function TrackListItem({ track, queue, index = 0, showIndex = false }) {
  const { playTrack, currentTrack, isPlaying } = usePlayer()
  const { isFavorite, toggleFavorite } = useApp()
  const isActive = currentTrack?.id === track.id
  const fav = isFavorite(track.id)

  return (
    <motion.div
      className={`track-list-item ${isActive ? 'active' : ''}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      onClick={() => playTrack(track, queue)}
    >
      {showIndex ? (
        <div className="tli-index">
          {isActive && isPlaying ? <EqBars count={3} size="small" /> : <span>{index + 1}</span>}
        </div>
      ) : (
        <div className="tli-artwork-sm">
          <img
            src={track.artwork || artworkFallback(index)}
            alt=""
            onError={e => { e.target.src = artworkFallback(index) }}
          />
          {isActive && isPlaying && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EqBars count={3} size="small" />
            </div>
          )}
        </div>
      )}
      <div className="tli-info">
        <div className={`tli-title ${isActive ? 'active' : ''}`}>{truncate(track.title, 30)}</div>
        <div className="tli-artist">{truncate(track.artist, 28)}</div>
      </div>
      <div className="tli-duration">{formatTime(track.duration)}</div>
      <button className="tli-fav" onClick={e => { e.stopPropagation(); toggleFavorite(track) }}>
        <Heart size={15} fill={fav ? '#f72585' : 'none'} color={fav ? '#f72585' : 'rgba(144,144,187,0.3)'} />
      </button>
    </motion.div>
  )
}
