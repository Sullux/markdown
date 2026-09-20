const parseWikilink = (text, index) => {
  if (!text.startsWith('[[', index)) return null
  const closeIdx = text.indexOf(']]', index + 2)
  if (closeIdx === -1) return null
  const raw = text.slice(index + 2, closeIdx)
  const pipeIdx = raw.indexOf('|')
  const target = (pipeIdx !== -1 ? raw.slice(0, pipeIdx) : raw).trim()
  const display = (pipeIdx !== -1 ? raw.slice(pipeIdx + 1) : raw).trim()
  return {
    token: { type: 'wikilink', target, display },
    consumedLength: closeIdx + 2 - index,
  }
}

module.exports = { parseWikilink }
