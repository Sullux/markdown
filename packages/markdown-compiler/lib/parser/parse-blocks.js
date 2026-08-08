const { parseCodeFenceHeader } = require('./code')
const { parseSpecialBlocks, parseBlockHeadersAndLists } = require('./block-matchers')
const { mapBlocks } = require('./map-blocks')

const parseBlocks = (text) => {
  const lines = text.split('\n')
  const blocks = []
  let currentBlock = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const special = parseSpecialBlocks(line, currentBlock, blocks)
    if (special.handled) {
      if (special.clearCurrent) currentBlock = null
      else if (special.newCurrent) currentBlock = special.newCurrent
      continue
    }

    if (currentBlock && currentBlock.type === 'codeBlock') {
      if (line.trim().startsWith('```') || line.trim().startsWith('~~~')) {
        blocks.push(currentBlock)
        currentBlock = null
      } else {
        currentBlock.value += (currentBlock.value ? '\n' : '') + line
      }
      continue
    }

    if (line.trim().startsWith('```') || line.trim().startsWith('~~~')) {
      if (currentBlock) blocks.push(currentBlock)
      const fence = parseCodeFenceHeader(line)
      currentBlock = { type: 'codeBlock', language: fence.language, languageMetadata: fence.languageMetadata, value: '' }
      continue
    }

    const trimmed = line.trim()
    if (!trimmed) {
      if (currentBlock) {
        blocks.push(currentBlock)
        currentBlock = null
      }
      continue
    }

    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      if (currentBlock) {
        blocks.push(currentBlock)
        currentBlock = null
      }
      blocks.push({ type: 'hr' })
      continue
    }

    const isTableDivider = /^\s*\|?\s*(:?\-+:?\s*\|?\s*)+$/.test(line) && line.includes('|')
    if (isTableDivider && currentBlock && currentBlock.type === 'paragraph') {
      currentBlock = { type: 'table', headerLine: currentBlock.rawText, dividerLine: line, rows: [] }
      continue
    }

    const matched = parseBlockHeadersAndLists(line, currentBlock, blocks)
    if (matched.handled) {
      if (matched.resetCurrent) {
        blocks.push(matched.block)
        currentBlock = null
      } else {
        currentBlock = matched.block
      }
      continue
    }

    if (!currentBlock) {
      currentBlock = { type: 'paragraph', rawText: line }
    } else if (currentBlock.type === 'paragraph') {
      currentBlock.rawText += '\n' + line
    } else {
      blocks.push(currentBlock)
      currentBlock = { type: 'paragraph', rawText: line }
    }
  }

  if (currentBlock) blocks.push(currentBlock)

  return mapBlocks(blocks, parseBlocks)
}

module.exports = { parseBlocks }
