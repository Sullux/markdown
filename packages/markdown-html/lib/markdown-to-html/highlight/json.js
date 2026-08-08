const { escapeHtml } = require('../escape')

const highlightJson = (code) => {
  const jsonRegex = /("(?:\\.|[^\\])*?")\s*(:)|("(?:\\.|[^\\])*?")|\b(true|false|null)\b|\b(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b|([{}()\[\],])/g

  let result = ''
  let lastIndex = 0
  let match

  while ((match = jsonRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(code.slice(lastIndex, match.index))
    }

    const [raw, keyStr, colon, valStr, boolNull, num, punc] = match

    if (keyStr && colon) {
      result += `<span class="hl-key">${escapeHtml(keyStr)}</span>` + `<span class="hl-punc">${escapeHtml(colon)}</span>`
    } else if (valStr) {
      result += `<span class="hl-str">${escapeHtml(valStr)}</span>`
    } else if (boolNull) {
      result += `<span class="hl-kw">${escapeHtml(boolNull)}</span>`
    } else if (num) {
      result += `<span class="hl-num">${escapeHtml(num)}</span>`
    } else if (punc) {
      result += `<span class="hl-punc">${escapeHtml(punc)}</span>`
    } else {
      result += escapeHtml(raw)
    }

    lastIndex = jsonRegex.lastIndex
  }

  if (lastIndex < code.length) {
    result += escapeHtml(code.slice(lastIndex))
  }

  return result
}

module.exports = { highlightJson }
