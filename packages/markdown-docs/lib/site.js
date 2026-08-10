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
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '_site') continue
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath, rootDir))
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'SUMMARY.md') {
      const relPath = path.relative(rootDir, fullPath)
      files.push({ fullPath, relPath })
    }
  }

  return files
}

const ensureIndexHtml = (outputDir, generatedPages) => {
  const indexPath = path.join(outputDir, 'index.html')
  if (fs.existsSync(indexPath)) return

  const readmePath = path.join(outputDir, 'README.html')
  if (fs.existsSync(readmePath)) {
    fs.copyFileSync(readmePath, indexPath)
    return
  }

  if (generatedPages.length > 0) {
    const firstHtmlPath = path.join(outputDir, generatedPages[0].replace(/\.md$/, '.html'))
    if (fs.existsSync(firstHtmlPath)) fs.copyFileSync(firstHtmlPath, indexPath)
  }
}

const generateSite = (options = {}) => {
  const config = normalizeConfig(options)
  if (!fs.existsSync(config.input)) {
    throw new Error(`Input directory does not exist: ${config.input}`)
  }

  fs.mkdirSync(config.output, { recursive: true })
  const navTree = getNavigationTree(config.input)
  const mdFiles = collectMarkdownFiles(config.input)
  const searchIndex = []

  for (const file of mdFiles) {
    const rawMd = fs.readFileSync(file.fullPath, 'utf8')
    const ast = parse(rawMd)
    const toc = extractToc(ast)
    const rawHtml = markdownToHtml(rawMd)
    const contentHtml = rawHtml.replace(/href="([^":#]+)\.md(#.*?)?"/g, 'href="$1.html$2"')

    const relHtmlPath = file.relPath.replace(/\.md$/, '.html')
    const outHtmlPath = path.join(config.output, relHtmlPath)

    fs.mkdirSync(path.dirname(outHtmlPath), { recursive: true })

    const pageTitle = `${file.relPath.replace(/\.md$/, '')} - ${config.title}`
    const fullHtml = renderPageLayout({
      title: pageTitle,
      navTree,
      toc,
      contentHtml,
      currentHref: file.relPath,
    })

    fs.writeFileSync(outHtmlPath, fullHtml, 'utf8')

    const plainText = rawMd.replace(/[#*`_\[\]()\-]/g, ' ').replace(/\s+/g, ' ').trim()
    searchIndex.push({
      title: file.relPath.replace(/\.md$/, ''),
      href: relHtmlPath,
      content: plainText.slice(0, 300),
    })
  }

  ensureIndexHtml(config.output, mdFiles.map((f) => f.relPath))
  fs.writeFileSync(path.join(config.output, 'search-index.json'), JSON.stringify(searchIndex, null, 2))
  copyAssets(config.input, config.output)

  return { output: config.output, pageCount: mdFiles.length }
}

module.exports = { generateSite }
