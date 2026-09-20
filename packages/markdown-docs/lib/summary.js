const fs = require('node:fs')
const path = require('node:path')
const { parse } = require('@sullux/markdown-compiler')

const normalizeHref = (url) => {
  if (!url) return '#'
  if (['http://', 'https://', '/', '#'].some((p) => url.startsWith(p))) return url
  return url
    .replace(/(?:^|\/)README\.md(#.*)?$/i, (match) => match.replace(/README\.md/i, 'index.html'))
    .replace(/\.md(#.*)?$/, (match) => match.replace(/\.md/, '.html'))
}

const parseSummaryMd = (content) => {
  const ast = parse(content)
  const nav = []
  let currentSection = null

  const extractItems = (listNode) => {
    const items = []
    const listChildren = listNode.children || listNode.items || []
    for (const item of listChildren) {
      let linkInfo = null, textTitle = ''
      const subLists = []
      const itemBlocks = item.children || (Array.isArray(item) ? [{ type: 'paragraph', children: item }] : [])

      for (const child of itemBlocks) {
        if (child.type === 'paragraph') {
          for (const node of child.children || []) {
            if (node.type === 'link') {
              const title = (node.children || []).map((c) => c.value || '').join('')
              linkInfo = { title, href: normalizeHref(node.url) }
            } else if (node.type === 'text') textTitle += node.value || ''
          }
          if (!textTitle) textTitle = (child.children || []).map((c) => c.value || '').join('')
        } else if (child.type === 'bulletList' || child.type === 'orderedList') {
          subLists.push(...extractItems(child))
        }
      }

      if (linkInfo) items.push({ ...linkInfo, children: subLists })
      else if (textTitle.trim()) items.push({ title: textTitle.trim(), href: null, children: subLists })
    }
    return items
  }

  for (const block of ast.blocks) {
    if (block.type === 'header' && block.level > 1) {
      const title = (block.children || []).map((c) => c.value || '').join('')
      currentSection = { type: 'section', title, items: [] }
      nav.push(currentSection)
    } else if (block.type === 'bulletList' || block.type === 'orderedList') {
      const listItems = extractItems(block)
      if (currentSection) currentSection.items.push(...listItems)
      else nav.push(...listItems)
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
      const isReadme = /^README\.md$/i.test(entry.name)
      const title = isReadme ? 'Overview' : entry.name.replace(/\.md$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      items.push({ title, href: normalizeHref(relPath), children: [] })
    }
  }

  return items
}

const getNavigationTree = (inputDir) => {
  const summaryPath = path.join(inputDir, 'SUMMARY.md')
  if (fs.existsSync(summaryPath)) return parseSummaryMd(fs.readFileSync(summaryPath, 'utf8'))
  return scanDir(inputDir)
}

module.exports = { normalizeHref, parseSummaryMd, scanDir, getNavigationTree }
