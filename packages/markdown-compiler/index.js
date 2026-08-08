const { parse } = require('./lib/parser')
const { stringify } = require('./lib/stringify')
const Node = require('./lib/nodes')

const toMarkdown = (html) => {
  const { htmlToMarkdown } = require('@sullux/markdown-html')
  return htmlToMarkdown(html)
}

module.exports = {
  parse,
  stringify,
  toMarkdown,
  Node,
}
