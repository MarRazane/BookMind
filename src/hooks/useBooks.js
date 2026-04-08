import { useState, useCallback } from 'react'
import { searchBooks, getBooksByGenre, getTrending } from '../api/openLibrary'

export default function useBooks() {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const run = useCallback(async (fn) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fn()
      setData(result)
    } catch (err) {
      setError(err.message || 'Something went wrong')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  const search  = useCallback((q)      => run(() => searchBooks(q)),      [run])
  const byGenre = useCallback((genre)  => run(() => getBooksByGenre(genre)), [run])
  const trending = useCallback(()      => run(() => getTrending()),        [run])

  return { data, loading, error, search, byGenre, trending }
}
