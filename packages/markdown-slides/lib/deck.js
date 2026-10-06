const fs = require('node:fs')
const path = require('node:path')
const { markdownToHtml } = require('@sullux/markdown-html')
const { loadDeck } = require('./loader')
const { runTemplates } = require('./templates')
const { renderShell } = require('./shell')
const { copyAssets, processSlideAssets } = require('./assets')
const { resolveSlideTransclusions } = require('./transclusion')

const parseNotesHtml = (frontmatter = {}) => {
  const notes = frontmatter.notes || frontmatter.note || ''
  const text = Array.isArray(notes) ? notes.join('\n\n') : String(notes)
  return text.trim() ? markdownToHtml(text).html : ''
}

const compileSlide = async (slide, deck) => {
  const context = {
    slideIndex: slide.index,
    totalSlides: slide.totalSlides,
    name: slide.name,
    section: slide.section,
    title: deck.config.title,
    theme: deck.config.theme,
    config: deck.config,
    registry: deck.registry,
  }

  const res = runTemplates(
    slide.template,
    { ast: slide.ast, frontmatter: slide.frontmatter },
    context,
  )

  return {
    ...slide,
    html: res.html,
    head: [...(slide.extraHead || []), ...(res.head || [])],
    notesHtml: parseNotesHtml(slide.frontmatter),
  }
}

const buildDeck = async (options = {}) => {
  const deck = loadDeck(options.input, options)
  const outputDir = path.resolve(
    options.output || path.join(deck.dir, '_slides'),
  )

  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir, { recursive: true })
  }

  // Resolve transcluded sub-documents recursively
  await resolveSlideTransclusions(deck.slides, deck)

  // Collect, disambiguate, download/copy, and rewrite image assets
  await processSlideAssets(deck.slides, outputDir, deck.dir)

  // Compile all slides in parallel
  const compiledSlides = await Promise.all(
    deck.slides.map((s) => compileSlide(s, deck)),
  )
  const allHeads = [...new Set(compiledSlides.flatMap((s) => s.head))]

  const html = renderShell({
    title: deck.config.title,
    ratio: deck.config.ratio,
    theme: deck.config.theme,
    slides: compiledSlides,
    head: allHeads,
  })

  await fs.promises.writeFile(path.join(outputDir, 'index.html'), html, 'utf8')
  await copyAssets(deck.dir, outputDir)

  return {
    input: deck.dir,
    output: outputDir,
    slideCount: compiledSlides.length,
    slides: compiledSlides,
  }
}

module.exports = {
  buildDeck,
  compileSlide,
}
