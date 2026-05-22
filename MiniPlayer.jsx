import React, { useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, Heart, ChevronUp } from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import { useApp } from '../../context/AppContext'
import { formatTime, artworkFallback } from '../../utils/helpers'
import EqBars from '../ui/EqBars'
import './MiniPlayer.css'

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, playNext, playPrev, progress, currentTime, duration, seek, setIsFullscreen } = usePlayer()
  const { isFavorite, toggleFavorite } = useApp()
  const sliderRef = useRef(null)

  if (!currentTrack) return null

  const fav = isFavorite(currentTrack.id)

  const handleSliderClick = (e) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    seek(pct * duration)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="mini-player"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Progress bar at top */}
        <div
          ref={sliderRef}
          className="mini-progress-track"
          onClick={handleSliderClick}
        >
          <motion.div
            className="mini-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mini-player-inner">
          {/* Artwork */}
          <motion.div
            className="mini-artwork-wrap"
            onClick={() => setIsFullscreen(true)}
            whileTap={{ scale: 0.94 }}
          >
            <img
              src={currentTrack.artwork || artworkFallback(0)}
              alt={currentTrack.title}
              className="mini-artwork"
              onError={e => { e.target.src = artworkFallback(0) }}
            />
            {isPlaying && (
              <div className="mini-artwork-overlay">
                <EqBars count={3} size="small" />
              </div>
            )}
            <motion.div
              className="mini-artwork-glow"
              animate={isPlaying ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Info */}
          <div className="mini-info" onClick={() => setIsFullscreen(true)}>
            <div className="mini-title">{currentTrack.title}</div>
            <div className="mini-artist">{currentTrack.artist}</div>
          </div>

          {/* Controls */}
          <div className="mini-controls">
            <motion.button
              className="mini-ctrl-btn"
              onClick={() => toggleFavorite(currentTrack)}
              whileTap={{ scale: 0.85 }}
            >
              <Heart
                size={18}
                fill={fav ? '#f72585' : 'none'}
                color={fav ? '#f72585' : 'rgba(144,144,187,0.6)'}
              />
            </motion.button>

            <motion.button
              className="mini-ctrl-btn"
              onClick={playPrev}
              whileTap={{ scale: 0.85 }}
            >
              <SkipBack size={18} color="rgba(144,144,187,0.7)" />
            </motion.button>

            <motion.button
              className="mini-play-btn"
              onClick={togglePlay}
              whileTap={{ scale: 0.9 }}
              animate={isPlaying ? { boxShadow: ['0 0 15px rgba(155,93,229,0.4)', '0 0 30px rgba(155,93,229,0.6)', '0 0 15px rgba(155,93,229,0.4)'] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {isPlaying
                ? <Pause size={18} fill="white" color="white" />
                : <Play size={18} fill="white" color="white" style={{ marginLeft: 2 }} />
              }
            </motion.button>

            <motion.button
              className="mini-ctrl-btn"
              onClick={playNext}
              whileTap={{ scale: 0.85 }}
            >
              <SkipForward size={18} color="rgba(144,144,187,0.7)" />
            </motion.button>

            <motion.button
              className="mini-ctrl-btn"
              onClick={() => setIsFullscreen(true)}
              whileTap={{ scale: 0.85 }}
            >
              <ChevronUp size={18} color="rgba(144,144,187,0.5)" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
