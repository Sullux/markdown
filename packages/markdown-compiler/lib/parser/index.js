const { parseFrontmatter } = require('./frontmatter')
const { parseInline } = require('./inline')
const { parseBlocks } = require('./parse-blocks')

const parse = (text, options = {}) => {
  if (text.startsWith('---\n') || text.startsWith('---\r\n')) {
    const startOffset = text.startsWith('---\r\n') ? 5 : 4
    const endMatch = text.slice(startOffset).match(/\r?\n---\s*(\r?\n|$)/)
    if (endMatch) {
      const endIdx = startOffset + endMatch.index
      const yamlContent = text.slice(startOffset, endIdx)
      const frontmatter = parseFrontmatter(yamlContent)
      if (
        frontmatter &&
        typeof frontmatter === 'object' &&
        Object.keys(frontmatter).length > 0
      ) {
        const bodyText = text.slice(endIdx + endMatch[0].length)
        const blocks = parseBlocks(bodyText, options)
        return { frontmatter, blocks }
      }
    }
  }

  return { frontmatter: {}, blocks: parseBlocks(text, options) }
}

module.exports = { parse, parseBlocks, parseInline, parseFrontmatter }
