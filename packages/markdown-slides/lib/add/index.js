const fs = require('node:fs')
const path = require('node:path')
const { getBoilerplate } = require('./templates')
const { promptTemplate, TEMPLATE_NAMES } = require('./prompt')

const resolveTemplateName = (requested) => {
  if (!requested) return undefined
  const matched = TEMPLATE_NAMES.find(
    (n) => n.toLowerCase() === requested.toLowerCase(),
  )
  return matched || requested
}

const updateSlidesYaml = async (yamlPath, filename) => {
  if (!fs.existsSync(yamlPath)) {
    const defaultYaml = `title: "Presentation"\nratio: "16:9"\ntheme: "dark"\n\nslides:\n  - ${filename}\n`
    await fs.promises.writeFile(yamlPath, defaultYaml, 'utf8')
    return true
  }

  const content = await fs.promises.readFile(yamlPath, 'utf8')
  if (content.includes(filename)) return false

  const updated = content.includes('slides:')
    ? `${content.trimEnd()}\n  - ${filename}\n`
    : `${content.trimEnd()}\n\nslides:\n  - ${filename}\n`

  await fs.promises.writeFile(yamlPath, updated, 'utf8')
  return true
}

const addSlide = async (options = {}) => {
  const dir = path.resolve(options.input || process.cwd())
  let filename = options.name || 'new-slide.md'
  if (!filename.endsWith('.md')) filename += '.md'

  const filePath = path.join(dir, filename)
  if (fs.existsSync(filePath)) {
    throw new Error(`Slide file "${filename}" already exists at ${dir}`)
  }

  const template =
    resolveTemplateName(options.template) || (await promptTemplate())
  const content = getBoilerplate(template)

  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true })
  }

  await fs.promises.writeFile(filePath, content, 'utf8')
  const yamlPath = path.join(dir, 'slides.yaml')
  const updatedYaml = await updateSlidesYaml(yamlPath, filename)

  return { dir, filename, filePath, template, updatedYaml }
}

module.exports = {
  addSlide,
}
