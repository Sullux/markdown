const { renderBlockList, mergeHead } = require('./utils')

const cover = (state, context = {}) => {
  const blocks = state.ast?.blocks || []
  let titleBlock
  let subtitleBlock
  const metaBlocks = []

  for (const block of blocks) {
    if (!titleBlock && block.type === 'header' && block.level === 1) {
      titleBlock = block
    } else if (!subtitleBlock && block.type === 'header' && block.level === 2) {
      subtitleBlock = block
    } else {
      metaBlocks.push(block)
    }
  }

  const titleRes = titleBlock
    ? renderBlockList([titleBlock], context.options)
    : { html: '', head: [] }
  const subRes = subtitleBlock
    ? renderBlockList([subtitleBlock], context.options)
    : { html: '', head: [] }
  const metaRes = renderBlockList(metaBlocks, context.options)

  const titleHtml = titleRes.html
    ? `<div class="cover-title">${titleRes.html}</div>`
    : ''
  const subHtml = subRes.html
    ? `<div class="cover-subtitle">${subRes.html}</div>`
    : ''
  const metaHtml = metaRes.html
    ? `<div class="cover-meta">${metaRes.html}</div>`
    : ''

  return {
    ...state,
    html: `<div class="slide-layout slide-cover">${titleHtml}${subHtml}${metaHtml}</div>`,
    head: mergeHead(state.head, titleRes.head, subRes.head, metaRes.head),
  }
}

cover.docs = {
  description: 'Centered presentation opening splash with title, subtitle, and metadata.',
}

module.exports = { cover }
