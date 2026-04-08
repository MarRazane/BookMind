import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [open,  setOpen]  = useState(false)
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setOpen(false)
    }
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-primary-800' : 'text-gray-600 hover:text-primary-800'
    }`

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-4 15H8v-2h6v2zm2-4H8v-2h8v2zm0-4H8V7h8v2z"/>
            </svg>
          </div>
          <span className="font-serif font-medium text-lg text-primary-800 hidden sm:block">BookMind</span>
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-sm hidden md:flex">
          <div className="relative w-full">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search books, authors…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition"
            />
            <svg viewBox="0 0 24 24" className="w-4 h-4 absolute left-2.5 top-2.5 fill-gray-400">
              <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
        </form>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/"         end className={linkClass}>Home</NavLink>
          <NavLink to="/search"   className={linkClass}>Browse</NavLink>
          <NavLink to="/chat"     className={linkClass}>Chat</NavLink>
          <NavLink to="/my-books" className={linkClass}>My Books</NavLink>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-700">
            {open
              ? <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              : <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search books…"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            <button type="submit" className="px-3 py-2 bg-primary-800 text-white text-sm rounded-lg">Go</button>
          </form>
          <NavLink to="/"         end className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/search"   className={linkClass}     onClick={() => setOpen(false)}>Browse</NavLink>
          <NavLink to="/chat"     className={linkClass}     onClick={() => setOpen(false)}>Chat</NavLink>
          <NavLink to="/my-books" className={linkClass}     onClick={() => setOpen(false)}>My Books</NavLink>
        </div>
      )}
    </header>
  )
}