const TAG_NAME = '[a-zA-Z][a-zA-Z0-9-]*'
const ATTR_NAME = '[a-zA-Z_:][a-zA-Z0-9_.:-]*'
const ATTR_VAL = '(?:[^ \\t\\n\\f"\'=<>`]+|\'[^\']*\'|"[^"]*")'
const ATTRIBUTE = '(?:[ \\t\\n\\f]+' + ATTR_NAME + '(?:[ \\t\\n\\f]*=[ \\t\\n\\f]*' + ATTR_VAL + ')?)'
const OPEN_TAG = '^<' + TAG_NAME + ATTRIBUTE + '*[ \\t\\n\\f]*\\/?>'
const CLOSE_TAG = '^<\\/' + TAG_NAME + '[ \\t\\n\\f]*>'
const COMMENT = '^<!--(?:>|->|[\\s\\S]*?-->)'
const PI = '^<\\?[\\s\\S]*?\\?>'
const DECLARATION = '^<![A-Z]+[\\s\\S]*?>'
const CDATA = '^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>'

const HTML_TAG_RE = new RegExp('(?:' + OPEN_TAG + '|' + CLOSE_TAG + '|' + COMMENT + '|' + PI + '|' + DECLARATION + '|' + CDATA + ')', 'i')

const parseInlineHtml = (text, index) => {
  if (text[index] !== '<') return null
  const match = text.slice(index).match(HTML_TAG_RE)
  if (!match) return null
  return {
    token: { type: 'html', value: match[0] },
    consumedLength: match[0].length,
  }
}

module.exports = { parseInlineHtml }
