const parseCodeFenceHeader = (line) => {
  const info = line.trim().replace(/^(```|~~~)/, '').trim()
  if (!info) return { language: null, languageMetadata: undefined }

  const spaceIdx = info.indexOf(' ')
  if (spaceIdx === -1) return { language: info, languageMetadata: undefined }

  const language = info.slice(0, spaceIdx).trim()
  const languageMetadata = info.slice(spaceIdx + 1).trim()
  return { language: language || null, languageMetadata: languageMetadata || undefined }
}

const parseCodeBlock = (lines, startIndex) => {
  const first = lines[startIndex].trim()
  if (!first.startsWith('```') && !first.startsWith('~~~')) return null
  const fenceChar = first[0]
  const fenceLen = first.match(/^[`~]+/)[0].length
  const fenceHeader = parseCodeFenceHeader(first)

  const codeLines = []
  let i = startIndex + 1
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim().startsWith(fenceChar.repeat(fenceLen))) {
      i++
      break
    }
    codeLines.push(line)
    i++
  }

  return {
    block: {
      type: 'codeBlock',
      language: fenceHeader.language,
      languageMetadata: fenceHeader.languageMetadata,
      value: codeLines.join('\n'),
    },
    nextIndex: i,
  }
}

module.exports = { parseCodeFenceHeader, parseCodeBlock }
