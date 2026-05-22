import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [appState, setAppState] = useState('splash') // splash | onboarding | app
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [recentlyPlayed, setRecentlyPlayed] = useState([])
  const [searchHistory, setSearchHistory] = useState([])
  const [settings, setSettings] = useState({
    accentColor: 'purple',
    audioQuality: 'high',
    animations: true,
    notifications: true,
  })

  // Boot sequence
  useEffect(() => {
    const saved = localStorage.getItem('vxnoir_user')
    const onboarded = localStorage.getItem('vxnoir_onboarded')

    setTimeout(() => {
      if (saved && onboarded) {
        setUser(JSON.parse(saved))
        setAppState('app')
      } else {
        setAppState('onboarding')
      }
    }, 3200)

    // Load persisted data
    const fav = localStorage.getItem('vxnoir_favorites')
    const pl = localStorage.getItem('vxnoir_playlists')
    const rp = localStorage.getItem('vxnoir_recent')
    const sh = localStorage.getItem('vxnoir_search_history')
    const st = localStorage.getItem('vxnoir_settings')

    if (fav) setFavorites(JSON.parse(fav))
    if (pl) setPlaylists(JSON.parse(pl))
    if (rp) setRecentlyPlayed(JSON.parse(rp))
    if (sh) setSearchHistory(JSON.parse(sh))
    if (st) setSettings(prev => ({ ...prev, ...JSON.parse(st) }))
  }, [])

  const saveUser = (userData) => {
    localStorage.setItem('vxnoir_user', JSON.stringify(userData))
    localStorage.setItem('vxnoir_onboarded', 'true')
    setUser(userData)
    setAppState('app')
  }

  const toggleFavorite = (track) => {
    setFavorites(prev => {
      const exists = prev.find(t => t.id === track.id)
      const next = exists ? prev.filter(t => t.id !== track.id) : [track, ...prev]
      localStorage.setItem('vxnoir_favorites', JSON.stringify(next))
      return next
    })
  }

  const isFavorite = (id) => favorites.some(t => t.id === id)

  const addToRecent = (track) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.id !== track.id)
      const next = [track, ...filtered].slice(0, 30)
      localStorage.setItem('vxnoir_recent', JSON.stringify(next))
      return next
    })
  }

  const addSearchHistory = (query) => {
    if (!query.trim()) return
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q !== query)
      const next = [query, ...filtered].slice(0, 10)
      localStorage.setItem('vxnoir_search_history', JSON.stringify(next))
      return next
    })
  }

  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('vxnoir_search_history')
  }

  const createPlaylist = (name) => {
    const pl = { id: Date.now().toString(), name, tracks: [], createdAt: Date.now(), cover: null }
    setPlaylists(prev => {
      const next = [pl, ...prev]
      localStorage.setItem('vxnoir_playlists', JSON.stringify(next))
      return next
    })
    return pl
  }

  const addToPlaylist = (playlistId, track) => {
    setPlaylists(prev => {
      const next = prev.map(pl => {
        if (pl.id !== playlistId) return pl
        const exists = pl.tracks.find(t => t.id === track.id)
        if (exists) return pl
        return { ...pl, tracks: [...pl.tracks, track] }
      })
      localStorage.setItem('vxnoir_playlists', JSON.stringify(next))
      return next
    })
  }

  const deletePlaylist = (id) => {
    setPlaylists(prev => {
      const next = prev.filter(pl => pl.id !== id)
      localStorage.setItem('vxnoir_playlists', JSON.stringify(next))
      return next
    })
  }

  const updateSettings = (key, value) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem('vxnoir_settings', JSON.stringify(next))
      return next
    })
  }

  const clearCache = () => {
    localStorage.removeItem('vxnoir_recent')
    localStorage.removeItem('vxnoir_search_history')
    setRecentlyPlayed([])
    setSearchHistory([])
  }

  return (
    <AppContext.Provider value={{
      appState, user, saveUser,
      favorites, toggleFavorite, isFavorite,
      recentlyPlayed, addToRecent,
      playlists, createPlaylist, addToPlaylist, deletePlaylist,
      searchHistory, addSearchHistory, clearSearchHistory,
      settings, updateSettings, clearCache,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
