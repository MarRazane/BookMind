import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import SearchBar from '../components/SearchBar'
import GenreChips from '../components/GenreChips'
import BookCard, { BookCardSkeleton } from '../components/BookCard'
import useBooks from '../hooks/useBooks'
import useDebounce from '../hooks/useDebounce'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q     = params.get('q') || ''
  const genre = params.get('genre') || ''

  const { data, loading, error, search, byGenre, trending } = useBooks()
  const [activeGenre, setActiveGenre] = useState(genre)

  useEffect(() => {
    if (q)           search(q)
    else if (genre)  byGenre(genre)
    else             trending()
  }, [q, genre])

  function handleGenreSelect(g) {
    setActiveGenre(g)
    if (g) {
      setParams({ genre: g })
      byGenre(g)
    } else {
      setParams({})
      trending()
    }
  }

  const title = q ? `Results for "${q}"` : activeGenre ? `${activeGenre} books` : 'Trending Books'

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <SearchBar className="max-w-2xl mb-5" />
          <GenreChips active={activeGenre} onSelect={handleGenreSelect} />
        </div>

        <div className="flex items-baseline justify-between mb-5">
          <h1 className="font-serif text-2xl font-medium capitalize">{title}</h1>
          {!loading && data.length > 0 && (
            <span className="text-sm text-gray-400">{data.length} books</span>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 mb-4">
            {error}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {loading
            ? Array.from({ length: 15 }).map((_, i) => <BookCardSkeleton key={i} />)
            : data.map(book => <BookCard key={book.id} book={book} />)
          }
        </div>

        {/* Empty state */}
        {!loading && data.length === 0 && !error && (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-500 font-medium">No books found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search or genre</p>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
