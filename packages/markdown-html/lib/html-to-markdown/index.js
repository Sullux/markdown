const { stringify } = require('@sullux/markdown-compiler')
const { parseHtml } = require('./parse-html')
const { toAst } = require('./ast-builder')

const htmlToMarkdown = (htmlString) => {
  if (!htmlString) return ''
  const htmlTree = parseHtml(htmlString)
  const markdownAst = toAst(htmlTree)
  return stringify(markdownAst)
}

module.exports = {
  parseHtml,
  toAst,
  htmlToMarkdown,
  toMarkdown: htmlToMarkdown,
}
