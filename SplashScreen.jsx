import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashScreen() {
  const [phase, setPhase] = useState(0) // 0=logo, 1=tagline, 2=loading

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <motion.div
      style={styles.container}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Grid lines */}
      <div style={styles.grid} />

      {/* Center content */}
      <div style={styles.center}>
        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          style={styles.logoMark}
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#9b5de5"/>
                <stop offset="50%" stopColor="#00b4ff"/>
                <stop offset="100%" stopColor="#f72585"/>
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="30" stroke="url(#lg1)" strokeWidth="2" fill="none" opacity="0.4"/>
            <circle cx="32" cy="32" r="20" stroke="url(#lg1)" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <circle cx="32" cy="32" r="6" fill="url(#lg1)"/>
            <line x1="32" y1="12" x2="32" y2="52" stroke="url(#lg1)" strokeWidth="1" opacity="0.3"/>
            <line x1="12" y1="32" x2="52" y2="32" stroke="url(#lg1)" strokeWidth="1" opacity="0.3"/>
          </svg>
          <motion.div
            style={styles.logoPulse}
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Logo text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={styles.logoText}
        >
          VXNOIR
        </motion.div>

        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={styles.tagline}
            >
              MUSIC
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 1 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={styles.sub}
            >
              Ultra Premium Streaming Experience
            </motion.p>
          )}
        </AnimatePresence>

        {/* Loading bar */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.loadingWrap}
            >
              <div style={styles.loadingTrack}>
                <motion.div
                  style={styles.loadingFill}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <p style={styles.loadingText}>Initializing...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Corner accents */}
      {[
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 20, left: 20 },
        { bottom: 20, right: 20 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          style={{ ...styles.corner, ...pos }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
        />
      ))}

      {/* Bottom credit */}
      <motion.div
        style={styles.credit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        Crafted by <span style={{ color: '#9b5de5' }}>ANOOP KUMAR DUBEY</span>
      </motion.div>
    </motion.div>
  )
}

const styles = {
  container: {
    position: 'fixed', inset: 0, zIndex: 200,
    background: '#04040d',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute', inset: 0,
    backgroundImage: `
      linear-gradient(rgba(155,93,229,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(155,93,229,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
  },
  center: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    position: 'relative', zIndex: 2,
  },
  logoMark: {
    position: 'relative', width: 64, height: 64, marginBottom: 8,
  },
  logoPulse: {
    position: 'absolute', inset: -12,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(155,93,229,0.3), transparent 70%)',
  },
  logoText: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 48, fontWeight: 900,
    letterSpacing: '10px',
    background: 'linear-gradient(135deg, #9b5de5, #00b4ff, #f72585)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  tagline: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 14, fontWeight: 600,
    letterSpacing: '8px', color: 'rgba(240,240,255,0.5)',
    marginTop: -8,
  },
  sub: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 14, color: 'rgba(240,240,255,0.3)',
    letterSpacing: '1.5px', marginTop: 4,
  },
  loadingWrap: { marginTop: 48, width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 },
  loadingTrack: { width: '100%', height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' },
  loadingFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #9b5de5, #00b4ff, #f72585)',
    borderRadius: 99,
    boxShadow: '0 0 10px rgba(155,93,229,0.6)',
  },
  loadingText: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 11, color: 'rgba(240,240,255,0.3)', letterSpacing: '2px',
  },
  corner: {
    position: 'absolute', width: 20, height: 20,
    border: '1.5px solid rgba(155,93,229,0.3)',
    borderRadius: 2,
  },
  credit: {
    position: 'absolute', bottom: 24,
    fontFamily: "'Space Mono', monospace",
    fontSize: 11, color: 'rgba(240,240,255,0.25)',
    letterSpacing: '1px',
  },
}
