import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import SearchBar from '../components/SearchBar'
import GenreShelf from '../components/GenreShelf'

const FEATURED_GENRES = ['fantasy', 'mystery', 'science fiction']

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary-200 text-sm font-medium uppercase tracking-widest mb-3">
              AI-Powered Book Discovery
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-4">
              Find your next<br />
              <span className="italic text-primary-200">great read</span>
            </h1>
            <p className="text-primary-200 text-lg max-w-xl mb-8 leading-relaxed">
              Chat with BookMind — tell it your mood, genre, and interests.
              It'll recommend the perfect book, every time.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link
                to="/chat"
                className="px-6 py-3.5 bg-white text-primary-800 font-medium rounded-xl hover:bg-primary-50 transition shadow-lg"
              >
                Chat with BookMind →
              </Link>
              <Link
                to="/search"
                className="px-6 py-3.5 border border-primary-400 text-white rounded-xl hover:bg-primary-700 transition"
              >
                Browse Books
              </Link>
            </div>

            <SearchBar
              className="w-full max-w-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-center gap-12">
          {[
            ['20M+', 'Books in Library'],
            ['Free', 'No Account Needed'],
            ['Claude AI', 'Powering Recommendations'],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="font-serif text-2xl font-medium text-primary-800">{val}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Genre shelves */}
      <section className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-12">
        {FEATURED_GENRES.map(genre => (
          <GenreShelf key={genre} genre={genre} title={genre.charAt(0).toUpperCase() + genre.slice(1)} />
        ))}
      </section>

      {/* CTA banner */}
      <section className="bg-primary-50 border-y border-primary-100">
        <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl font-medium text-primary-900">Ready for a personalized recommendation?</h2>
            <p className="text-gray-600 mt-1">Tell BookMind your genre, mood, and age — get the perfect picks.</p>
          </div>
          <Link
            to="/chat"
            className="shrink-0 px-6 py-3 bg-primary-800 text-white rounded-xl hover:bg-primary-600 transition font-medium"
          >
            Start chatting →
          </Link>
        </div>
      </section>
    </PageWrapper>
  )
}