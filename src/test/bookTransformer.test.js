import { describe, it, expect } from 'vitest'
import {
  transformSearchResult,
  transformBook,
  formatRating,
  getInitials,
} from '../utils/bookTransformer'

// ── transformSearchResult 
describe('transformSearchResult', () => {
  const mockDoc = {
    key: '/works/OL12345W',
    title: 'Dune',
    author_name: ['Frank Herbert'],
    cover_i: 9876,
    subject: ['science fiction', 'adventure', 'politics'],
    first_publish_year: 1965,
    ratings_average: 4.25,
    number_of_pages_median: 412,
  }

  it('extracts id without /works/ prefix', () => {
    const book = transformSearchResult(mockDoc)
    expect(book.id).toBe('OL12345W')
  })

  it('keeps fullKey intact', () => {
    const book = transformSearchResult(mockDoc)
    expect(book.fullKey).toBe('/works/OL12345W')
  })

  it('maps title and first author', () => {
    const book = transformSearchResult(mockDoc)
    expect(book.title).toBe('Dune')
    expect(book.author).toBe('Frank Herbert')
  })

  it('rounds rating to 1 decimal', () => {
    const book = transformSearchResult(mockDoc)
    expect(book.rating).toBe(4.3)
  })

  it('returns null cover when cover_i missing', () => {
    const book = transformSearchResult({ ...mockDoc, cover_i: undefined })
    expect(book.cover).toBeNull()
  })

  it('normalizes known genres from subjects', () => {
    const book = transformSearchResult(mockDoc)
    expect(book.genres).toContain('science fiction')
    expect(book.genres).toContain('adventure')
  })

  it('handles missing author gracefully', () => {
    const book = transformSearchResult({ ...mockDoc, author_name: undefined })
    expect(book.author).toBe('Unknown Author')
  })

  it('handles missing title gracefully', () => {
    const book = transformSearchResult({ ...mockDoc, title: undefined })
    expect(book.title).toBe('Unknown Title')
  })
})

// ── transformBook 
describe('transformBook', () => {
  const mockWork = {
    title: 'The Hobbit',
    description: { value: 'A hobbit goes on an adventure.' },
    covers: [1234],
    subjects: ['fantasy', 'adventure'],
    authors: [{ author: { key: '/authors/OL99W' }, role: 'Author' }],
    first_publish_date: '1937',
  }

  it('extracts description from object.value', () => {
    const book = transformBook(mockWork, '/works/OL999W')
    expect(book.description).toBe('A hobbit goes on an adventure.')
  })

  it('handles string description', () => {
    const book = transformBook({ ...mockWork, description: 'Plain string.' }, '/works/OL999W')
    expect(book.description).toBe('Plain string.')
  })

  it('returns empty string when no description', () => {
    const book = transformBook({ ...mockWork, description: undefined }, '/works/OL999W')
    expect(book.description).toBe('')
  })

  it('maps author keys correctly', () => {
    const book = transformBook(mockWork, '/works/OL999W')
    expect(book.authors[0].key).toBe('/authors/OL99W')
  })

  it('strips /works/ from id', () => {
    const book = transformBook(mockWork, '/works/OL999W')
    expect(book.id).toBe('OL999W')
  })
})

// ── formatRating
describe('formatRating', () => {
  it('formats a number to X.X / 5', () => {
    expect(formatRating(4.2)).toBe('4.2 / 5')
  })
  it('returns "No rating" for null', () => {
    expect(formatRating(null)).toBe('No rating')
  })
  it('returns "No rating" for undefined', () => {
    expect(formatRating(undefined)).toBe('No rating')
  })
})

// ── getInitials 
describe('getInitials', () => {
  it('returns first letters of first two words', () => {
    expect(getInitials('Harry Potter')).toBe('HP')
  })
  it('handles single word', () => {
    expect(getInitials('Dune')).toBe('D')
  })
  it('handles empty string', () => {
    expect(getInitials('')).toBe('')
  })
  it('uppercases letters', () => {
    expect(getInitials('the hobbit')).toBe('TH')
  })
})
