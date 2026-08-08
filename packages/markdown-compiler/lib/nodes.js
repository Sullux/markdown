const text = (value) => ({ type: 'text', value })
const bold = (children) => ({ type: 'bold', children })
const italic = (children) => ({ type: 'italic', children })
const strikethrough = (children) => ({ type: 'strikethrough', children })
const code = (value) => ({ type: 'code', value })
const codeBlock = (language, value) => ({ type: 'codeBlock', language, value })
const link = (url, children) => ({ type: 'link', url, children })
const wikilink = (target, display) => ({ type: 'wikilink', target, display: display || target })
const image = (url, alt) => ({ type: 'image', url, alt })
const checkbox = (checked) => ({ type: 'checkbox', checked })
const paragraph = (children) => ({ type: 'paragraph', children })
const header = (level, children) => ({ type: 'header', level, children })
const blockquote = (children) => ({ type: 'blockquote', children })
const callout = (style, title, children) => ({ type: 'callout', style, title, children })
const bulletList = (items) => ({ type: 'bulletList', items })
const orderedList = (items) => ({ type: 'orderedList', items })
const table = (alignments, rows) => ({ type: 'table', alignments, rows })
const hr = () => ({ type: 'hr' })
const br = () => ({ type: 'br' })

module.exports = {
  text,
  bold,
  italic,
  strikethrough,
  code,
  codeBlock,
  link,
  wikilink,
  image,
  checkbox,
  paragraph,
  header,
  blockquote,
  callout,
  bulletList,
  orderedList,
  table,
  hr,
  br,
}
