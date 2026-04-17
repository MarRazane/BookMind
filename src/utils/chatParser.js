// Parse 
export function parseBooks(text) {
  const match = text.match(/\[BOOKS:([\s\S]*?)END_BOOKS\]/)
  if (!match) return []
  try {
    const jsonStr = '[' + match[1].trim() + ']'
    return JSON.parse(jsonStr)
  } catch {
    
    try { return [JSON.parse(match[1].trim())] }
    catch { return [] }
  }
}

// Parse [OPTIONS:a|b|c] tag
export function parseOptions(text) {
  const match = text.match(/\[OPTIONS:(.*?)\]/)
  if (!match) return []
  return match[1].split('|').map(s => s.trim()).filter(Boolean)
}

// Strip all format tags from text for display
export function cleanText(text) {
  return text
    .replace(/\[BOOKS:.*?END_BOOKS\]/gs, '')
    
    .replace(/\[OPTIONS:.*?\]/gs, '')
    
    .replace(/\s+/g, ' ')
    
    .trim();
}

// Parse full Claude response into structured parts
export function parseResponse(raw) {
  return {
    text:    cleanText(raw),
    books:   parseBooks(raw),
    options: parseOptions(raw),
  }
}
