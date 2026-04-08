import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import StarRating from '../components/StarRating'
import AuthorCard from '../components/AuthorCard'
import BookCard, { BookCardSkeleton } from '../components/BookCard'
import { getBookById, getAuthorById, getBooksByGenre } from '../api/openLibrary'
import { getInitials } from '../utils/bookTransformer'
import { addToShelf, getBookShelf, SHELVES } from '../utils/readingList'

const SPINE_COLORS = ['#534AB7','#0F6E56','#993C1D','#185FA5','#993556','#3B6D11','#854F0B','#A32D2D']

export default function BookDetailPage() {
  const { id } = useParams()
  const [book,    setBook]    = useState(null)
  const [author,  setAuthor]  = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [shelf,   setShelf]   = useState(() => getBookShelf(id))
  const [shelfMsg, setShelfMsg] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const b = await getBookById(id)
        setBook(b)

        // Load author
        if (b.authors?.[0]?.key) {
          const a = await getAuthorById(b.authors[0].key).catch(() => null)
          setAuthor(a)
        }

        // Load similar books
        if (b.genres?.[0]) {
          const sim = await getBooksByGenre(b.genres[0], 10).catch(() => [])
          setSimilar(sim.filter(s => s.id !== id).slice(0, 6))
        }
      } catch (err) {
        setError('Could not load this book. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
    window.scrollTo(0, 0)
  }, [id])

  function handleAddToShelf(shelfKey) {
    if (!book) return
    const bookData = {
      id,
      title:  book.title,
      author: author?.name || 'Unknown',
      cover:  book.cover,
      genres: book.genres,
    }
    addToShelf(shelfKey, bookData)
    setShelf(shelfKey)
    setShelfMsg(`Added to "${shelfKey === 'wantToRead' ? 'Want to Read' : shelfKey === 'reading' ? 'Reading' : 'Finished'}"!`)
    setTimeout(() => setShelfMsg(''), 2500)
  }

  // Loading
  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
          <div className="flex gap-10">
            <div className="w-52 h-80 bg-gray-200 rounded-xl shrink-0" />
            <div className="flex-1 space-y-4 pt-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4 mt-6" />
              <div className="space-y-2 mt-6">
                {[...Array(5)].map((_,i) => <div key={i} className="h-3 bg-gray-200 rounded" />)}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (error || !book) {
    return (
      <PageWrapper>
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
          <p className="text-5xl mb-4">📕</p>
          <p className="text-gray-600 font-medium">{error || 'Book not found'}</p>
          <Link to="/search" className="mt-4 inline-block text-primary-600 hover:underline text-sm">
            ← Back to search
          </Link>
        </div>
      </PageWrapper>
    )
  }

  const color    = SPINE_COLORS[Math.abs(id.charCodeAt(0)) % SPINE_COLORS.length]
  const descText = book.description || 'No description available for this book.'
  const SHORT    = 300
  const showToggle = descText.length > SHORT

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          {' / '}
          <Link to="/search" className="hover:text-primary-600">Browse</Link>
          {' / '}
          <span className="text-gray-600">{book.title}</span>
        </nav>

        {/* Main section */}
        <div className="flex flex-col md:flex-row gap-10 mb-12">
          {/* Cover */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="shrink-0 mx-auto md:mx-0"
          >
            {book.coverLarge ? (
              <img
                src={book.coverLarge}
                alt={book.title}
                className="w-48 md:w-56 rounded-xl shadow-xl object-cover"
              />
            ) : (
              <div
                className="w-48 md:w-56 h-72 rounded-xl shadow-xl flex items-center justify-center text-white text-4xl font-serif font-medium"
                style={{ backgroundColor: color }}
              >
                {getInitials(book.title)}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1"
          >
            <h1 className="font-serif text-3xl md:text-4xl font-medium text-gray-900 leading-tight">
              {book.title}
            </h1>
            {author && (
              <p className="text-lg text-gray-500 mt-2">by {author.name}</p>
            )}

            <div className="flex flex-wrap gap-3 mt-4 items-center">
              <StarRating rating={4.0} showNumber />
              {book.firstPublish && (
                <span className="text-sm text-gray-400">Published {book.firstPublish}</span>
              )}
            </div>

            {/* Genres */}
            {book.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {book.genres.map(g => (
                  <Link
                    key={g}
                    to={`/search?genre=${encodeURIComponent(g)}`}
                    className="text-xs px-3 py-1 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 capitalize transition"
                  >
                    {g}
                  </Link>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="mt-6">
              <p className="text-gray-700 leading-relaxed text-sm">
                {showToggle && !expanded ? descText.slice(0, SHORT) + '…' : descText}
              </p>
              {showToggle && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-primary-600 text-sm mt-1 hover:underline"
                >
                  {expanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>

            {/* Reading list actions */}
            <div className="mt-6 flex flex-wrap gap-2">
              {Object.entries({
                wantToRead: '🔖 Want to Read',
                reading:    '📖 Reading',
                finished:   '✅ Finished',
              }).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleAddToShelf(key)}
                  className={`px-4 py-2 text-sm rounded-lg border transition font-medium ${
                    shelf === key
                      ? 'bg-primary-800 text-white border-primary-800'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400 hover:text-primary-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {shelfMsg && (
              <p className="text-teal-600 text-sm mt-2 font-medium">{shelfMsg}</p>
            )}
          </motion.div>
        </div>

        {/* Author card */}
        {author && (
          <div className="mb-12">
            <h2 className="font-serif text-xl font-medium mb-4">About the Author</h2>
            <AuthorCard author={author} />
          </div>
        )}

        {/* Similar books */}
        {similar.length > 0 && (
          <div>
            <h2 className="font-serif text-xl font-medium mb-4">You might also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {similar.map(b => <BookCard key={b.id} book={b} />)}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
