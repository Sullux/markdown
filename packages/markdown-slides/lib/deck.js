const fs = require('node:fs')
const path = require('node:path')
const { loadDeck } = require('./loader')
const { runTemplates } = require('./templates')
const { renderShell } = require('./shell')
const { copyAssets } = require('./assets')

const compileSlide = (slide, deck) => {
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
    { ast: slide.ast },
    context,
  )

  return {
    ...slide,
    html: res.html,
    head: res.head || [],
  }
}

const buildDeck = (options = {}) => {
  const deck = loadDeck(options.input, options)
  const outputDir = path.resolve(
    options.output || path.join(deck.dir, '_slides'),
  )

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const compiledSlides = deck.slides.map((s) => compileSlide(s, deck))
  const allHeads = [...new Set(compiledSlides.flatMap((s) => s.head))]

  const html = renderShell({
    title: deck.config.title,
    ratio: deck.config.ratio,
    theme: deck.config.theme,
    slides: compiledSlides,
    head: allHeads,
  })

  fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf8')
  copyAssets(deck.dir, outputDir)

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
