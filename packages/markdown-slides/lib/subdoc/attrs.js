const { parseAttributeList } = require('@sullux/markdown-compiler')

const parseAttributes = (raw = '') => {
  const parsed = parseAttributeList(raw)
  return {
    ...parsed.attributes,
    ...(parsed.id ? { id: parsed.id } : {}),
    ...(parsed.classes?.length ? { classes: parsed.classes } : {}),
  }
}

module.exports = { parseAttributes }
