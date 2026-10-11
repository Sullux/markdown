const parseValue = (val) => {
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    return val.slice(1, -1)
  }
  if (val === 'true') return true
  if (val === 'false') return false
  return val
}

const tokenizeAttributes = (str) => {
  const rawTokens = []
  let current = ''
  let inQuote = null
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (inQuote) {
      current += char
      if (char === inQuote && str[i - 1] !== '\\') inQuote = null
    } else if (char === '"' || char === "'") {
      inQuote = char
      current += char
    } else if (/\s/.test(char)) {
      if (current.length) {
        rawTokens.push(current)
        current = ''
      }
    } else {
      current += char
    }
  }
  if (current.length) rawTokens.push(current)

  const tokens = []
  for (let i = 0; i < rawTokens.length; i++) {
    const t = rawTokens[i]
    if ((t.endsWith('=') || t.endsWith(':')) && i + 1 < rawTokens.length) {
      tokens.push(t + rawTokens[++i])
    } else if (
      i + 2 < rawTokens.length &&
      (rawTokens[i + 1] === '=' || rawTokens[i + 1] === ':')
    ) {
      tokens.push(t + rawTokens[i + 1] + rawTokens[i + 2])
      i += 2
    } else if (
      i + 1 < rawTokens.length &&
      (rawTokens[i + 1].startsWith('=') || rawTokens[i + 1].startsWith(':'))
    ) {
      tokens.push(t + rawTokens[++i])
    } else {
      tokens.push(t)
    }
  }
  return tokens
}

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

module.exports = { parseAttributeList }
