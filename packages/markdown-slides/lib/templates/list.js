const { titleContent } = require('./title-content')
const { headerColumnsFooter } = require('./header-columns-footer')
const { cover } = require('./cover')
const { split } = require('./split')
const { media } = require('./media')
const { quote } = require('./quote')

const BUILT_INS = {
  'Title/Content': titleContent,
  'Header/Columns/Footer': headerColumnsFooter,
  Cover: cover,
  Split: split,
  Media: media,
  Quote: quote,
}

const getTemplateInfo = (fn) =>
  fn?.docs?.description || 'Custom slide template.'

const listTemplates = (inputDir, customRegistry = {}) => {
  const builtIns = Object.entries(BUILT_INS).map(([name, fn]) => ({
    name,
    description: getTemplateInfo(fn),
  }))

  const builtInFns = new Set(Object.values(BUILT_INS))
  const custom = Object.entries(customRegistry)
    .filter(([, fn]) => !builtInFns.has(fn))
    .map(([name, fn]) => ({
      name,
      description: getTemplateInfo(fn),
    }))

  return { builtIns, custom }
}

const formatTemplateList = (inputDir, customRegistry = {}) => {
  const { builtIns, custom } = listTemplates(inputDir, customRegistry)
  const lines = ['Available Slide Templates:\n', 'Built-in Templates:']

  for (const t of builtIns) {
    lines.push(`  ${t.name.padEnd(24)} ${t.description}`)
  }

  if (custom.length > 0) {
    const loc = inputDir ? ` (from ${inputDir})` : ''
    lines.push(`\nCustom Templates${loc}:`)
    for (const t of custom) {
      lines.push(`  ${t.name.padEnd(24)} ${t.description}`)
    }
  }

  return lines.join('\n')
}

module.exports = {
  listTemplates,
  formatTemplateList,
}
