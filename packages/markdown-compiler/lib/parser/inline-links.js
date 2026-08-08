const parseInlineLinks = (text, index, parseInline) => {
  if (!text.startsWith('[', index)) return null

  let bracketDepth = 0
  let textClose = -1
  for (let i = index; i < text.length; i++) {
    const char = text.charAt(i)
    if (char === '[') bracketDepth++
    else if (char === ']') {
      bracketDepth--
      if (bracketDepth === 0) {
        textClose = i
        break
      }
    }
  }

  if (textClose !== -1 && text.charAt(textClose + 1) === '(') {
    let parenDepth = 0
    let urlClose = -1
    for (let i = textClose + 1; i < text.length; i++) {
      const char = text.charAt(i)
      if (char === '(') parenDepth++
      else if (char === ')') {
        parenDepth--
        if (parenDepth === 0) {
          urlClose = i
          break
        }
      }
    }

    if (urlClose !== -1) {
      const linkText = text.slice(index + 1, textClose)
      const url = text.slice(textClose + 2, urlClose)
      return {
        token: { type: 'link', url, children: parseInline(linkText) },
        consumedLength: urlClose + 1 - index,
      }
    }
  }

  return null
}

module.exports = { parseInlineLinks }
