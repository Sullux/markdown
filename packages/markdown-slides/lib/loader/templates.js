const fs = require('node:fs')
const path = require('node:path')
const { createMarkdownTemplate } = require('../templates/markdown')

const loadTemplateFile = (absPath, defaultName = '') => {
  if (/\.md(arkdown)?$/i.test(absPath)) {
    const raw = fs.readFileSync(absPath, 'utf8')
    const t = createMarkdownTemplate(raw, defaultName)
    t.dir = path.dirname(absPath)
    const name = t.templateName || defaultName || path.basename(absPath, path.extname(absPath))
    return { [name]: t, [name.toLowerCase()]: t }
  }
  const mod = require(absPath)
  return typeof mod === 'function' ? { [defaultName || mod.name]: mod } : mod
}

const discoverMainTemplate = (dir) => {
  const candidates = [
    path.join(dir, 'Main.md'),
    path.join(dir, 'templates', 'Main.md'),
    path.join(dir, 'main.md'),
    path.join(dir, 'templates', 'main.md'),
    path.join(dir, 'Main.js'),
    path.join(dir, 'templates', 'Main.js'),
  ]
  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }
  return null
}

const loadCustomTemplates = (dir, config = {}) => {
  const custom = {}
  const templateConfig = config.templates

  if (Array.isArray(templateConfig)) {
    for (const rel of templateConfig) {
      const abs = path.resolve(dir, rel)
      Object.assign(custom, loadTemplateFile(abs))
    }
  } else if (templateConfig && typeof templateConfig === 'object') {
    for (const [name, rel] of Object.entries(templateConfig)) {
      const abs = path.resolve(dir, rel)
      Object.assign(custom, loadTemplateFile(abs, name))
    }
  }

  // Support top-level `Main: path.md` or `layout: path.md`
  const mainPath = config.Main || (config.layout && /\.md|\.js/i.test(config.layout) ? config.layout : null)
  if (mainPath && typeof mainPath === 'string') {
    const abs = path.resolve(dir, mainPath)
    Object.assign(custom, loadTemplateFile(abs, 'Main'))
  }

  // Auto-discover Main.md if not explicitly configured
  if (!custom.Main && !custom.main) {
    const autoMain = discoverMainTemplate(dir)
    if (autoMain) {
      Object.assign(custom, loadTemplateFile(autoMain, 'Main'))
    }
  }

  return custom
}

module.exports = {
  loadTemplateFile,
  loadCustomTemplates,
  discoverMainTemplate,
}
