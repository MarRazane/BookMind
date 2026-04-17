import { describe, it, expect, beforeEach } from 'vitest'
import {
  getAll, addToShelf, removeFromShelf, moveBook, getBookShelf, getStats, SHELVES
} from '../utils/readingList'

// Mock localStorage for tests
const localStorageMock = (() => {
  let store = {}
  return {
    getItem:    (k) => store[k] ?? null,
    setItem:    (k, v) => { store[k] = String(v) },
    removeItem: (k) => { delete store[k] },
    clear:      () => { store = {} },
  }
})()
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

const MOCK_BOOK = {
  id: 'OL12345W',
  title: 'Dune',
  author: 'Frank Herbert',
  cover: null,
  genres: ['science fiction'],
}

beforeEach(() => {
  localStorage.clear()
})

describe('addToShelf', () => {
  it('adds a book to the correct shelf', () => {
    addToShelf(SHELVES.WANT, MOCK_BOOK)
    const list = getAll()
    expect(list.wantToRead).toHaveLength(1)
    expect(list.wantToRead[0].id).toBe('OL12345W')
  })

  it('moves a book from another shelf when re-adding', () => {
    addToShelf(SHELVES.WANT, MOCK_BOOK)
    addToShelf(SHELVES.READING, MOCK_BOOK)
    const list = getAll()
    expect(list.wantToRead).toHaveLength(0)
    expect(list.reading).toHaveLength(1)
  })

  it('adds addedAt timestamp', () => {
    addToShelf(SHELVES.WANT, MOCK_BOOK)
    const list = getAll()
    expect(list.wantToRead[0].addedAt).toBeDefined()
    expect(typeof list.wantToRead[0].addedAt).toBe('number')
  })
})

describe('removeFromShelf', () => {
  it('removes a book by id', () => {
    addToShelf(SHELVES.WANT, MOCK_BOOK)
    removeFromShelf(SHELVES.WANT, 'OL12345W')
    expect(getAll().wantToRead).toHaveLength(0)
  })

  it('does nothing for unknown id', () => {
    addToShelf(SHELVES.WANT, MOCK_BOOK)
    removeFromShelf(SHELVES.WANT, 'UNKNOWN')
    expect(getAll().wantToRead).toHaveLength(1)
  })
})

describe('moveBook', () => {
  it('moves book between shelves', () => {
    addToShelf(SHELVES.WANT, MOCK_BOOK)
    moveBook(SHELVES.WANT, SHELVES.FINISHED, 'OL12345W')
    const list = getAll()
    expect(list.wantToRead).toHaveLength(0)
    expect(list.finished).toHaveLength(1)
  })
})

describe('getBookShelf', () => {
  it('returns the shelf the book is on', () => {
    addToShelf(SHELVES.READING, MOCK_BOOK)
    expect(getBookShelf('OL12345W')).toBe(SHELVES.READING)
  })

  it('returns null if book not found', () => {
    expect(getBookShelf('NOTEXIST')).toBeNull()
  })
})

describe('getStats', () => {
  it('counts books correctly', () => {
    addToShelf(SHELVES.WANT, MOCK_BOOK)
    addToShelf(SHELVES.READING, { ...MOCK_BOOK, id: 'OL2' })
    addToShelf(SHELVES.FINISHED, { ...MOCK_BOOK, id: 'OL3' })
    const stats = getStats()
    expect(stats.total).toBe(3)
    expect(stats.wantToRead).toBe(1)
    expect(stats.reading).toBe(1)
    expect(stats.finished).toBe(1)
  })

  it('returns topGenre from all books', () => {
    addToShelf(SHELVES.WANT, MOCK_BOOK)
    const stats = getStats()
    expect(stats.topGenre).toBe('science fiction')
  })

  it('returns zero stats on empty list', () => {
    const stats = getStats()
    expect(stats.total).toBe(0)
    expect(stats.topGenre).toBeNull()
  })
})
