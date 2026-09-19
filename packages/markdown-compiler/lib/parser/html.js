const parseHtmlBlock = (line, currentBlock, blocks) => {
  if (currentBlock && currentBlock.type === 'html') {
    currentBlock.value += '\n' + line
    if (line.includes(`</${currentBlock.tag}>`) || (currentBlock.tag === '!--' && line.includes('-->'))) {
      blocks.push(currentBlock)
      return { handled: true, clearCurrent: true }
    }
    return { handled: true }
  }

  const htmlMatch = !currentBlock ? line.match(/^<([a-zA-Z][a-zA-Z0-9]*|!--)(?:\s|>|$)/) : null
  if (htmlMatch) {
    const tag = htmlMatch[1].toLowerCase()
    const isClosed = tag === '!--' ? line.includes('-->') : (line.trim().endsWith('/>') || line.includes(`</${tag}>`))
    if (isClosed) {
      blocks.push({ type: 'html', tag, value: line })
      return { handled: true }
    }
    return { handled: true, newCurrent: { type: 'html', tag, value: line } }
  }

  return { handled: false }
}

module.exports = { parseHtmlBlock }
