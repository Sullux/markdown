const resolveTemplate = (entry, registry = {}) => {
  if (typeof entry === 'function') return entry
  if (typeof entry === 'string') {
    const template = registry[entry] || registry[entry.toLowerCase()]
    if (template) return template
    throw new Error(`Unknown slide template: "${entry}"`)
  }
  throw new Error(`Invalid template specification: ${JSON.stringify(entry)}`)
}

const buildTemplateChain = (initial, frontmatter = {}, context = {}) => {
  const registry = context.registry || {}
  const config = context.config || {}
  const stack = Array.isArray(initial) ? [...initial] : [initial]

  const rootLayout = config.layout || config.base || 'Main'
  const isSuppressed =
    frontmatter.Main === 'none' ||
    frontmatter.Main === false ||
    frontmatter.layout === 'none' ||
    frontmatter.layout === false ||
    frontmatter.base === 'none'

  let current = stack[stack.length - 1]
  const visited = new Set(stack.map((s) => (typeof s === 'string' ? s.toLowerCase() : '')))

  while (current) {
    const fn = resolveTemplate(current, registry)
    const nextBase =
      fn.base !== undefined ? fn.base : isSuppressed ? 'none' : rootLayout

    if (!nextBase || nextBase === 'none') break
    const lower = nextBase.toLowerCase()
    if (visited.has(lower)) break
    visited.add(lower)

    if (lower === 'main' && isSuppressed) break

    if (registry[nextBase] || registry[lower]) {
      stack.push(nextBase)
      current = nextBase
    } else {
      break
    }
  }

  return stack
}

const runTemplates = (templates, initialState, context = {}) => {
  const chain = buildTemplateChain(
    templates,
    initialState.frontmatter || {},
    context,
  )
  return chain.reduce(
    (state, t) => {
      const fn = resolveTemplate(t, context.registry)
      return fn(state, context)
    },
    { html: '', head: [], ...initialState },
  )
}

module.exports = {
  resolveTemplate,
  buildTemplateChain,
  runTemplates,
}
