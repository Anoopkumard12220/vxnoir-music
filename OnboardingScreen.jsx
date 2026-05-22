import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

const GENDERS = [
  { id: 'male', label: 'Male', icon: '♂', color: '#00b4ff', desc: 'He / Him' },
  { id: 'female', label: 'Female', icon: '♀', color: '#f72585', desc: 'She / Her' },
  { id: 'other', label: 'Other', icon: '⚧', color: '#9b5de5', desc: 'They / Them' },
]

export default function OnboardingScreen() {
  const { saveUser } = useApp()
  const [step, setStep] = useState(0) // 0=permissions, 1=name, 2=gender
  const [name, setName] = useState('')
  const [gender, setGender] = useState(null)
  const [permsGranted, setPermsGranted] = useState(false)

  const requestPermissions = async () => {
    // Notification permission
    if ('Notification' in window) {
      await Notification.requestPermission().catch(() => {})
    }
    setPermsGranted(true)
    setTimeout(() => setStep(1), 400)
    toast.success('Ready to go!')
  }

  const skipPermissions = () => {
    setPermsGranted(true)
    setStep(1)
  }

  const handleFinish = () => {
    if (!name.trim()) { toast.error('Please enter your name'); return }
    if (!gender) { toast.error('Please select your gender'); return }
    saveUser({ name: name.trim(), gender, createdAt: Date.now() })
    toast.success(`Welcome to VXNOIR, ${name.trim()}! 🎵`)
  }

  const slideVariants = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  }

  return (
    <div style={styles.container}>
      {/* Background lines */}
      <div style={styles.grid} />

      {/* Progress dots */}
      <div style={styles.dots}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            ...styles.dot,
            background: step >= i ? 'linear-gradient(135deg, #9b5de5, #00b4ff)' : 'rgba(255,255,255,0.1)',
            width: step === i ? 24 : 8,
          }} />
        ))}
      </div>

      <div style={styles.card}>
        <AnimatePresence mode="wait">

          {/* Step 0: Permissions */}
          {step === 0 && (
            <motion.div key="perms" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} style={styles.stepWrap}>
              <div style={styles.iconWrap}>
                <span style={styles.bigIcon}>🎵</span>
                <div style={styles.iconGlow} />
              </div>
              <h1 style={styles.stepTitle}>VXNOIR<br />MUSIC</h1>
              <p style={styles.stepDesc}>
                Grant permissions for the best music experience — notifications for new releases and
                storage for offline tracks.
              </p>
              <div style={styles.permList}>
                {[
                  { icon: '🔔', label: 'Notifications', desc: 'New releases & updates' },
                  { icon: '💾', label: 'Storage', desc: 'Save tracks offline' },
                ].map(p => (
                  <div key={p.icon} style={styles.permItem}>
                    <span style={styles.permIcon}>{p.icon}</span>
                    <div>
                      <div style={styles.permLabel}>{p.label}</div>
                      <div style={styles.permDesc}>{p.desc}</div>
                    </div>
                    <div style={styles.permBadge}>Required</div>
                  </div>
                ))}
              </div>
              <button style={styles.btnPrimary} onClick={requestPermissions}>
                Allow Permissions
              </button>
              <button style={styles.btnSkip} onClick={skipPermissions}>
                Skip for now
              </button>
            </motion.div>
          )}

          {/* Step 1: Name */}
          {step === 1 && (
            <motion.div key="name" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} style={styles.stepWrap}>
              <div style={styles.iconWrap}>
                <span style={styles.bigIcon}>👤</span>
                <div style={styles.iconGlow} />
              </div>
              <h2 style={styles.stepTitle}>What's your<br />name?</h2>
              <p style={styles.stepDesc}>We'll personalize your experience just for you.</p>
              <div style={styles.inputWrap}>
                <input
                  style={styles.input}
                  placeholder="Enter your name..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
                  autoFocus
                  maxLength={30}
                />
                <div style={styles.inputLine} />
              </div>
              <button
                style={{ ...styles.btnPrimary, opacity: name.trim() ? 1 : 0.5 }}
                onClick={() => name.trim() && setStep(2)}
              >
                Continue →
              </button>
            </motion.div>
          )}

          {/* Step 2: Gender */}
          {step === 2 && (
            <motion.div key="gender" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} style={styles.stepWrap}>
              <div style={styles.iconWrap}>
                <span style={styles.bigIcon}>✨</span>
                <div style={styles.iconGlow} />
              </div>
              <h2 style={styles.stepTitle}>How do you<br />identify?</h2>
              <p style={styles.stepDesc}>Helps us personalize your profile avatar.</p>
              <div style={styles.genderGrid}>
                {GENDERS.map(g => (
                  <motion.button
                    key={g.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGender(g.id)}
                    style={{
                      ...styles.genderCard,
                      borderColor: gender === g.id ? g.color : 'rgba(255,255,255,0.06)',
                      background: gender === g.id ? `${g.color}18` : 'rgba(255,255,255,0.03)',
                      boxShadow: gender === g.id ? `0 0 20px ${g.color}33` : 'none',
                    }}
                  >
                    <span style={{ fontSize: 28, color: g.color }}>{g.icon}</span>
                    <span style={{ ...styles.genderLabel, color: gender === g.id ? g.color : '#9090bb' }}>{g.label}</span>
                    <span style={styles.genderDesc}>{g.desc}</span>
                  </motion.button>
                ))}
              </div>
              <button
                style={{ ...styles.btnPrimary, opacity: gender ? 1 : 0.5 }}
                onClick={handleFinish}
              >
                Start Listening 🎶
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Floating orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: '#9b5de5', filter: 'blur(100px)', opacity: 0.06, top: -150, right: -150 }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: '#f72585', filter: 'blur(80px)', opacity: 0.06, bottom: -100, left: -100 }} />
      </div>
    </div>
  )
}

