const fs = require('node:fs')
const path = require('node:path')
const { parseYaml } = require('../yaml')

const loadFileConfig = (dir, customFile) => {
  const candidates = customFile
    ? [path.resolve(customFile)]
    : [
        path.join(dir, 'slides.yaml'),
        path.join(dir, 'slides.yml'),
        path.join(dir, 'slides.json'),
      ]

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, 'utf8')
        return file.endsWith('.json') ? JSON.parse(content) : parseYaml(content)
      } catch (err) {
        return {}
      }
    }
  }
  return {}
}

const normalizeConfig = (dir, opts = {}) => {
  const fileConfig = loadFileConfig(dir, opts.config)
  return {
    title: opts.title || fileConfig.title || 'Presentation',
    ratio: fileConfig.ratio || opts.ratio || '16:9',
    theme: fileConfig.theme || opts.theme || 'dark',
    template: fileConfig.template || 'Title/Content',
    templates: fileConfig.templates || [],
    slides: fileConfig.slides,
  }
}

module.exports = {
  loadFileConfig,
  normalizeConfig,
}
