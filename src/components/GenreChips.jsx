const GENRES = [
  { label: 'Fiction',      value: 'fiction' },
  { label: 'Fantasy',      value: 'fantasy' },
  { label: 'Sci-Fi',       value: 'science fiction' },
  { label: 'Mystery',      value: 'mystery' },
  { label: 'Thriller',     value: 'thriller' },
  { label: 'Romance',      value: 'romance' },
  { label: 'History',      value: 'history' },
  { label: 'Biography',    value: 'biography' },
  { label: 'Self-Help',    value: 'self-help' },
  { label: 'Horror',       value: 'horror' },
  { label: 'Adventure',    value: 'adventure' },
  { label: 'Philosophy',   value: 'philosophy' },
]

export { GENRES }

export default function GenreChips({ active, onSelect, className = '' }) {
  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {GENRES.map(g => (
        <button
          key={g.value}
          onClick={() => onSelect(g.value === active ? null : g.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            g.value === active
              ? 'bg-primary-800 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-800'
          }`}
        >
          {g.label}
        </button>
      ))}
    </div>
  )
}
