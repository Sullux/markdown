const { escapeHtml } = require('../escape')

const JS_KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
  'switch', 'case', 'break', 'continue', 'default', 'import', 'export', 'from',
  'as', 'class', 'extends', 'super', 'this', 'new', 'try', 'catch', 'finally',
  'throw', 'async', 'await', 'yield', 'typeof', 'instanceof', 'in', 'of', 'null',
  'undefined', 'true', 'false', 'void', 'delete'
])

const highlightJs = (code) => {
  const tokenRegex = /(\/\/.*$|\/\*[\s\S]*?\*\/)|("(?:\\[\s\S]|[^"\\])*?"|'(?:\\[\s\S]|[^'\\])*?'|`(?:\\[\s\S]|[^`\\])*?`)|(\b[0-9]+(?:\.[0-9]+)?\b)|(\b[a-zA-Z_$][a-zA-Z0-9_$]*\b)|([{}()\[\];,.:+=\-*\/%&|^!~?<>]+)/gm

  let result = ''
  let lastIndex = 0
  let match

  while ((match = tokenRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(code.slice(lastIndex, match.index))
    }

    const [raw, comment, stringLiteral, numberLiteral, identifier, punctuation] = match

    if (comment) {
      result += `<span class="hl-cmt">${escapeHtml(comment)}</span>`
    } else if (stringLiteral) {
      result += `<span class="hl-str">${escapeHtml(stringLiteral)}</span>`
    } else if (numberLiteral) {
      result += `<span class="hl-num">${escapeHtml(numberLiteral)}</span>`
    } else if (identifier) {
      if (JS_KEYWORDS.has(identifier)) {
        result += `<span class="hl-kw">${escapeHtml(identifier)}</span>`
      } else {
        result += `<span class="hl-id">${escapeHtml(identifier)}</span>`
      }
    } else if (punctuation) {
      result += `<span class="hl-punc">${escapeHtml(punctuation)}</span>`
    } else {
      result += escapeHtml(raw)
    }

    lastIndex = tokenRegex.lastIndex
  }

  if (lastIndex < code.length) {
    result += escapeHtml(code.slice(lastIndex))
  }

  return result
}

module.exports = { highlightJs }
