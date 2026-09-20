const parseCodeFenceHeader = (line) => {
  const match = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*(.*)$/)
  if (!match) return null
  const fence = match[1]
  const rawInfo = (match[2] || '').trim()
  if (fence[0] === '`' && rawInfo.includes('`')) return null

  const indentMatch = line.match(/^ {0,3}/)
  const indent = indentMatch ? indentMatch[0].length : 0

  if (!rawInfo) {
    return { fenceLen: fence.length, fenceChar: fence[0], indent, language: null, languageMetadata: undefined }
  }
  const spaceIdx = rawInfo.indexOf(' ')
  if (spaceIdx === -1) {
    return { fenceLen: fence.length, fenceChar: fence[0], indent, language: rawInfo, languageMetadata: undefined }
  }
  const language = rawInfo.slice(0, spaceIdx).trim()
  const languageMetadata = rawInfo.slice(spaceIdx + 1).trim()
  return { fenceLen: fence.length, fenceChar: fence[0], indent, language: language || null, languageMetadata: languageMetadata || undefined }
}

const parseCodeBlock = (lines, startIndex) => {
  const header = parseCodeFenceHeader(lines[startIndex])
  if (!header) return null

  const { fenceLen, fenceChar, indent, language, languageMetadata } = header
  const closeRe = new RegExp(`^ {0,3}${fenceChar === '`' ? '`' : '~'}{${fenceLen},}[ \\t]*$`)
  const codeLines = []
  let i = startIndex + 1

  while (i < lines.length) {
    const line = lines[i]
    if (closeRe.test(line)) {
      i++
      break
    }
    const stripped = line.startsWith(' '.repeat(indent)) ? line.slice(indent) : line.replace(new RegExp(`^ {0,${indent}}`), '')
    codeLines.push(stripped)
    i++
  }

  return {
    block: {
      type: 'codeBlock',
      language,
      languageMetadata,
      value: codeLines.join('\n'),
    },
    nextIndex: i,
  }
}

const parseIndentedCodeBlock = (lines, startIndex) => {
  const first = lines[startIndex]
  if (!first || (!first.startsWith('    ') && !first.startsWith('\t'))) return null

  const codeLines = []
  let i = startIndex
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      let peek = i + 1
      while (peek < lines.length && !lines[peek].trim()) peek++
      if (peek < lines.length && (lines[peek].startsWith('    ') || lines[peek].startsWith('\t'))) {
        codeLines.push('')
        i++
        continue
      }
      break
    }
    if (line.startsWith('    ')) {
      codeLines.push(line.slice(4))
      i++
    } else if (line.startsWith('\t')) {
      codeLines.push(line.slice(1))
      i++
    } else {
      break
    }
  }

  return {
    block: {
      type: 'codeBlock',
      language: null,
      value: codeLines.join('\n'),
    },
    nextIndex: i,
  }
}

module.exports = { parseCodeFenceHeader, parseCodeBlock, parseIndentedCodeBlock }
