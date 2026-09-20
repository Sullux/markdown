const TYPE_1_OPEN = /^ {0,3}<(?:script|pre|style|textarea)(?:\s|>|$)/i
const TYPE_1_CLOSE = /<\/(?:script|pre|style|textarea)>/i
const TYPE_2_OPEN = /^ {0,3}<!--/
const TYPE_2_CLOSE = /-->/
const TYPE_3_OPEN = /^ {0,3}<\?/
const TYPE_3_CLOSE = /\?>/
const TYPE_4_OPEN = /^ {0,3}<![A-Z]/
const TYPE_4_CLOSE = />/
const TYPE_5_OPEN = /^ {0,3}<!\[CDATA\[/
const TYPE_5_CLOSE = /\]\]>/
const BLOCK_TAGS = 'address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul'
const TYPE_6_OPEN = new RegExp(`^ {0,3}<\\/?(?:${BLOCK_TAGS})(?:\\s|>|\\/>|$)`, 'i')

const getHtmlBlockMatcher = (firstLine) => {
  if (TYPE_1_OPEN.test(firstLine)) return (l) => TYPE_1_CLOSE.test(l)
  if (TYPE_2_OPEN.test(firstLine)) return (l) => TYPE_2_CLOSE.test(l)
  if (TYPE_3_OPEN.test(firstLine)) return (l) => TYPE_3_CLOSE.test(l)
  if (TYPE_4_OPEN.test(firstLine)) return (l) => TYPE_4_CLOSE.test(l)
  if (TYPE_5_OPEN.test(firstLine)) return (l) => TYPE_5_CLOSE.test(l)
  if (TYPE_6_OPEN.test(firstLine)) return null
  return undefined
}

const parseHtml = (lines, startIndex) => {
  const first = lines[startIndex]
  const closer = getHtmlBlockMatcher(first)
  if (closer === undefined) return null

  const htmlLines = [first]
  let i = startIndex + 1

  if (closer === null) {
    while (i < lines.length && lines[i].trim()) {
      htmlLines.push(lines[i])
      i++
    }
  } else if (!closer(first)) {
    while (i < lines.length) {
      const line = lines[i]
      htmlLines.push(line)
      i++
      if (closer(line)) break
    }
  }

  return {
    block: { type: 'html', value: htmlLines.join('\n') },
    nextIndex: i,
  }
}

module.exports = { parseHtml }
