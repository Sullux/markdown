const { parseValue, tokenizeAttributes } = require('./tokenize')

const parseAttributeList = (raw = '') => {
  let text = raw.trim()
  if (text.startsWith('{')) text = text.slice(1)
  if (text.startsWith(':')) text = text.slice(1)
  if (text.endsWith('}')) text = text.slice(0, -1)
  text = text.trim()

  const tokens = tokenizeAttributes(text)
  let id = undefined
  const classes = []
  const attributes = {}

  for (const token of tokens) {
    if (token.startsWith('#')) {
      id = token.slice(1)
    } else if (token.startsWith('.')) {
      classes.push(token.slice(1))
    } else {
      const eqIdx = token.indexOf('=')
      const colonIdx = token.indexOf(':')
      const sepIdx = eqIdx !== -1 ? eqIdx : colonIdx
      if (sepIdx !== -1) {
        const key = token.slice(0, sepIdx).trim()
        const rawVal = token.slice(sepIdx + 1).trim()
        if (key) attributes[key] = parseValue(rawVal)
      } else {
        attributes[token] = true
      }
    }
  }

  return { id, classes, attributes }
}

const extractTrailingAttributes = (text) => {
  if (!text) return null
  const match = text.match(/(?:^|[ \t]+)\{(?!%)(:?[^}\n]+)\}[ \t]*$/)
  if (!match) return null
  const inner = match[1].trim()
  if (!/^[ \t]*:|[#.]|[a-zA-Z0-9_\-]+[=:]/.test(inner)) return null
  const cleanText = text.slice(0, match.index).replace(/[ \t]+$/, '')
  const attrs = parseAttributeList(match[0])
  return { cleanText, ...attrs }
}

module.exports = { parseAttributeList, extractTrailingAttributes }
