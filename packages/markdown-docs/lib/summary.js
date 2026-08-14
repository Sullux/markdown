const fs = require('node:fs')
const path = require('node:path')
const { parse } = require('@sullux/markdown-compiler')

const parseSummaryMd = (content) => {
  const ast = parse(content)
  const nav = []
  let currentSection = null

  for (const block of ast.blocks) {
    if (block.type === 'header' && block.level > 1) {
      const sectionTitle = block.children ? block.children.map((c) => c.value || '').join('') : ''
      currentSection = { type: 'section', title: sectionTitle, items: [] }
      nav.push(currentSection)
    } else if (block.type === 'bulletList' || block.type === 'orderedList') {
      const listItems = []
      for (const itemNodes of block.items || []) {
        for (const node of itemNodes) {
          if (node.type === 'link') {
            const title = node.children ? node.children.map((c) => c.value || '').join('') : ''
            listItems.push({ title, href: node.url, children: [] })
          }
        }
      }
      if (currentSection) {
        currentSection.items.push(...listItems)
      } else {
        nav.push(...listItems)
      }
    }
  }

  return nav
}

const scanDir = (dir, rootDir = dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const items = []

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '_site') continue
    const fullPath = path.join(dir, entry.name)
    const relPath = path.relative(rootDir, fullPath)

    if (entry.isDirectory()) {
      const children = scanDir(fullPath, rootDir)
      if (children.length > 0) {
        const title = entry.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        items.push({ type: 'section', title, items: children })
      }
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'SUMMARY.md') {
      const title = entry.name.replace(/\.md$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      items.push({ title, href: relPath, children: [] })
    }
  }

  return items
}

const getNavigationTree = (inputDir) => {
  const summaryPath = path.join(inputDir, 'SUMMARY.md')
  if (fs.existsSync(summaryPath)) {
    return parseSummaryMd(fs.readFileSync(summaryPath, 'utf8'))
  }
  return scanDir(inputDir)
}

module.exports = { parseSummaryMd, scanDir, getNavigationTree }
