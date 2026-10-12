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

module.exports = { parseValue, tokenizeAttributes }
