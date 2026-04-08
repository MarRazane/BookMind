import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import ShelfTabs from '../components/ShelfTabs'
import useReadingList from '../hooks/useReadingList'
import { getInitials } from '../utils/bookTransformer'

const SPINE_COLORS = ['#534AB7','#0F6E56','#993C1D','#185FA5','#993556','#3B6D11','#854F0B','#A32D2D']
function spineColor(title = '') {
  let h = 0
  for (const c of title) h = (h << 5) - h + c.charCodeAt(0)
  return SPINE_COLORS[Math.abs(h) % SPINE_COLORS.length]
}

const SHELF_LABELS = { wantToRead: 'Want to Read', reading: 'Reading', finished: 'Finished' }
const OTHER_SHELVES = {
  wantToRead: ['reading', 'finished'],
  reading:    ['wantToRead', 'finished'],
  finished:   ['wantToRead', 'reading'],
}

export default function ReadingListPage() {
  const { list, stats, remove, move } = useReadingList()
  const [activeShelf, setActiveShelf] = useState('wantToRead')

  const books = list[activeShelf] || []

  const counts = {
    wantToRead: list.wantToRead?.length || 0,
    reading:    list.reading?.length    || 0,
    finished:   list.finished?.length   || 0,
  }

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-medium text-gray-900">My Books</h1>
          <p className="text-gray-500 mt-1 text-sm">Your personal reading library</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Books',   value: stats.total },
            { label: 'Want to Read',  value: stats.wantToRead },
            { label: 'Reading',       value: stats.reading },
            { label: 'Finished',      value: stats.finished },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
              <p className="text-2xl font-serif font-medium text-primary-800">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {stats.topGenre && (
          <p className="text-sm text-gray-500 mb-6">
            Your top genre: <span className="font-medium text-primary-700 capitalize">{stats.topGenre}</span>
          </p>
        )}

        {/* Shelf tabs */}
        <ShelfTabs active={activeShelf} counts={counts} onChange={setActiveShelf} />

        {/* Book list */}
        <div className="mt-6">
          {books.length === 0 ? (
            <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500 font-medium">No books here yet</p>
              <p className="text-gray-400 text-sm mt-1 mb-4">
                Add books from the detail page or ask the AI chatbot for recommendations
              </p>
              <div className="flex justify-center gap-3">
                <Link to="/search" className="text-sm px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-600 transition">
                  Browse Books
                </Link>
                <Link to="/chat" className="text-sm px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:border-primary-400 hover:text-primary-700 transition">
                  Ask AI
                </Link>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {books.map((book) => (
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 shadow-sm"
                  >
                    {/* Cover / Spine */}
                    <Link to={`/book/${book.id}`} className="shrink-0">
                      {book.cover ? (
                        <img src={book.cover} alt={book.title} className="w-14 h-20 object-cover rounded-lg shadow" />
                      ) : (
                        <div
                          className="w-14 h-20 rounded-lg flex items-center justify-center text-white text-sm font-serif font-medium shadow"
                          style={{ backgroundColor: spineColor(book.title) }}
                        >
                          {getInitials(book.title)}
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/book/${book.id}`}>
                        <h3 className="font-serif text-sm font-medium text-gray-900 hover:text-primary-800 line-clamp-2 leading-snug">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Added {new Date(book.addedAt).toLocaleDateString()}
                      </p>

                      {/* Move to shelf */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {OTHER_SHELVES[activeShelf].map(target => (
                          <button
                            key={target}
                            onClick={() => move(activeShelf, target, book.id)}
                            className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-primary-400 hover:text-primary-700 transition"
                          >
                            → {SHELF_LABELS[target]}
                          </button>
                        ))}
                        <button
                          onClick={() => remove(activeShelf, book.id)}
                          className="text-xs px-2.5 py-1 rounded-full border border-red-100 text-red-400 hover:bg-red-50 hover:border-red-300 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
