import { useState, useEffect, useCallback } from 'react'
export function useMusicFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const fetch = useCallback(async () => {
    setLoading(true); setError(null)
    try { setData(await fetchFn()) } catch (e) { setError(e.message) } finally { setLoading(false) }
  }, deps)
  useEffect(() => { fetch() }, [fetch])
  return { data, loading, error, refetch: fetch }
}
