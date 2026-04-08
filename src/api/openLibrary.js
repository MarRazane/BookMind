import axios from 'axios'
import { transformBook, transformSearchResult } from '../utils/bookTransformer'

const BASE     = 'https://openlibrary.org'
const COVERS   = 'https://covers.openlibrary.org/b/id'

// ── Search 
export async function searchBooks(query, limit = 20) {
  const { data } = await axios.get(`${BASE}/search.json`, {
    params: { q: query, limit, fields: 'key,title,author_name,cover_i,subject,first_publish_year,ratings_average,number_of_pages_median' },
  })
  return (data.docs || []).map(transformSearchResult)
}

// ── Search by genre/subject
export async function getBooksByGenre(genre, limit = 20) {
  const { data } = await axios.get(`${BASE}/search.json`, {
    params: { subject: genre, limit, fields: 'key,title,author_name,cover_i,subject,first_publish_year,ratings_average' },
  })
  return (data.docs || []).map(transformSearchResult)
}

// ── Full book detail 
export async function getBookById(workId) {
  const id = workId.startsWith('/works/') ? workId : `/works/${workId}`
  const { data } = await axios.get(`${BASE}${id}.json`)
  return transformBook(data, id)
}

// ── Author detail
export async function getAuthorById(authorId) {
  const id = authorId.startsWith('/authors/') ? authorId : `/authors/${authorId}`
  const { data } = await axios.get(`${BASE}${id}.json`)
  return {
    id:    data.key,
    name:  data.name,
    bio:   typeof data.bio === 'string' ? data.bio : data.bio?.value || '',
    photo: data.photos?.[0]
      ? `https://covers.openlibrary.org/a/id/${data.photos[0]}-M.jpg`
      : null,
    birthDate: data.birth_date || null,
  }
}

// ── Editions 
export async function getEditions(workId, limit = 5) {
  const id = workId.startsWith('/works/') ? workId : `/works/${workId}`
  const { data } = await axios.get(`${BASE}${id}/editions.json`, { params: { limit } })
  return data.entries || []
}

// ── Cover URL helper
export function getCoverUrl(coverId, size = 'M') {
  if (!coverId) return null
  return `${COVERS}/${coverId}-${size}.jpg`
}

// ── Trending / featured 
export async function getTrending(limit = 12) {
  const { data } = await axios.get(`${BASE}/search.json`, {
    params: { q: 'bestseller', sort: 'rating', limit, fields: 'key,title,author_name,cover_i,subject,first_publish_year,ratings_average' },
  })
  return (data.docs || []).map(transformSearchResult)
}
