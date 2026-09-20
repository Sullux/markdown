const parseCodeSpan = (text, index) => {
  if (text[index] !== '`') return null
  if (index > 0 && text[index - 1] === '`') return null
  let openLen = 0
  while (index + openLen < text.length && text[index + openLen] === '`') openLen++

  let pos = index + openLen
  while (pos < text.length) {
    if (text[pos] === '`') {
      let closeLen = 0
      while (pos + closeLen < text.length && text[pos + closeLen] === '`') closeLen++
      if (closeLen === openLen) {
        let content = text.slice(index + openLen, pos).replace(/\n/g, ' ')
        if (content.length >= 2 && content.startsWith(' ') && content.endsWith(' ') && content.trim().length > 0) {
          content = content.slice(1, -1)
        }
        return {
          token: { type: 'code', value: content },
          consumedLength: pos + closeLen - index,
        }
      }
      pos += closeLen
    } else {
      pos++
    }
  }
  return null
}

module.exports = { parseCodeSpan }
