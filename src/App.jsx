import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import BookDetailPage from './pages/BookDetailPage'
import ChatPage from './pages/ChatPage'
import ReadingListPage from './pages/ReadingListPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/"           element={<HomePage />} />
              <Route path="/search"     element={<SearchPage />} />
              <Route path="/book/:id"   element={<BookDetailPage />} />
              <Route path="/chat"       element={<ChatPage />} />
              <Route path="/my-books"   element={<ReadingListPage />} />
              <Route path="*"           element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}