const parseSpecialBlocks = (line, currentBlock, blocks) => {
  if (currentBlock && currentBlock.type === 'table') {
    if (line.includes('|')) {
      currentBlock.rows.push(line)
      return { handled: true }
    } else {
      blocks.push(currentBlock)
      return { handled: true, clearCurrent: true }
    }
  }

  if (currentBlock && currentBlock.type === 'hintBlock') {
    if (line.trim().startsWith('{% endhint %}')) {
      blocks.push(currentBlock)
      return { handled: true, clearCurrent: true }
    } else {
      currentBlock.lines.push(line)
      return { handled: true }
    }
  }

  if (line.trim().startsWith('{% hint')) {
    if (currentBlock) blocks.push(currentBlock)
    const styleMatch = line.match(/style="([^"]+)"/)
    return {
      handled: true,
      newCurrent: { type: 'hintBlock', style: styleMatch ? styleMatch[1].toLowerCase() : 'info', lines: [] },
    }
  }

  return { handled: false }
}

const parseBlockHeadersAndLists = (line, currentBlock, blocks) => {
  const headerMatch = line.match(/^(#{1,6})\s+(.*)$/)
  if (headerMatch) {
    if (currentBlock) blocks.push(currentBlock)
    return {
      block: { type: 'header', level: headerMatch[1].length, rawText: headerMatch[2] },
      handled: true,
      resetCurrent: true,
    }
  }

  if (line.startsWith('>') || line.startsWith('> ')) {
    if (currentBlock && currentBlock.type !== 'blockquote') {
      blocks.push(currentBlock)
      currentBlock = null
    }
    const quoteContent = line.replace(/^>\s?/, '')
    if (!currentBlock) currentBlock = { type: 'blockquote', lines: [quoteContent] }
    else currentBlock.lines.push(quoteContent)
    return { block: currentBlock, handled: true, isAccumulating: true }
  }

  const bulletMatch = line.match(/^(\s*)([\*\-+])\s+(.*)$/)
  if (bulletMatch) {
    if (currentBlock && currentBlock.type !== 'bulletList') {
      if (currentBlock) blocks.push(currentBlock)
      currentBlock = null
    }
    if (!currentBlock) currentBlock = { type: 'bulletList', items: [bulletMatch[3]] }
    else currentBlock.items.push(bulletMatch[3])
    return { block: currentBlock, handled: true, isAccumulating: true }
  }

  const orderedMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/)
  if (orderedMatch) {
    if (currentBlock && currentBlock.type !== 'orderedList') {
      if (currentBlock) blocks.push(currentBlock)
      currentBlock = null
    }
    if (!currentBlock) currentBlock = { type: 'orderedList', items: [orderedMatch[3]] }
    else currentBlock.items.push(orderedMatch[3])
    return { block: currentBlock, handled: true, isAccumulating: true }
  }

  return { handled: false }
}

module.exports = { parseSpecialBlocks, parseBlockHeadersAndLists }
