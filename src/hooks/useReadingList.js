import { useState, useCallback } from 'react'
import {
  getAll, addToShelf, removeFromShelf, moveBook, getBookShelf, getStats
} from '../utils/readingList'

export default function useReadingList() {
  const [list,  setList]  = useState(() => getAll())
  const [stats, setStats] = useState(() => getStats())

  const refresh = useCallback(() => {
    setList(getAll())
    setStats(getStats())
  }, [])

  const add = useCallback((shelf, book) => {
    addToShelf(shelf, book)
    refresh()
  }, [refresh])

  const remove = useCallback((shelf, bookId) => {
    removeFromShelf(shelf, bookId)
    refresh()
  }, [refresh])

  const move = useCallback((fromShelf, toShelf, bookId) => {
    moveBook(fromShelf, toShelf, bookId)
    refresh()
  }, [refresh])

  const shelfOf = useCallback((bookId) => getBookShelf(bookId), [])

  return { list, stats, add, remove, move, shelfOf, refresh }
}
