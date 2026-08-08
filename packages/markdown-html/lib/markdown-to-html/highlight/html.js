const { escapeHtml } = require('../escape')

const highlightHtml = (code) => {
  const htmlRegex = /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z0-9\-]+)|([a-zA-Z0-9\-]+)=("[^"]*"|'[^']*')|(\/?>)/g

  let result = ''
  let lastIndex = 0
  let match

  while ((match = htmlRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(code.slice(lastIndex, match.index))
    }

    const [raw, cmt, tagStart, attrName, attrVal, tagEnd] = match

    if (cmt) {
      result += `<span class="hl-cmt">${escapeHtml(cmt)}</span>`
    } else if (tagStart) {
      result += `<span class="hl-tag">${escapeHtml(tagStart)}</span>`
    } else if (attrName && attrVal) {
      result += `<span class="hl-attr">${escapeHtml(attrName)}</span>=<span class="hl-str">${escapeHtml(attrVal)}</span>`
    } else if (tagEnd) {
      result += `<span class="hl-tag">${escapeHtml(tagEnd)}</span>`
    } else {
      result += escapeHtml(raw)
    }

    lastIndex = htmlRegex.lastIndex
  }

  if (lastIndex < code.length) {
    result += escapeHtml(code.slice(lastIndex))
  }

  return result
}

module.exports = { highlightHtml }
