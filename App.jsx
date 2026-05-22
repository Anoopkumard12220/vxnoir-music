import React, { useEffect, useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useApp } from './context/AppContext'

import SplashScreen from './pages/SplashScreen'
import OnboardingScreen from './pages/OnboardingScreen'
import MainLayout from './components/layout/MainLayout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import LibraryPage from './pages/LibraryPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import AmbientBg from './components/ui/AmbientBg'
import CursorGlow from './components/ui/CursorGlow'

export default function App() {
  const { appState } = useApp()

  if (appState === 'splash') return (
    <>
      <AmbientBg />
      <SplashScreen />
    </>
  )

  if (appState === 'onboarding') return (
    <>
      <AmbientBg />
      <OnboardingScreen />
    </>
  )

  return (
    <>
      <AmbientBg />
      <CursorGlow />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}
