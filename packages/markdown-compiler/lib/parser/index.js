const { parseFrontmatter } = require('./frontmatter')
const { parseInline } = require('./inline')
const { parseBlocks } = require('./parse-blocks')

const parse = (text) => {
  if (text.startsWith('---\n')) {
    const endIdx = text.indexOf('\n---\n', 4)
    if (endIdx !== -1) {
      const yamlContent = text.slice(4, endIdx).split('\n')
      const hasInvalidLines = yamlContent.some((l) => l.trim() && !l.trim().startsWith('#') && !/^([a-zA-Z0-9_\-]+)\s*:\s*(.*)$/.test(l))
      const frontmatter = hasInvalidLines ? {} : parseFrontmatter(yamlContent)
      if (!hasInvalidLines && Object.keys(frontmatter).length > 0) {
        const bodyText = text.slice(endIdx + 5)
        const blocks = parseBlocks(bodyText)
        return { frontmatter, blocks }
      }
    }
  }

  return { frontmatter: {}, blocks: parseBlocks(text) }
}

module.exports = { parse, parseBlocks, parseInline, parseFrontmatter }
