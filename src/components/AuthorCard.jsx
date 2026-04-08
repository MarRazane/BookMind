export default function AuthorCard({ author }) {
  if (!author) return null

  return (
    <div className="flex gap-4 items-start bg-gray-50 rounded-2xl p-5 border border-gray-100">
      {/* Avatar */}
      <div className="shrink-0">
        {author.photo ? (
          <img src={author.photo} alt={author.name} className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 text-xl font-serif font-medium">
            {author.name?.[0]}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h3 className="font-serif text-lg font-medium text-gray-900">{author.name}</h3>
        {author.birthDate && (
          <p className="text-xs text-gray-400 mt-0.5">Born: {author.birthDate}</p>
        )}
        {author.bio && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-3 leading-relaxed">
            {author.bio}
          </p>
        )}
      </div>
    </div>
  )
}
