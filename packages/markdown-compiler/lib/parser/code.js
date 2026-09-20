const { unescapeBackslashes } = require('./unescape')
const { decodeEntities } = require('./entities')
const { detabLine } = require('./tab')

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
  const rawLang = spaceIdx === -1 ? rawInfo : rawInfo.slice(0, spaceIdx).trim()
  const lang = decodeEntities(unescapeBackslashes(rawLang))
  const meta = spaceIdx === -1 ? undefined : (rawInfo.slice(spaceIdx + 1).trim() || undefined)
  return { fenceLen: fence.length, fenceChar: fence[0], indent, language: lang || null, languageMetadata: meta }
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
  const first = detabLine(lines[startIndex])
  if (!first || !first.startsWith('    ')) return null

  const codeLines = []
  let i = startIndex
  while (i < lines.length) {
    const rawLine = lines[i]
    if (!rawLine.trim()) {
      let peek = i + 1
      while (peek < lines.length && !lines[peek].trim()) peek++
      if (peek < lines.length && detabLine(lines[peek]).startsWith('    ')) {
        const detabbed = detabLine(rawLine)
        codeLines.push(detabbed.startsWith('    ') ? detabbed.slice(4) : '')
        i++
        continue
      }
      break
    }
    const detabbed = detabLine(rawLine)
    if (detabbed.startsWith('    ')) {
      codeLines.push(detabbed.slice(4))
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
