import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-primary-800 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-4 15H8v-2h6v2zm2-4H8v-2h8v2zm0-4H8V7h8v2z"/>
              </svg>
            </div>
            <span className="font-serif font-medium text-primary-800">BookMind</span>
          </div>
          <p className="text-xs text-gray-400 max-w-xs">
            AI-powered book recommendations using Open Library data and Claude AI.
          </p>
        </div>

        <nav className="flex gap-8 text-sm text-gray-500">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-gray-700 text-xs uppercase tracking-wide">Explore</span>
            <Link to="/"         className="hover:text-primary-800 transition-colors">Home</Link>
            <Link to="/search"   className="hover:text-primary-800 transition-colors">Browse Books</Link>
            <Link to="/chat"     className="hover:text-primary-800 transition-colors">AI Chat</Link>
            <Link to="/my-books" className="hover:text-primary-800 transition-colors">My Books</Link>
          </div>
        </nav>
      </div>
      <div className="border-t border-gray-100 text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} BookMind · Built with Open Library API & Claude AI
      </div>
    </footer>
  )
}