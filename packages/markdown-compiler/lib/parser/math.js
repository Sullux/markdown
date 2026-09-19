const parseMathBlock = (line, currentBlock, blocks) => {
  if (currentBlock && currentBlock.type === 'mathBlock') {
    const trimmed = line.trim()
    if (trimmed.endsWith('$$')) {
      const content = line.slice(0, line.lastIndexOf('$$')).trim()
      if (content) currentBlock.value += (currentBlock.value ? '\n' : '') + content
      blocks.push(currentBlock)
      return { handled: true, clearCurrent: true }
    }
    currentBlock.value += (currentBlock.value ? '\n' : '') + line
    return { handled: true }
  }

  const trimmed = line.trim()
  if (trimmed.startsWith('$$')) {
    if (currentBlock) blocks.push(currentBlock)
    const afterOpen = trimmed.slice(2)
    if (afterOpen.endsWith('$$') && afterOpen.length >= 2) {
      const content = afterOpen.slice(0, -2).trim()
      blocks.push({ type: 'mathBlock', value: content })
      return { handled: true, clearCurrent: true }
    }
    const initialContent = afterOpen.trim()
    return { handled: true, newCurrent: { type: 'mathBlock', value: initialContent } }
  }

  return { handled: false }
}

module.exports = { parseMathBlock }
