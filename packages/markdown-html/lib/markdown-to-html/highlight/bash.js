const { escapeHtml } = require('../escape')

const BASH_KEYWORDS = new Set(['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'in', 'do', 'done', 'case', 'esac', 'function', 'return', 'exit'])

const highlightBash = (code) => {
  const bashRegex = /(#.*$)|("(?:\\.|[^\\])*?"|'(?:\\.|[^\\])*?')|(\$[a-zA-Z0-9_]+|\$\{[^}]+\})|\b([a-zA-Z0-9_\-]+)\b/gm

  let result = ''
  let lastIndex = 0
  let match

  while ((match = bashRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(code.slice(lastIndex, match.index))
    }

    const [raw, cmt, strVal, varVal, wordVal] = match

    if (cmt) {
      result += `<span class="hl-cmt">${escapeHtml(cmt)}</span>`
    } else if (strVal) {
      result += `<span class="hl-str">${escapeHtml(strVal)}</span>`
    } else if (varVal) {
      result += `<span class="hl-var">${escapeHtml(varVal)}</span>`
    } else if (wordVal) {
      if (BASH_KEYWORDS.has(wordVal)) {
        result += `<span class="hl-kw">${escapeHtml(wordVal)}</span>`
      } else {
        result += escapeHtml(wordVal)
      }
    } else {
      result += escapeHtml(raw)
    }

    lastIndex = bashRegex.lastIndex
  }

  if (lastIndex < code.length) {
    result += escapeHtml(code.slice(lastIndex))
  }

  return result
}

module.exports = { highlightBash }
