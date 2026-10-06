const path = require('node:path')
const { BUILT_IN_TEMPLATES } = require('../templates')
const { normalizeConfig } = require('./config')
const { resolveSlideEntries } = require('./slides')
const { loadCustomTemplates } = require('./templates')

const loadDeck = (inputDir, options = {}) => {
  const dir = path.resolve(inputDir || process.cwd())
  const config = normalizeConfig(dir, options)
  const customTemplates = loadCustomTemplates(dir, config)
  const registry = { ...BUILT_IN_TEMPLATES, ...customTemplates }

  const rawSlides = resolveSlideEntries(dir, config.slides, config, '', {
    config,
    registry,
  })
  const totalSlides = rawSlides.length

  const slides = rawSlides.map((slide, i) => ({
    ...slide,
    index: i,
    id: `slide-${i + 1}`,
    totalSlides,
  }))

  return {
    dir,
    config,
    slides,
    registry,
  }
}

module.exports = { loadDeck }
