import { describe, it, expect } from 'vitest'
import { parseBooks, parseOptions, cleanText, parseResponse } from '../utils/chatParser'

const SAMPLE_BOOK_TAG = `[BOOKS:{"title":"Dune","author":"Frank Herbert","rating":"4.5/5","color":"#534AB7","description":"Epic sci-fi.","whyYou":"Matches your love of sci-fi."}END_BOOKS]`
const SAMPLE_OPTIONS  = `[OPTIONS:Tell me more|Another genre|Surprise me]`

describe('parseBooks', () => {
  it('parses a single book object', () => {
    const books = parseBooks(SAMPLE_BOOK_TAG)
    expect(books).toHaveLength(1)
    expect(books[0].title).toBe('Dune')
    expect(books[0].author).toBe('Frank Herbert')
  })

  it('returns empty array when no tag present', () => {
    expect(parseBooks('Just regular text.')).toEqual([])
  })

  it('returns empty array on malformed JSON', () => {
    expect(parseBooks('[BOOKS:{broken jsonEND_BOOKS]')).toEqual([])
  })
})

describe('parseOptions', () => {
  it('splits pipe-separated options', () => {
    const opts = parseOptions(SAMPLE_OPTIONS)
    expect(opts).toEqual(['Tell me more', 'Another genre', 'Surprise me'])
  })

  it('returns empty array when no tag present', () => {
    expect(parseOptions('No options here')).toEqual([])
  })

  it('trims whitespace from options', () => {
    const opts = parseOptions('[OPTIONS: Option A | Option B ]')
    expect(opts[0]).toBe('Option A')
    expect(opts[1]).toBe('Option B')
  })
})

describe('cleanText', () => {
  it('removes BOOKS tag', () => {
    const text = `Here are your picks: ${SAMPLE_BOOK_TAG} Enjoy!`
    expect(cleanText(text)).toBe('Here are your picks: Enjoy!')
  })

  it('removes OPTIONS tag', () => {
    const text = `What next? ${SAMPLE_OPTIONS}`
    expect(cleanText(text)).toBe('What next?')
  })

  it('removes both tags', () => {
    const text = `Picks: ${SAMPLE_BOOK_TAG} Choose: ${SAMPLE_OPTIONS}`
    expect(cleanText(text)).toBe('Picks: Choose:')
  })

  it('returns unmodified text when no tags', () => {
    expect(cleanText('Hello!')).toBe('Hello!')
  })
})

describe('parseResponse', () => {
  it('returns text, books, and options together', () => {
    const raw = `Great choices for you! ${SAMPLE_BOOK_TAG} What's next? ${SAMPLE_OPTIONS}`
    const result = parseResponse(raw)
    expect(result.text).toContain("Great choices for you!")
    expect(result.books).toHaveLength(1)
    expect(result.options).toHaveLength(3)
  })

  it('handles plain text with no tags', () => {
    const result = parseResponse('Just a message.')
    expect(result.text).toBe('Just a message.')
    expect(result.books).toEqual([])
    expect(result.options).toEqual([])
  })
})
