import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function RecommendationCard({ book }) {
  const { title, author, rating, color = '#534AB7', description, whyYou } = book
  const initials = title.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')
  const navigate = useNavigate()

  function handleSearch() {
    navigate(`/search?q=${encodeURIComponent(title)}`)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 shadow-sm hover:shadow-md transition-shadow w-full">
      {/* Spine */}
      <div
        className="w-10 h-14 rounded-md shrink-0 flex items-center justify-center text-white text-xs font-serif font-medium"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <button
          onClick={handleSearch}
          className="font-serif text-sm font-medium text-gray-900 hover:text-primary-800 transition-colors text-left leading-snug"
        >
          {title}
        </button>
        <p className="text-xs text-gray-500 mt-0.5">by {author}</p>
        {rating && (
          <p className="text-xs text-amber-600 mt-0.5">★ {rating} on Goodreads</p>
        )}
        {description && (
          <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{description}</p>
        )}
        {whyYou && (
          <p className="text-xs text-primary-700 mt-1.5 italic leading-relaxed">→ {whyYou}</p>
        )}
      </div>
    </div>
  )
}