const styles = {
  container: {
    position: 'fixed', inset: 0, zIndex: 100,
    background: '#04040d',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '20px 16px',
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute', inset: 0,
    backgroundImage: `linear-gradient(rgba(155,93,229,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(155,93,229,0.03) 1px, transparent 1px)`,
    backgroundSize: '50px 50px',
  },
  dots: {
    position: 'absolute', top: 48,
    display: 'flex', gap: 8, alignItems: 'center',
    zIndex: 2,
  },
  dot: {
    height: 8, borderRadius: 99,
    transition: 'all 0.4s ease',
  },
  card: {
    width: '100%', maxWidth: 420,
    background: 'rgba(10,10,28,0.9)',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(155,93,229,0.15)',
    borderRadius: 24,
    padding: '40px 32px',
    position: 'relative', zIndex: 2,
    overflow: 'hidden',
    boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
  },
  stepWrap: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 16,
  },
  iconWrap: { position: 'relative', marginBottom: 8 },
  bigIcon: { fontSize: 52, display: 'block' },
  iconGlow: {
    position: 'absolute', inset: -20,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(155,93,229,0.2), transparent 70%)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  stepTitle: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 28, fontWeight: 900,
    textAlign: 'center', lineHeight: 1.3,
    background: 'linear-gradient(135deg, #f0f0ff, #9090bb)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  stepDesc: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 15, color: 'rgba(144,144,187,0.8)',
    textAlign: 'center', lineHeight: 1.6, maxWidth: 280,
  },
  permList: { width: '100%', display: 'flex', flexDirection: 'column', gap: 10, margin: '8px 0' },
  permItem: {
    display: 'flex', alignItems: 'center', gap: 14,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12, padding: '14px 16px',
  },
  permIcon: { fontSize: 24 },
  permLabel: { fontFamily: "'Rajdhani', sans-serif", fontSize: 15, fontWeight: 600, color: '#f0f0ff' },
  permDesc: { fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: '#9090bb' },
  permBadge: {
    marginLeft: 'auto', fontFamily: "'Space Mono', monospace",
    fontSize: 10, color: '#9b5de5',
    background: 'rgba(155,93,229,0.12)',
    border: '1px solid rgba(155,93,229,0.25)',
    borderRadius: 6, padding: '3px 8px',
    letterSpacing: '0.5px',
  },
  inputWrap: { width: '100%', position: 'relative' },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(155,93,229,0.2)',
    borderRadius: 12,
    color: '#f0f0ff',
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 18, fontWeight: 600,
    padding: '16px 20px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    letterSpacing: '0.5px',
  },
  inputLine: {},
  genderGrid: { display: 'flex', gap: 12, width: '100%' },
  genderCard: {
    flex: 1,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    padding: '20px 12px',
    border: '1.5px solid',
    borderRadius: 16,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    fontFamily: "'Rajdhani', sans-serif",
  },
  genderLabel: {
    fontSize: 14, fontWeight: 700, letterSpacing: '1px',
    transition: 'color 0.25s',
  },
  genderDesc: { fontSize: 11, color: '#55557a', fontFamily: "'Space Mono', monospace" },
  btnPrimary: {
    width: '100%',
    background: 'linear-gradient(135deg, #9b5de5, #00b4ff)',
    border: 'none', borderRadius: 12,
    color: 'white',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 13, fontWeight: 700,
    letterSpacing: '2px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    marginTop: 8,
  },
  btnSkip: {
    background: 'none', border: 'none',
    color: 'rgba(144,144,187,0.6)',
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 14, cursor: 'pointer',
    padding: 8,
    letterSpacing: '0.5px',
  },
}
