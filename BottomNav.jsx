import React from 'react'
import { motion } from 'framer-motion'
import './BottomNav.css'

export default function BottomNav({ navItems, currentPath, navigate }) {
  return (
    <nav className="bottom-nav">
      {navItems.map(({ path, icon: Icon, label }) => {
        const active = currentPath === path
        return (
          <motion.button
            key={path}
            className={`bottom-nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(path)}
            whileTap={{ scale: 0.88 }}
          >
            {active && (
              <motion.div
                className="bottom-nav-bg"
                layoutId="bottomNavBg"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon
              size={20}
              strokeWidth={active ? 2.5 : 1.8}
              style={{ position: 'relative', zIndex: 1 }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
          </motion.button>
        )
      })}
    </nav>
  )
}
