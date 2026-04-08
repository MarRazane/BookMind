import { getCoverUrl } from '../api/openLibrary'

// Normalize a search result doc from /search.json
export function transformSearchResult(doc) {
  return {
    id:          doc.key?.replace('/works/', '') || '',
    fullKey:     doc.key || '',
    title:       doc.title || 'Unknown Title',
    author:      doc.author_name?.[0] || 'Unknown Author',
    allAuthors:  doc.author_name || [],
    cover:       getCoverUrl(doc.cover_i, 'M'),
    coverLarge:  getCoverUrl(doc.cover_i, 'L'),
    rating:      doc.ratings_average ? Number(doc.ratings_average.toFixed(1)) : null,
    year:        doc.first_publish_year || null,
    genres:      normalizeGenres(doc.subject),
    pages:       doc.number_of_pages_median || null,
  }
}

// Normalize a full work detail from /works/{id}.json
export function transformBook(data, workId) {
  return {
    id:          workId.replace('/works/', ''),
    fullKey:     workId,
    title:       data.title || 'Unknown Title',
    description: extractDescription(data.description),
    cover:       data.covers?.[0] ? getCoverUrl(data.covers[0], 'M') : null,
    coverLarge:  data.covers?.[0] ? getCoverUrl(data.covers[0], 'L') : null,
    genres:      normalizeGenres(data.subjects),
    authors:     data.authors?.map(a => ({
      key:  a.author?.key || '',
      role: a.role || 'Author',
    })) || [],
    created:     data.created?.value || null,
    firstPublish: data.first_publish_date || null,
  }
}

// ── Helpers 
function extractDescription(desc) {
  if (!desc) return ''
  if (typeof desc === 'string') return desc
  if (desc.value) return desc.value
  return ''
}

function normalizeGenres(subjects) {
  if (!subjects || !Array.isArray(subjects)) return []
  const KNOWN = [
    'fiction','fantasy','science fiction','mystery','thriller','romance',
    'horror','history','biography','self-help','non-fiction','adventure',
    'philosophy','poetry','drama','humor','children','young adult',
  ]
  return subjects
    .map(s => s.toLowerCase())
    .filter(s => KNOWN.some(k => s.includes(k)))
    .slice(0, 5)
}

// Format rating for display
export function formatRating(rating) {
  if (!rating) return 'No rating'
  return `${rating.toFixed(1)} / 5`
}

// Get initials from a title 
export function getInitials(title = '') {
  return title.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')
}
