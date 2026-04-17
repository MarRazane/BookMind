import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useBooks from '../hooks/useBooks'
import BookCard, { BookCardSkeleton } from './BookCard'

export default function GenreShelf({ genre, title }) {
  const { data, loading, byGenre } = useBooks()

  useEffect(() => { byGenre(genre) }, [genre])

  return (
    <section>
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="font-serif text-xl font-medium capitalize">{title || genre}</h2>
        <Link
          to={`/search?genre=${encodeURIComponent(genre)}`}
          className="text-sm text-primary-600 hover:underline"
        >
          See all →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-36 shrink-0"><BookCardSkeleton /></div>
            ))
          : data.slice(0, 10).map(book => (
              <div key={book.id} className="w-36 shrink-0">
                <BookCard book={book} />
              </div>
            ))}
      </div>
    </section>
  )
}
