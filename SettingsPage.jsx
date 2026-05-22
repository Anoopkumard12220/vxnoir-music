import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Moon, Zap, HardDrive, Trash2, Bell, Info, Palette, Volume2, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getStorageUsage, formatBytes } from '../utils/helpers'
import toast from 'react-hot-toast'
import './SettingsPage.css'

const ACCENT_COLORS = [
  { id: 'purple', color: '#9b5de5', label: 'Neon Purple' },
  { id: 'blue', color: '#00b4ff', label: 'Cyber Blue' },
  { id: 'pink', color: '#f72585', label: 'Neon Pink' },
  { id: 'cyan', color: '#00f5d4', label: 'Matrix Cyan' },
  { id: 'yellow', color: '#fee440', label: 'Electric Gold' },
]

const QUALITY_OPTIONS = ['low (64kbps)', 'medium (128kbps)', 'high (320kbps)']

export default function SettingsPage() {
  const { settings, updateSettings, clearCache, user } = useApp()
  const [storage, setStorage] = useState(null)

  useEffect(() => {
    getStorageUsage().then(setStorage)
  }, [])

  const handleClearCache = () => {
    clearCache()
    toast.success('Cache cleared!')
  }

  return (
    <div className="settings-page page-content">
      <motion.div className="settings-title" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        Settings
      </motion.div>

      {/* Appearance */}
      <SettingsSection title="Appearance" icon={<Palette size={16} />}>
        <SettingsRow label="Dark Mode" sub="Always on — VXNOIR native" icon={<Moon size={18} />}>
          <div className="toggle active" />
        </SettingsRow>

        <div className="settings-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="settings-item-icon"><Zap size={18} /></div>
            <div>
              <div className="settings-item-label">Accent Color</div>
              <div className="settings-item-sub">Choose your vibe</div>
            </div>
          </div>
          <div className="accent-grid">
            {ACCENT_COLORS.map(ac => (
              <motion.button
                key={ac.id}
                className={`accent-dot ${settings.accentColor === ac.id ? 'active' : ''}`}
                style={{ background: ac.color }}
                onClick={() => updateSettings('accentColor', ac.id)}
                whileTap={{ scale: 0.85 }}
                title={ac.label}
              />
            ))}
          </div>
        </div>

        <SettingsRow
          label="Animations"
          sub="Motion effects & transitions"
          icon={<Zap size={18} />}
        >
          <Toggle value={settings.animations} onChange={v => updateSettings('animations', v)} />
        </SettingsRow>
      </SettingsSection>

      {/* Audio */}
      <SettingsSection title="Audio" icon={<Volume2 size={16} />}>
        <div className="settings-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="settings-item-icon"><Volume2 size={18} /></div>
            <div>
              <div className="settings-item-label">Stream Quality</div>
              <div className="settings-item-sub">Higher = more data usage</div>
            </div>
          </div>
          <div className="quality-options">
            {QUALITY_OPTIONS.map((q, i) => (
              <motion.button
                key={q}
                className={`quality-btn ${settings.audioQuality === q.split(' ')[0] ? 'active' : ''}`}
                onClick={() => updateSettings('audioQuality', q.split(' ')[0])}
                whileTap={{ scale: 0.95 }}
              >
                {q.split(' ')[0]}
              </motion.button>
            ))}
          </div>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications" icon={<Bell size={16} />}>
        <SettingsRow label="Push Notifications" sub="New releases & recommendations" icon={<Bell size={18} />}>
          <Toggle value={settings.notifications} onChange={v => updateSettings('notifications', v)} />
        </SettingsRow>
      </SettingsSection>

      {/* Storage */}
      <SettingsSection title="Storage & Data" icon={<HardDrive size={16} />}>
        {storage && (
          <div className="storage-bar-wrap">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14, color: 'var(--text2)' }}>
                {formatBytes(storage.used)} used
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text3)' }}>
                {storage.pct}%
              </span>
            </div>
            <div className="storage-bar">
              <motion.div
                className="storage-fill"
                initial={{ width: 0 }}
                animate={{ width: `${storage.pct}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: 'var(--text3)', marginTop: 8 }}>
              {formatBytes(storage.total)} total
            </div>
          </div>
        )}
        <SettingsRow label="Clear Cache" sub="History, search data" icon={<Trash2 size={18} />} onClick={handleClearCache}>
          <ChevronRight size={16} color="var(--text3)" />
        </SettingsRow>
      </SettingsSection>

      {/* About */}
      <SettingsSection title="About" icon={<Info size={16} />}>
        <div className="about-card">
          <div className="about-logo">VXNOIR</div>
          <div className="about-version">Version 1.0.0</div>
          <div className="about-desc">Ultra Premium Futuristic Music Streaming</div>
          <div className="about-divider" />
          <div className="about-dev">
            <span style={{ color: 'var(--text3)' }}>Developed by</span>{' '}
            <span style={{ color: 'var(--neon-purple)', fontWeight: 700 }}>ANOOP KUMAR DUBEY</span>
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
            @anoop_.exe · VXNOIR Brand
          </div>
        </div>
      </SettingsSection>

      <div style={{ height: 20 }} />
    </div>
  )
}

function SettingsSection({ title, icon, children }) {
  return (
    <motion.section
      className="settings-section"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="settings-section-title">
        {icon} {title}
      </div>
      <div className="settings-section-body">{children}</div>
    </motion.section>
  )
}

function SettingsRow({ label, sub, icon, children, onClick }) {
  return (
    <div className="settings-item" onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="settings-item-icon">{icon}</div>
        <div>
          <div className="settings-item-label">{label}</div>
          <div className="settings-item-sub">{sub}</div>
        </div>
      </div>
      {children}
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <motion.div
      className={`toggle ${value ? 'active' : ''}`}
      onClick={() => onChange(!value)}
      whileTap={{ scale: 0.9 }}
    />
  )
}
