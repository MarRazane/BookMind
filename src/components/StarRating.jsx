export default function StarRating({ rating, size = 'md', showNumber = true }) {
  const max   = 5
  const filled = Math.round((rating / max) * 5)
  const sz = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 24 24" className={`${sz} ${i < filled ? 'fill-amber-400' : 'fill-gray-200'}`}>
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        ))}
      </div>
      {showNumber && (
        <span className={`text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {rating?.toFixed(1)}
        </span>
      )}
    </div>
  )
}
