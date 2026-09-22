const { splitBlocksByHr, renderBlockList, mergeHead } = require('./utils')

const split = (state, context = {}) => {
  const blocks = state.ast?.blocks || []
  const partitions = splitBlocksByHr(blocks)

  const colResults = partitions.map((col) =>
    renderBlockList(col, context.options),
  )

  const colsHtml = colResults
    .map((res) => `<div class="slide-col">${res.html}</div>`)
    .join('')

  const allHeads = colResults.map((r) => r.head)

  return {
    ...state,
    html: `<div class="slide-layout slide-split"><div class="slide-columns">${colsHtml}</div></div>`,
    head: mergeHead(state.head, ...allHeads),
  }
}

split.docs = {
  description: 'Side-by-side columns partitioned by horizontal rules without header/footer.',
}

module.exports = { split }
