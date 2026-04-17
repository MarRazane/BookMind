import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getInitials } from '../utils/bookTransformer'
import StarRating from './StarRating'

const SPINE_COLORS = [
  '#534AB7','#0F6E56','#993C1D','#185FA5',
  '#993556','#3B6D11','#854F0B','#A32D2D',
]

function spineColor(title = '') {
  let hash = 0
  for (const c of title) hash = (hash << 5) - hash + c.charCodeAt(0)
  return SPINE_COLORS[Math.abs(hash) % SPINE_COLORS.length]
}

export default function BookCard({ book, className = '' }) {
  const { id, title, author, cover, rating, year, genres } = book
  const color = spineColor(title)

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        to={`/book/${id}`}
        className={`block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden ${className}`}
      >
        {/* Cover */}
        <div className="aspect-[2/3] w-full bg-gray-100 relative overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white text-3xl font-serif font-medium"
              style={{ backgroundColor: color }}
            >
              {getInitials(title)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-serif text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{author}</p>

          <div className="flex items-center justify-between mt-2">
            {rating
              ? <StarRating rating={rating} size="sm" />
              : <span className="text-xs text-gray-300">No rating</span>
            }
            {year && <span className="text-xs text-gray-400">{year}</span>}
          </div>

          {genres?.[0] && (
            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 capitalize">
              {genres[0]}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

// Skeleton placeholder while loading
export function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-200 rounded w-3/5" />
        <div className="h-3 bg-gray-200 rounded w-2/5 mt-3" />
      </div>
    </div>
  )
}
