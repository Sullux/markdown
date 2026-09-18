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
  const orderedMatch = !bulletMatch ? line.match(/^(\s*)(\d+)\.\s+(.*)$/) : null

  if (bulletMatch || orderedMatch) {
    const isBullet = Boolean(bulletMatch)
    const match = bulletMatch || orderedMatch
    const indent = match[1].length
    const item = isBullet
      ? { indent, text: match[3], listType: 'bullet', marker: match[2] }
      : { indent, text: match[3], listType: 'ordered', order: parseInt(match[2], 10) }

    const isListBlock = currentBlock && (currentBlock.type === 'bulletList' || currentBlock.type === 'orderedList')
    const matchesTopLevel = currentBlock && (
      (currentBlock.type === 'bulletList' && isBullet) ||
      (currentBlock.type === 'orderedList' && !isBullet)
    )

    if (isListBlock && (indent > 0 || matchesTopLevel)) {
      currentBlock.items.push(item)
      return { block: currentBlock, handled: true, isAccumulating: true }
    }

    if (currentBlock) blocks.push(currentBlock)
    const newBlock = { type: isBullet ? 'bulletList' : 'orderedList', items: [item] }
    return { block: newBlock, handled: true, isAccumulating: true }
  }

  return { handled: false }
}

module.exports = { parseSpecialBlocks, parseBlockHeadersAndLists }
