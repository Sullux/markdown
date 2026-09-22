const { splitBlocksByHr, renderBlockList, mergeHead } = require('./utils')

const headerColumnsFooter = (state, context = {}) => {
  const blocks = state.ast?.blocks || []
  const partitions = splitBlocksByHr(blocks)
  const count = partitions.length

  if (count <= 1) {
    const res = renderBlockList(blocks, context.options)
    return {
      ...state,
      html: `<div class="slide-layout slide-header-columns-footer"><div class="slide-body">${res.html}</div></div>`,
      head: mergeHead(state.head, res.head),
    }
  }

  if (count === 2) {
    const headRes = renderBlockList(partitions[0], context.options)
    const bodyRes = renderBlockList(partitions[1], context.options)
    return {
      ...state,
      html: `<div class="slide-layout slide-header-columns-footer"><header class="slide-header">${headRes.html}</header><div class="slide-body">${bodyRes.html}</div></div>`,
      head: mergeHead(state.head, headRes.head, bodyRes.head),
    }
  }

  const headRes = renderBlockList(partitions[0], context.options)
  const footRes = renderBlockList(partitions[count - 1], context.options)
  const colPartitions = partitions.slice(1, count - 1)

  const colResults = colPartitions.map((col) =>
    renderBlockList(col, context.options),
  )

  const colsHtml = colResults
    .map((res) => `<div class="slide-col">${res.html}</div>`)
    .join('')

  const allHeads = colResults.map((r) => r.head)

  return {
    ...state,
    html: `<div class="slide-layout slide-header-columns-footer"><header class="slide-header">${headRes.html}</header><div class="slide-columns">${colsHtml}</div><footer class="slide-footer">${footRes.html}</footer></div>`,
    head: mergeHead(state.head, headRes.head, footRes.head, ...allHeads),
  }
}

headerColumnsFooter.docs = {
  description:
    'Splits content by horizontal rules into header, N columns, and footer.',
}

module.exports = { headerColumnsFooter }
