import { motion } from 'framer-motion'
import RecommendationCard from './RecommendationCard'

export default function ChatMessage({ message, onQuickReply }) {
  const isBot     = message.role === 'assistant'
  const parsed    = message.parsed || {}
  const text      = parsed.text  ?? message.content
  const books     = parsed.books  || []
  const options   = parsed.options || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
        isBot ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-600'
      }`}>
        {isBot ? '📚' : 'You'}
      </div>

      {/* Content */}
      <div className={`max-w-[80%] flex flex-col gap-2 ${isBot ? 'items-start' : 'items-end'}`}>
        {/* Text bubble */}
        {text && (
          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isBot
              ? 'bg-gray-100 text-gray-800 rounded-tl-sm'
              : 'bg-primary-800 text-white rounded-tr-sm'
          }`}>
            {text}
          </div>
        )}

        {/* Book recommendations */}
        {books.length > 0 && (
          <div className="flex flex-col gap-2 w-full">
            {books.map((book, i) => (
              <RecommendationCard key={i} book={book} />
            ))}
          </div>
        )}

        {/* Quick reply options */}
        {options.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onQuickReply?.(opt)}
                className="text-xs px-3 py-1.5 rounded-full border border-primary-200 text-primary-700 bg-primary-50 hover:bg-primary-100 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Typing indicator
export function TypingIndicator() {
  return (
    <div className="flex gap-3 items-center">
      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs">📚</div>
      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
        {[0, 150, 300].map(delay => (
          <span
            key={delay}
            className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
