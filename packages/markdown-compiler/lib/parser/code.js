const parseCodeFenceHeader = (line) => {
  const info = line.trim().replace(/^(```|~~~)/, '').trim()
  if (!info) return { language: null, languageMetadata: undefined }

  const spaceIdx = info.indexOf(' ')
  if (spaceIdx === -1) {
    return { language: info, languageMetadata: undefined }
  }

  const language = info.slice(0, spaceIdx).trim()
  const languageMetadata = info.slice(spaceIdx + 1).trim()
  return {
    language: language || null,
    languageMetadata: languageMetadata || undefined,
  }
}

module.exports = { parseCodeFenceHeader }
