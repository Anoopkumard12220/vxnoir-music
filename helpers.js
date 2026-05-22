// Format seconds to MM:SS
export const formatTime = (sec) => {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// Format large numbers
export const formatCount = (n) => {
  if (!n) return '0'
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return n.toString()
}

// Truncate text
export const truncate = (str, max = 28) =>
  str && str.length > max ? str.slice(0, max) + '…' : str || ''

// Get gender icon and avatar colors
export const getGenderConfig = (gender) => {
  switch (gender) {
    case 'male': return { icon: '♂', color: '#00b4ff', bg: 'rgba(0,180,255,0.12)', label: 'Male' }
    case 'female': return { icon: '♀', color: '#f72585', bg: 'rgba(247,37,133,0.12)', label: 'Female' }
    default: return { icon: '⚧', color: '#9b5de5', bg: 'rgba(155,93,229,0.12)', label: 'Other' }
  }
}

// Generate greeting based on hour
export const getGreeting = (name) => {
  const h = new Date().getHours()
  const time = h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening'
  return `${time}, ${name}`
}

// Get random artwork placeholder
export const artworkFallback = (seed) => {
  const colors = ['9b5de5', '00b4ff', 'f72585', '00f5d4', 'fee440']
  const c = colors[seed % colors.length]
  return `https://ui-avatars.com/api/?name=♪&background=${c}&color=fff&size=200&font-size=0.5`
}

// Debounce
export const debounce = (fn, ms) => {
  let t
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms) }
}

// Clamp
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

// Format date
export const formatDate = (ts) => {
  const d = new Date(ts)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Random item
export const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Get storage usage estimate
export const getStorageUsage = async () => {
  if (!navigator.storage?.estimate) return null
  const { usage, quota } = await navigator.storage.estimate()
  return { used: usage, total: quota, pct: Math.round((usage / quota) * 100) }
}

export const formatBytes = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
