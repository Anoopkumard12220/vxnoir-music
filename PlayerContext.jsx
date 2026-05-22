import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'
import { useApp } from './AppContext'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const { addToRecent } = useApp()
  const audioRef = useRef(null)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [queue, setQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Persist volume
  useEffect(() => {
    const saved = localStorage.getItem('vxnoir_volume')
    if (saved) setVolume(parseFloat(saved))
  }, [])

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.crossOrigin = 'anonymous'
      audioRef.current.preload = 'auto'
    }
    const audio = audioRef.current
    audio.volume = volume

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => setDuration(audio.duration || 0)
    const onEnded = () => handleEnded()
    const onLoadStart = () => { setIsLoading(true); setError(null) }
    const onCanPlay = () => setIsLoading(false)
    const onError = () => {
      setIsLoading(false)
      setError('Stream unavailable')
      setIsPlaying(false)
    }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('loadstart', onLoadStart)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('error', onError)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('loadstart', onLoadStart)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  const handleEnded = useCallback(() => {
    if (isRepeat) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    } else {
      playNext()
    }
  }, [isRepeat, queue, queueIndex, isShuffle])

  const playTrack = useCallback((track, trackQueue = null) => {
    if (!track?.streamUrl && !track?.previewUrl) return
    const url = track.streamUrl || track.previewUrl
    const audio = audioRef.current
    audio.src = url
    audio.load()
    audio.play().catch(e => console.warn('Playback error:', e))
    setCurrentTrack(track)
    setCurrentTime(0)
    setError(null)
    addToRecent(track)

    if (trackQueue) {
      setQueue(trackQueue)
      const idx = trackQueue.findIndex(t => t.id === track.id)
      setQueueIndex(idx >= 0 ? idx : 0)
    }

    // Media session API
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album || 'VXNOIR MUSIC',
        artwork: track.artwork ? [{ src: track.artwork, sizes: '512x512' }] : []
      })
    }
  }, [addToRecent])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio.src) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }, [])

  const playNext = useCallback(() => {
    if (!queue.length) return
    let nextIdx
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length)
    } else {
      nextIdx = (queueIndex + 1) % queue.length
    }
    setQueueIndex(nextIdx)
    playTrack(queue[nextIdx], null)
  }, [queue, queueIndex, isShuffle, playTrack])

  const playPrev = useCallback(() => {
    if (!queue.length) return
    if (currentTime > 3) {
      audioRef.current.currentTime = 0
      return
    }
    const prevIdx = (queueIndex - 1 + queue.length) % queue.length
    setQueueIndex(prevIdx)
    playTrack(queue[prevIdx], null)
  }, [queue, queueIndex, currentTime, playTrack])

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }, [])

  const changeVolume = useCallback((val) => {
    setVolume(val)
    audioRef.current.volume = val
    localStorage.setItem('vxnoir_volume', val.toString())
  }, [])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    const next = !isMuted
    audio.muted = next
    setIsMuted(next)
  }, [isMuted])

  const addToQueue = useCallback((track) => {
    setQueue(prev => [...prev, track])
  }, [])

  const removeFromQueue = useCallback((id) => {
    setQueue(prev => prev.filter(t => t.id !== id))
  }, [])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <PlayerContext.Provider value={{
      currentTrack, queue, queueIndex,
      isPlaying, duration, currentTime, progress,
      volume, isMuted, isRepeat, isShuffle,
      isFullscreen, setIsFullscreen,
      isLoading, error,
      playTrack, togglePlay, playNext, playPrev,
      seek, changeVolume, toggleMute,
      setIsRepeat, setIsShuffle,
      addToQueue, removeFromQueue, setQueue,
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)
