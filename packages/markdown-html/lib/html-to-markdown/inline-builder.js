const { parseStyleAttr, decodeHtmlEntities } = require('./utils')

const INLINE_TAGS = new Set([
  'b', 'strong', 'i', 'em', 'code', 'tt', 'span', 'a', 'img', 'br', 'sub', 'sup', 'del', 's', 'strike', 'mark', 'u'
])

const processInlineNode = (node, style, currentInline, traverse) => {
  if (node.type === 'text') {
    let textVal = decodeHtmlEntities(node.value)
    if (!style.isCode) textVal = textVal.replace(/\s+/g, ' ')
    if (textVal === ' ' || textVal === '') {
      if (textVal === ' ' && currentInline.length > 0) {
        const lastToken = currentInline[currentInline.length - 1]
        if (lastToken.type !== 'text' || !lastToken.value.endsWith(' ')) {
          currentInline.push({ type: 'text', value: ' ' })
        }
      }
      return true
    }

    let token = { type: 'text', value: textVal }
    if (style.fontStyle === 'italic') token = { type: 'italic', children: [token] }
    if (style.fontWeight === 'bold') token = { type: 'bold', children: [token] }
    if (style.isCode) token = { type: 'code', value: textVal }

    currentInline.push(token)
    return true
  }

  if (node.type === 'element') {
    const tagName = node.tagName
    const attrs = node.attributes || {}
    const inlineStyles = parseStyleAttr(attrs.style)
    const nextStyle = { ...style }

    if (tagName === 'b' || tagName === 'strong') nextStyle.fontWeight = 'bold'
    if (tagName === 'i' || tagName === 'em') nextStyle.fontStyle = 'italic'
    if (tagName === 'code' || tagName === 'tt') nextStyle.isCode = true
    if (inlineStyles['font-weight'] === 'bold' || parseInt(inlineStyles['font-weight']) >= 700) nextStyle.fontWeight = 'bold'
    if (inlineStyles['font-style'] === 'italic') nextStyle.fontStyle = 'italic'

    if (tagName === 'br') {
      currentInline.push({ type: 'br' })
      return true
    }
    if (tagName === 'img') {
      if (attrs.src) currentInline.push({ type: 'image', url: attrs.src, alt: attrs.alt || '' })
      return true
    }
    if (tagName === 'a') {
      const childTokens = []
      for (const child of node.children) traverse(child, nextStyle, childTokens)
      if (childTokens.length > 0) currentInline.push({ type: 'link', url: attrs.href || '', children: childTokens })
      return true
    }

    if (INLINE_TAGS.has(tagName)) {
      for (const child of node.children) traverse(child, nextStyle, currentInline)
      return true
    }
  }

  return false
}

module.exports = { processInlineNode }
