const fs = require('node:fs')
const path = require('node:path')
const { parse } = require('@sullux/markdown-compiler')
const { markdownToHtml } = require('@sullux/markdown-html')
const { normalizeConfig } = require('./config')
const { getNavigationTree } = require('./summary')
const { extractToc } = require('./toc')
const { renderPageLayout } = require('./layout')
const { copyAssets } = require('./assets')

const collectMarkdownFiles = (dir, rootDir = dir) => {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '_site') continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...collectMarkdownFiles(fullPath, rootDir))
    else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'SUMMARY.md') {
      files.push({ fullPath, relPath: path.relative(rootDir, fullPath) })
    }
  }
  return files
}

const extractFirstH1 = (ast) => {
  for (const block of ast.blocks || []) {
    if (block.type === 'header' && block.level === 1) {
      return block.children ? block.children.map((c) => c.value || '').join('') : ''
    }
  }
  return ''
}

const normalizeHtmlPath = (relPath) => {
  return relPath
    .replace(/(?:^|\/)README\.md$/i, (match) => match.replace(/README\.md$/i, 'index.html'))
    .replace(/\.md$/, '.html')
}

const rewriteMarkdownLinks = (html) => {
  return html
    .replace(/href="([^":#]*?)README\.md(#.*?)?"/gi, 'href="$1index.html$2"')
    .replace(/href="([^":#]+)\.md(#.*?)?"/g, 'href="$1.html$2"')
}

const generateSite = (options = {}) => {
  const config = normalizeConfig(options)
  if (!fs.existsSync(config.input)) throw new Error(`Input directory does not exist: ${config.input}`)

  fs.mkdirSync(config.output, { recursive: true })
  const navTree = getNavigationTree(config.input), mdFiles = collectMarkdownFiles(config.input), searchIndex = []

  for (const file of mdFiles) {
    const rawMd = fs.readFileSync(file.fullPath, 'utf8')
    const ast = parse(rawMd)
    const toc = extractToc(ast)
    const rawHtml = markdownToHtml(rawMd)
    const contentHtml = rewriteMarkdownLinks(rawHtml)
    const relHtmlPath = normalizeHtmlPath(file.relPath)
    const outHtmlPath = path.join(config.output, relHtmlPath)

    fs.mkdirSync(path.dirname(outHtmlPath), { recursive: true })

    const h1Title = extractFirstH1(ast)
    const fallbackTitle = file.relPath.replace(/(?:^|\/)README\.md$/i, '').replace(/\.md$/, '') || config.title || 'Home'
    const docTitle = h1Title || fallbackTitle
    const pageTitle = config.title && docTitle !== config.title ? `${docTitle} - ${config.title}` : (docTitle || config.title)

    const fullHtml = renderPageLayout({
      title: pageTitle,
      siteTitle: config.title,
      navTree,
      toc,
      contentHtml,
      currentHref: relHtmlPath,
      logo: config.logo,
      favicon: config.favicon,
      links: config.links,
      theme: config.theme,
    })

    fs.writeFileSync(outHtmlPath, fullHtml, 'utf8')
    const plainText = rawMd.replace(/[#*`_\[\]()\-]/g, ' ').replace(/\s+/g, ' ').trim()
    searchIndex.push({ title: docTitle, href: relHtmlPath, content: plainText.slice(0, 300) })
  }

  fs.writeFileSync(path.join(config.output, 'search-index.json'), JSON.stringify(searchIndex, null, 2))
  copyAssets(config.input, config.output)

  return { output: config.output, pageCount: mdFiles.length }
}

module.exports = { generateSite }
