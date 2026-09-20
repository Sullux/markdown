const isPunct = (c) => /^[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~\p{P}\p{S}]$/u.test(c)
const isWhite = (c) => !c || /\s/.test(c)

const getFlanking = (prevChar, nextChar, char) => {
  const lf = !isWhite(nextChar) && (!isPunct(nextChar) || isWhite(prevChar) || isPunct(prevChar))
  const rf = !isWhite(prevChar) && (!isPunct(prevChar) || isWhite(nextChar) || isPunct(nextChar))
  const canOpen = char === '_' ? lf && (!rf || isPunct(prevChar)) : lf
  const canClose = char === '_' ? rf && (!lf || isPunct(nextChar)) : rf
  return { canOpen, canClose }
}

const parseDelimiter = (text, index) => {
  const char = text[index]
  if (char !== '*' && char !== '_' && char !== '~') return null
  let run = 0
  while (index + run < text.length && text[index + run] === char) run++
  const prevChar = index > 0 ? text[index - 1] : ' '
  const nextChar = index + run < text.length ? text[index + run] : ' '
  const flanking = getFlanking(prevChar, nextChar, char)
  return {
    token: { type: 'delimiter', char, length: run, originalLength: run, ...flanking },
    consumedLength: run,
  }
}

const cleanTokens = (tokens) =>
  tokens.reduce((acc, t) => {
    const node = t.type === 'delimiter'
      ? { type: 'text', value: t.char.repeat(t.length) }
      : (t.children ? { ...t, children: cleanTokens(t.children) } : t)
    if (node.type === 'text' && acc.length && acc[acc.length - 1].type === 'text') {
      acc[acc.length - 1].value += node.value
    } else {
      acc.push(node)
    }
    return acc
  }, [])

const processDelimiters = (tokens) => {
  let closeIdx = 0
  while (closeIdx < tokens.length) {
    const closer = tokens[closeIdx]
    if (!closer || closer.type !== 'delimiter' || !closer.canClose) {
      closeIdx++
      continue
    }

    let openIdx = closeIdx - 1
    let opener = null
    while (openIdx >= 0) {
      const prev = tokens[openIdx]
      if (prev.type === 'delimiter' && prev.char === closer.char && prev.canOpen) {
        const bothOpenClose = (prev.canOpen && prev.canClose) || (closer.canOpen && closer.canClose)
        if (!bothOpenClose || (prev.originalLength + closer.originalLength) % 3 !== 0 || (prev.originalLength % 3 === 0 && closer.originalLength % 3 === 0)) {
          opener = prev
          break
        }
      }
      openIdx--
    }

    if (!opener) {
      closeIdx++
      continue
    }

    const isTilde = closer.char === '~'
    const use = (isTilde || (opener.length >= 2 && closer.length >= 2)) ? 2 : 1
    const nodeType = isTilde ? 'strikethrough' : (use === 2 ? 'bold' : 'italic')

    opener.length -= use
    closer.length -= use

    const inside = tokens.splice(openIdx + 1, closeIdx - openIdx - 1)
    tokens.splice(openIdx + 1, 0, { type: nodeType, children: inside })

    if (closer.length === 0) {
      tokens.splice(openIdx + 2, 1)
      closeIdx = openIdx + 1
    } else {
      closeIdx = openIdx + 2
    }

    if (opener.length === 0) {
      tokens.splice(openIdx, 1)
      closeIdx--
    }
  }

  return cleanTokens(tokens)
}

module.exports = { parseDelimiter, processDelimiters }
