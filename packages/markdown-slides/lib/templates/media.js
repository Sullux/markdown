const { renderBlockList, mergeHead } = require('./utils')

const media = (state, context = {}) => {
  const blocks = state.ast?.blocks || []
  const res = renderBlockList(blocks, context.options)

  return {
    ...state,
    html: `<div class="slide-layout slide-media">${res.html}</div>`,
    head: mergeHead(state.head, res.head),
  }
}

media.docs = {
  description: 'Unpadded full-bleed slide canvas for images, diagrams, or code demos.',
}

module.exports = { media }
