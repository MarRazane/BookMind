import { useEffect, useRef, useState } from 'react'
import ChatMessage, { TypingIndicator } from './ChatMessage'
import useChat from '../hooks/useChat'

export default function ChatWindow({ sessionId, onSessionUpdate }) {
  const { messages, isTyping, error, send } = useChat(sessionId)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Send greeting on mount if no history
  useEffect(() => {
    if (messages.length === 0) {
      send('Hello! I just opened BookMind. Please greet me warmly and start helping me find great books.', sessionId)
    }
  }, [])

  function handleSend() {
    const text = input.trim()
    if (!text || isTyping) return
    setInput('')
    send(text, sessionId)
    inputRef.current?.focus()
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            message={msg}
            onQuickReply={(text) => { send(text, sessionId) }}
          />
        ))}
        {isTyping && <TypingIndicator />}
        {error && (
          <p className="text-xs text-red-500 text-center bg-red-50 rounded-lg px-4 py-2">
            {error} — please try again.
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 px-4 py-3 bg-white">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about a book, or answer my question…"
            rows={1}
            className="flex-1 resize-none px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition max-h-32"
            style={{ minHeight: '48px' }}
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="w-11 h-11 bg-primary-800 text-white rounded-xl flex items-center justify-center hover:bg-primary-600 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 pl-1">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
