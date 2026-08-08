const { VOID_TAGS, parseAttributes } = require('./utils')

const parseHtml = (rawHtml) => {
  let html = (rawHtml || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')

  const root = { type: 'element', tagName: 'root', attributes: {}, children: [] }
  const stack = [root]
  let index = 0

  while (index < html.length) {
    const nextTag = html.indexOf('<', index)

    if (nextTag === -1 || nextTag > index) {
      const textVal = nextTag === -1 ? html.slice(index) : html.slice(index, nextTag)
      if (textVal) {
        stack[stack.length - 1].children.push({ type: 'text', value: textVal })
      }
      if (nextTag === -1) break
    }

    const closeTag = html.indexOf('>', nextTag)
    if (closeTag === -1) break

    const tagContent = html.slice(nextTag + 1, closeTag).trim()
    index = closeTag + 1

    if (tagContent.startsWith('/')) {
      const tagName = tagContent.slice(1).trim().toLowerCase()
      const matchIdx = stack.map(node => node.tagName).lastIndexOf(tagName)
      if (matchIdx > 0) {
        stack.length = matchIdx
      }
      continue
    }

    const isSelfClosing = tagContent.endsWith('/')
    const cleanedContent = isSelfClosing ? tagContent.slice(0, -1).trim() : tagContent

    const nameMatch = cleanedContent.match(/^([a-zA-Z0-9_\-]+)/)
    if (!nameMatch) continue
    const tagName = nameMatch[1].toLowerCase()

    const attrString = cleanedContent.slice(tagName.length).trim()
    const attributes = parseAttributes(attrString)

    const element = { type: 'element', tagName, attributes, children: [] }
    stack[stack.length - 1].children.push(element)

    if (!isSelfClosing && !VOID_TAGS.has(tagName)) {
      stack.push(element)
    }
  }

  return root
}

module.exports = { parseHtml }
