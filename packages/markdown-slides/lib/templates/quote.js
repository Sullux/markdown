const { renderBlockList, mergeHead } = require('./utils')

const quote = (state, context = {}) => {
  const blocks = state.ast?.blocks || []
  const res = renderBlockList(blocks, context.options)

  return {
    ...state,
    html: `<div class="slide-layout slide-quote">${res.html}</div>`,
    head: mergeHead(state.head, res.head),
  }
}

quote.docs = {
  description: 'Centered statement slide with large callout typography.',
}

module.exports = { quote }
