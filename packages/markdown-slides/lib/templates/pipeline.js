const resolveTemplate = (entry, registry = {}) => {
  if (typeof entry === 'function') return entry
  if (typeof entry === 'string') {
    const template = registry[entry] || registry[entry.toLowerCase()]
    if (template) return template
    throw new Error(`Unknown slide template: "${entry}"`)
  }
  throw new Error(`Invalid template specification: ${JSON.stringify(entry)}`)
}

const runTemplates = (templates, initialState, context = {}) => {
  const stack = Array.isArray(templates) ? templates : [templates]
  return stack.reduce(
    (state, t) => {
      const fn = resolveTemplate(t, context.registry)
      return fn(state, context)
    },
    { html: '', head: [], ...initialState },
  )
}

module.exports = {
  resolveTemplate,
  runTemplates,
}
