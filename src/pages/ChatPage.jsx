import { useState, useEffect } from 'react'
import PageWrapper from '../components/PageWrapper'
import ChatWindow from '../components/ChatWindow'
import { loadSessions, createSession, saveSessions } from '../hooks/useChat'

export default function ChatPage() {
  const [sessions,   setSessions]   = useState(() => loadSessions())
  const [activeId,   setActiveId]   = useState(() => {
    const s = loadSessions()
    return s[0]?.id || null
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Create first session if none exist
  useEffect(() => {
    if (!activeId) {
      const s = createSession()
      saveSessions([s])
      setSessions([s])
      setActiveId(s.id)
    }
  }, [])

  function startNewChat() {
    const s = createSession()
    const all = [s, ...loadSessions()]
    saveSessions(all)
    setSessions(all)
    setActiveId(s.id)
    setSidebarOpen(false)
  }

  function refreshSessions() {
    setSessions(loadSessions())
  }

  const activeSession = sessions.find(s => s.id === activeId)

  return (
    <PageWrapper className="h-[calc(100vh-4rem)]">
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-100
          flex flex-col transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `} style={{ top: '4rem' }}>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-serif text-base font-medium text-gray-800">Conversations</h2>
            <button
              onClick={startNewChat}
              className="text-xs px-3 py-1.5 bg-primary-800 text-white rounded-lg hover:bg-primary-600 transition"
            >
              + New
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {sessions.length === 0 ? (
              <p className="text-xs text-gray-400 px-4 py-3">No conversations yet.</p>
            ) : (
              sessions.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setActiveId(s.id); setSidebarOpen(false) }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 ${
                    s.id === activeId ? 'bg-primary-50 border-l-2 border-l-primary-600' : ''
                  }`}
                >
                  <p className={`text-sm truncate ${s.id === activeId ? 'text-primary-800 font-medium' : 'text-gray-700'}`}>
                    {s.title || 'New conversation'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <div className="h-14 border-b border-gray-100 px-4 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-1.5 rounded-lg hover:bg-gray-100"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-600">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
              </button>
              <div>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {activeSession?.title || 'BookMind Chat'}
                </p>
                <p className="text-xs text-gray-400">AI Book Recommendation</p>
              </div>
            </div>
            <button
              onClick={startNewChat}
              className="hidden md:flex text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-700 transition"
            >
              + New chat
            </button>
          </div>

          {/* Chat window */}
          {activeId && (
            <div className="flex-1 overflow-hidden">
              <ChatWindow
                key={activeId}
                sessionId={activeId}
                onSessionUpdate={refreshSessions}
              />
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
