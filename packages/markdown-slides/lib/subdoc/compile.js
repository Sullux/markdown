const { runTemplates } = require('../templates')

const compileSubDoc = (template, ast, frontmatter, attrs = {}, deck = {}) => {
  const templateName = template || frontmatter.template || 'Title/Content'
  const context = {
    title: deck.config?.title,
    theme: deck.config?.theme,
    config: deck.config,
    registry: deck.registry,
    isSubDocument: true,
  }

  const rendered = runTemplates(
    templateName,
    { ast, frontmatter },
    context,
  )

  const idAttr = attrs.id ? ` id="${attrs.id}"` : ''
  const classList = [
    'subdoc-container',
    `subdoc-${templateName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    ...(attrs.classes || []),
  ].join(' ')

  const styleParts = []
  if (attrs.height) styleParts.push(`height: ${attrs.height}`)
  if (attrs.width) styleParts.push(`width: ${attrs.width}`)
  const styleAttr = styleParts.length ? ` style="${styleParts.join('; ')}"` : ''

  const wrappedHtml = `<div class="${classList}"${idAttr}${styleAttr}>
${rendered.html}
</div>`

  return {
    html: wrappedHtml,
    head: rendered.head || [],
    ast,
  }
}

module.exports = { compileSubDoc }
