import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useDebounce from '../hooks/useDebounce'

export default function SearchBar({ onSearch, autoFocus = false, className = '' }) {
  const [params]   = useSearchParams()
  const navigate   = useNavigate()
  const [query, setQuery] = useState(params.get('q') || '')
  const debounced  = useDebounce(query, 400)

  // If onSearch prop given, call it on debounce (for inline search)
  useEffect(() => {
    if (onSearch && debounced.trim()) onSearch(debounced)
  }, [debounced, onSearch])

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <svg viewBox="0 0 24 24" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 fill-gray-400 pointer-events-none">
        <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search by title, author, or keyword…"
        autoFocus={autoFocus}
        className="w-full pl-12 pr-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
      />
      {query && (
        <button
          type="button"
          onClick={() => { setQuery(''); onSearch?.('') }}
          className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      )}
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary-800 text-white text-xs rounded-lg hover:bg-primary-600 transition"
      >
        Search
      </button>
    </form>
  )
}
