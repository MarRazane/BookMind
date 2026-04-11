import { useState, useCallback, useRef } from 'react'
import { sendMessage } from '../api/claude'
import { parseResponse } from '../utils/chatParser'

const SESSIONS_KEY = 'bookmind_chat_sessions'
const MAX_SESSIONS = 20

// ── Session persistence 
export function loadSessions() {
  try { return JSON.parse(localStorage.getItem(SESSIONS_KEY)) || [] }
  catch { return [] }
}

function saveSessions(sessions) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)))
}

function createSession() {
  return { id: Date.now().toString(), title: 'New conversation', messages: [], createdAt: Date.now() }
}

// ── Hook 
export default function useChat(sessionId) {
  const sessions        = loadSessions()
  const existing        = sessions.find(s => s.id === sessionId)
  const [messages, setMessages]   = useState(existing?.messages || [])
  const [isTyping, setIsTyping]   = useState(false)
  const [error,    setError]      = useState(null)
  const historyRef = useRef(messages)
  historyRef.current = messages

  const persistMessages = useCallback((msgs, sid) => {
    const all = loadSessions()
    const idx = all.findIndex(s => s.id === sid)
    const firstUserMsg = msgs.find(m => m.role === 'user')
    const title = firstUserMsg
      ? firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '…' : '')
      : 'New conversation'
    const session = { id: sid, title, messages: msgs, createdAt: existing?.createdAt || Date.now() }
    if (idx >= 0) all[idx] = session
    else all.unshift(session)
    saveSessions(all)
  }, [existing])

  const send = useCallback(async (userText, sid) => {
    if (!userText.trim() || isTyping) return

    const userMsg = { role: 'user', content: userText }
    const newMessages = [...historyRef.current, userMsg]
    setMessages(newMessages)
    setIsTyping(true)
    setError(null)

    // Build API-format history 
    const apiHistory = newMessages.map(m => ({ role: m.role, content: m.content }))

    try {
      const raw     = await sendMessage(apiHistory)
      const parsed  = parseResponse(raw)
      const botMsg  = {
        role:    'assistant',
        content: raw,             // raw stored for history
        parsed,                   // parsed for rendering
      }
      const updated = [...newMessages, botMsg]
      setMessages(updated)
      persistMessages(
        updated.map(m => ({ role: m.role, content: m.content, parsed: m.parsed })),
        sid
      )
    } catch (err) {
      setError(err.message || 'Failed to get a response')
    } finally {
      setIsTyping(false)
    }
  }, [isTyping, persistMessages])

  return { messages, isTyping, error, send }
}

export { createSession, saveSessions }
