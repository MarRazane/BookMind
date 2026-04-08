import { Link } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'

export default function NotFoundPage() {
  return (
    <PageWrapper>
      <div className="max-w-xl mx-auto px-4 py-32 text-center">
        <p className="text-7xl mb-6">📚</p>
        <h1 className="font-serif text-3xl font-medium text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-8">
          This page has gone the way of missing library books.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 bg-primary-800 text-white rounded-xl hover:bg-primary-600 transition text-sm font-medium"
          >
            Go Home
          </Link>
          <Link
            to="/chat"
            className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:border-primary-400 hover:text-primary-700 transition text-sm"
          >
            Ask AI for a book
          </Link>
        </div>
      </div>
    </PageWrapper>
  )
}