const fs = require('node:fs')
const path = require('node:path')
const { parse } = require('@sullux/markdown-compiler')

const parseSummaryMd = (content) => {
  const ast = parse(content)
  const items = []

  for (const block of ast.blocks) {
    if (block.type === 'bulletList' || block.type === 'orderedList') {
      for (const itemNodes of block.items || []) {
        for (const node of itemNodes) {
          if (node.type === 'link') {
            const title = node.children ? node.children.map((c) => c.value || '').join('') : ''
            items.push({ title, href: node.url, children: [] })
          }
        }
      }
    }
  }

  return items
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
        items.push({ title: entry.name, href: '', children })
      }
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'SUMMARY.md') {
      const title = entry.name.replace(/\.md$/, '')
      items.push({ title, href: relPath, children: [] })
    }
  }

  return items
}

const getNavigationTree = (inputDir) => {
  const summaryPath = path.join(inputDir, 'SUMMARY.md')
  if (fs.existsSync(summaryPath)) {
    const content = fs.readFileSync(summaryPath, 'utf8')
    return parseSummaryMd(content)
  }
  return scanDir(inputDir)
}

module.exports = { parseSummaryMd, scanDir, getNavigationTree }
