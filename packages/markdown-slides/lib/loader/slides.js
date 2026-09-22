const fs = require('node:fs')
const path = require('node:path')
const { parse } = require('@sullux/markdown-compiler')
const { loadFileConfig } = require('./config')

const discoverFiles = (dir) => {
  const entries = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  const nonReadme = entries.filter((f) => f.toLowerCase() !== 'readme.md')
  const list = nonReadme.length > 0 ? nonReadme : entries
  return list.sort().map((f) => ({ file: f }))
}

const resolveSlideFile = (dir, entry, defaultTemplate, section) => {
  const filePath = path.resolve(dir, entry.file)
  const content = fs.readFileSync(filePath, 'utf8')
  const ast = parse(content)
  const frontmatter = ast.frontmatter || {}
  const template = frontmatter.template || entry.template || defaultTemplate

  return {
    name: entry.name || path.basename(entry.file, '.md'),
    file: filePath,
    section: section || entry.section || '',
    ast,
    frontmatter,
    template,
  }
}

const resolveSlideEntries = (dir, entries, deckConfig, section = '') => {
  const items = entries && entries.length > 0 ? entries : discoverFiles(dir)
  const slides = []

  for (const item of items) {
    const entry = typeof item === 'string' ? { file: item } : item

    if (entry.folder) {
      const subDir = path.resolve(dir, entry.folder)
      const subConfig = loadFileConfig(subDir)
      const subTemplate = entry.template || subConfig.template || deckConfig.template
      const subSection = entry.section || entry.name || path.basename(subDir)
      const subSlides = resolveSlideEntries(
        subDir,
        subConfig.slides,
        { ...deckConfig, template: subTemplate },
        subSection,
      )
      slides.push(...subSlides)
    } else if (entry.file) {
      slides.push(
        resolveSlideFile(dir, entry, deckConfig.template, section),
      )
    }
  }

  return slides
}

module.exports = {
  discoverFiles,
  resolveSlideFile,
  resolveSlideEntries,
}
