const { escapeHtml } = require('../escape')

const highlightYaml = (code) => {
  const yamlRegex = /(#.*$)|^([ \t]*[a-zA-Z0-9_\-]+)(:)|("(?:\\.|[^\\])*?"|'(?:\\.|[^\\])*?')|\b(true|false|null)\b|\b([0-9]+(?:\.[0-9]+)?)\b|([:\-\[\]{}])/gm

  let result = ''
  let lastIndex = 0
  let match

  while ((match = yamlRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(code.slice(lastIndex, match.index))
    }

    const [raw, cmt, keyName, colon, strVal, kwVal, numVal, puncVal] = match

    if (cmt) {
      result += `<span class="hl-cmt">${escapeHtml(cmt)}</span>`
    } else if (keyName) {
      result += `<span class="hl-key">${escapeHtml(keyName)}</span>` + (colon ? `<span class="hl-punc">${escapeHtml(colon)}</span>` : '')
    } else if (strVal) {
      result += `<span class="hl-str">${escapeHtml(strVal)}</span>`
    } else if (kwVal) {
      result += `<span class="hl-kw">${escapeHtml(kwVal)}</span>`
    } else if (numVal) {
      result += `<span class="hl-num">${escapeHtml(numVal)}</span>`
    } else if (puncVal) {
      result += `<span class="hl-punc">${escapeHtml(puncVal)}</span>`
    } else {
      result += escapeHtml(raw)
    }

    lastIndex = yamlRegex.lastIndex
  }

  if (lastIndex < code.length) {
    result += escapeHtml(code.slice(lastIndex))
  }

  return result
}

module.exports = { highlightYaml }
