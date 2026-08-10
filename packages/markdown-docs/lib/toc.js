const { slugify } = require('@sullux/markdown-html/lib/markdown-to-html/slugify')

const extractToc = (ast) => {
  if (!ast || !ast.blocks) return []
  const usedSlugs = new Set()
  const toc = []

  for (const block of ast.blocks) {
    if (block.type === 'header' && (block.level === 2 || block.level === 3)) {
      const rawText = block.children
        ? block.children.map((c) => (c.type === 'text' ? c.value : '')).join('')
        : ''
      const slug = slugify(rawText, usedSlugs)
      toc.push({ level: block.level, title: rawText, id: slug })
    }
  }

  return toc
}

module.exports = { extractToc }
