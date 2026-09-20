const parseBreak = (text, index, tokens) => {
  if (text[index] !== '\n') return null
  let isHard = false
  if (tokens.length && tokens[tokens.length - 1].type === 'text') {
    const last = tokens[tokens.length - 1]
    const spaceMatch = last.value.match(/ {2,}$/)
    if (spaceMatch) {
      last.value = last.value.slice(0, -spaceMatch[0].length)
      isHard = true
    } else {
      last.value = last.value.replace(/[ \t]+$/, '')
    }
  }
  const lead = text.slice(index + 1).match(/^[ \t]*/)
  const skip = lead ? lead[0].length : 0
  const rest = text.slice(index + 1 + skip)
  const token = rest.length > 0 ? (isHard ? { type: 'br' } : { type: 'text', value: '\n' }) : null
  return { token, consumedLength: 1 + skip }
}

module.exports = { parseBreak }
