const { markdownToHtml } = require('@sullux/markdown-html')

const splitBlocksByHr = (blocks = []) =>
  blocks.reduce(
    (acc, block) =>
      block.type === 'hr'
        ? [...acc, []]
        : [...acc.slice(0, -1), [...acc[acc.length - 1], block]],
    [[]],
  )

const renderBlockList = (blocks = [], options = {}) =>
  markdownToHtml({ blocks }, options)

const mergeHead = (...heads) => [
  ...new Set(heads.flat().filter(Boolean)),
]

module.exports = {
  splitBlocksByHr,
  renderBlockList,
  mergeHead,
}
