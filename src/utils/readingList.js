const KEY = 'bookmind_reading_list'

export const SHELVES = {
  WANT:     'wantToRead',
  READING:  'reading',
  FINISHED: 'finished',
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {
      wantToRead: [],
      reading:    [],
      finished:   [],
    }
  } catch {
    return { wantToRead: [], reading: [], finished: [] }
  }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function getAll() {
  return load()
}

export function getShelf(shelf) {
  return load()[shelf] || []
}

export function addToShelf(shelf, book) {
  const data = load()
  // Remove from all shelves first
  for (const s of Object.values(SHELVES)) {
    data[s] = data[s].filter(b => b.id !== book.id)
  }
  data[shelf] = [{ ...book, addedAt: Date.now() }, ...data[shelf]]
  save(data)
}

export function removeFromShelf(shelf, bookId) {
  const data = load()
  data[shelf] = data[shelf].filter(b => b.id !== bookId)
  save(data)
}

export function moveBook(fromShelf, toShelf, bookId) {
  const data = load()
  const book = data[fromShelf].find(b => b.id === bookId)
  if (!book) return
  data[fromShelf] = data[fromShelf].filter(b => b.id !== bookId)
  data[toShelf]   = [{ ...book, addedAt: Date.now() }, ...data[toShelf]]
  save(data)
}

export function getBookShelf(bookId) {
  const data = load()
  for (const [shelf, books] of Object.entries(data)) {
    if (books.some(b => b.id === bookId)) return shelf
  }
  return null
}

export function getStats() {
  const data = load()
  const total = Object.values(data).reduce((sum, arr) => sum + arr.length, 0)
  const allBooks = Object.values(data).flat()
  const genreCounts = {}
  allBooks.forEach(b => {
    (b.genres || []).forEach(g => {
      genreCounts[g] = (genreCounts[g] || 0) + 1
    })
  })
  const topGenre = Object.entries(genreCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || null
  return {
    total,
    wantToRead: data.wantToRead.length,
    reading:    data.reading.length,
    finished:   data.finished.length,
    topGenre,
  }
}
