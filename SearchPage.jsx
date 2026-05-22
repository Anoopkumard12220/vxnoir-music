import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, TrendingUp, Mic } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { globalSearch } from '../api/musicApi'
import { TrackListItem } from '../components/ui/TrackCard'
import { debounce } from '../utils/helpers'
import toast from 'react-hot-toast'
import './SearchPage.css'

const TRENDING_SEARCHES = ['Lo-fi beats', 'Hip hop 2024', 'Electronic', 'Indie pop', 'Jazz', 'Ambient', 'R&B', 'Rock classics']
const GENRE_CARDS = [
  { label: 'Hip Hop', color: '#f72585', emoji: '🎤' },
  { label: 'Electronic', color: '#9b5de5', emoji: '🎛️' },
  { label: 'Pop', color: '#fee440', emoji: '🌟' },
  { label: 'Rock', color: '#00b4ff', emoji: '🎸' },
  { label: 'Jazz', color: '#00f5d4', emoji: '🎷' },
  { label: 'R&B', color: '#f72585', emoji: '🎵' },
  { label: 'Classical', color: '#9b5de5', emoji: '🎻' },
  { label: 'Lo-fi', color: '#00b4ff', emoji: '🌙' },
  { label: 'Metal', color: '#55557a', emoji: '🤘' },
  { label: 'Indie', color: '#fee440', emoji: '🎶' },
]

export default function SearchPage() {
  const { searchHistory, addSearchHistory, clearSearchHistory } = useApp()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef(null)

  const doSearch = useCallback(debounce(async (q) => {
    if (!q.trim()) { setResults([]); setHasSearched(false); return }
    setLoading(true)
    setHasSearched(true)
    const res = await globalSearch(q)
    setResults(res)
    setLoading(false)
  }, 500), [])

  const handleInput = (val) => {
    setQuery(val)
    doSearch(val)
  }

  const handleSubmit = (q) => {
    const term = q || query
    if (!term.trim()) return
    addSearchHistory(term)
    setQuery(term)
    doSearch.cancel?.()
    setLoading(true)
    setHasSearched(true)
    globalSearch(term).then(res => { setResults(res); setLoading(false) })
  }

  const clear = () => { setQuery(''); setResults([]); setHasSearched(false) }

  return (
    <div className="search-page page-content">
      {/* Search bar */}
      <motion.div
        className="search-bar-wrap"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="search-bar">
          <Search size={18} color="#9090bb" />
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Songs, artists, albums..."
            value={query}
            onChange={e => handleInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          {query && (
            <button className="search-clear" onClick={clear}><X size={16} /></button>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Results */}
        {hasSearched && (
          <motion.div key="results"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {loading ? (
              <div className="search-loading">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 62, borderRadius: 10, marginBottom: 8 }} />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div>
                <div className="results-header">
                  <span className="results-count">{results.length} results for "{query}"</span>
                </div>
                {results.map((t, i) => (
                  <TrackListItem key={t.id} track={t} queue={results} index={i} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <div className="no-results-title">No results found</div>
                <div className="no-results-sub">Try different keywords or check spelling</div>
              </div>
            )}
          </motion.div>
        )}

        {/* Default state */}
        {!hasSearched && (
          <motion.div key="default"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
          >
            {/* Search history */}
            {searchHistory.length > 0 && (
              <section>
                <div className="section-header">
                  <div className="section-title"><Clock size={12} style={{ display: 'inline', marginRight: 6 }} />Recent Searches</div>
                  <span className="section-see-all" onClick={clearSearchHistory}>Clear</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {searchHistory.map(q => (
                    <motion.button key={q} className="history-chip"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSubmit(q)}
                    >
                      <Clock size={12} /> {q}
                    </motion.button>
                  ))}
                </div>
              </section>
            )}

            {/* Trending searches */}
            <section>
              <div className="section-header">
                <div className="section-title"><TrendingUp size={12} style={{ display: 'inline', marginRight: 6 }} />Trending</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TRENDING_SEARCHES.map(q => (
                  <motion.button key={q} className="trending-chip"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSubmit(q)}
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Browse genres */}
            <section>
              <div className="section-header">
                <div className="section-title">Browse Genres</div>
              </div>
              <div className="genre-grid">
                {GENRE_CARDS.map((g, i) => (
                  <motion.button
                    key={g.label}
                    className="genre-card"
                    style={{ '--g-color': g.color }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSubmit(g.label)}
                  >
                    <span className="genre-emoji">{g.emoji}</span>
                    <span className="genre-label">{g.label}</span>
                  </motion.button>
                ))}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
