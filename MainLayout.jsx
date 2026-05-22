import React, { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Search, Library, User, Settings } from 'lucide-react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import MiniPlayer from '../player/MiniPlayer'
import FullscreenPlayer from '../player/FullscreenPlayer'
import { usePlayer } from '../../context/PlayerContext'

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/search', icon: Search, label: 'Search' },
  { path: '/library', icon: Library, label: 'Library' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isFullscreen } = usePlayer()

  const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  }

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <Sidebar navItems={NAV_ITEMS} currentPath={location.pathname} navigate={navigate} />

      {/* Main content */}
      <main className="content-area">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ minHeight: '100%' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav (mobile) */}
      <BottomNav navItems={NAV_ITEMS} currentPath={location.pathname} navigate={navigate} />

      {/* Mini Player */}
      <MiniPlayer />

      {/* Fullscreen Player */}
      <AnimatePresence>
        {isFullscreen && <FullscreenPlayer />}
      </AnimatePresence>
    </div>
  )
}
