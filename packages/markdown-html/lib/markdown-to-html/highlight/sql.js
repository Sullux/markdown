const { escapeHtml } = require('../escape')

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'UPDATE', 'DELETE', 'CREATE', 'TABLE',
  'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
  'ON', 'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL', 'AS', 'AND',
  'OR', 'NOT', 'IN', 'IS', 'NULL', 'LIKE', 'EXISTS', 'DEFAULT', 'VARCHAR', 'INTEGER', 'INT',
  'TEXT', 'BOOLEAN', 'TIMESTAMP', 'NOT', 'NULL', 'CAST'
])

const highlightSql = (code) => {
  const sqlRegex = /(--.*$|\/\*[\s\S]*?\*\/)|("?:?[a-zA-Z0-9_\-]+"?)|('(?:\\.|[^\'])*?')|\b([0-9]+(?:\.[0-9]+)?)\b|([(),.;=+*\/%<>!]+)/gm

  let result = ''
  let lastIndex = 0
  let match

  while ((match = sqlRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(code.slice(lastIndex, match.index))
    }

    const [raw, cmt, wordVal, strVal, numVal, puncVal] = match

    if (cmt) {
      result += `<span class="hl-cmt">${escapeHtml(cmt)}</span>`
    } else if (strVal) {
      result += `<span class="hl-str">${escapeHtml(strVal)}</span>`
    } else if (wordVal) {
      const upper = wordVal.toUpperCase()
      if (SQL_KEYWORDS.has(upper)) {
        result += `<span class="hl-kw">${escapeHtml(wordVal)}</span>`
      } else {
        result += escapeHtml(wordVal)
      }
    } else if (numVal) {
      result += `<span class="hl-num">${escapeHtml(numVal)}</span>`
    } else if (puncVal) {
      result += `<span class="hl-punc">${escapeHtml(puncVal)}</span>`
    } else {
      result += escapeHtml(raw)
    }

    lastIndex = sqlRegex.lastIndex
  }

  if (lastIndex < code.length) {
    result += escapeHtml(code.slice(lastIndex))
  }

  return result
}

module.exports = { highlightSql }
