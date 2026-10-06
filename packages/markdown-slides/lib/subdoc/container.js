const { parse } = require('@sullux/markdown-compiler')
const { parseAttributes } = require('./attrs')
const { compileSubDoc } = require('./compile')

const processContainer = (entry, deck) => {
  const rawBody = entry.lines.join('\n')
  const parsed = parse(rawBody)
  const frontmatter = { ...(parsed.frontmatter || {}), ...(entry.frontmatter || {}) }
  const template = entry.template || frontmatter.template
  const res = compileSubDoc(template, parsed, frontmatter, entry.attrs, deck)
  return { html: res.html, head: res.head, ast: parsed }
}

const resolveContainers = (markdownText, deck = {}) => {
  const lines = markdownText.split(/\r?\n/)
  const output = []
  const heads = []
  const stack = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const openMatch = line.match(/^(:{3,})\s*([a-zA-Z0-9_\-\/]+)?(?:\s+(.*))?$/)

    if (openMatch && (!stack.length || openMatch[1].length > stack[stack.length - 1].fence.length)) {
      stack.push({
        fence: openMatch[1],
        template: openMatch[2] || '',
        attrs: parseAttributes(openMatch[3] || ''),
        lines: [],
      })
      continue
    }

    if (stack.length) {
      const top = stack[stack.length - 1]
      const closeMatch = line.match(/^(:{3,})\s*$/)
      if (closeMatch && closeMatch[1].length >= top.fence.length) {
        const finished = stack.pop()
        const res = processContainer(finished, deck)
        heads.push(...res.head)
        if (stack.length) {
          stack[stack.length - 1].lines.push(res.html)
        } else {
          output.push(res.html)
        }
        continue
      }
      top.lines.push(line)
      continue
    }

    output.push(line)
  }

  // If unclosed, flush remaining lines
  while (stack.length) {
    const unclosed = stack.pop()
    output.push(`${unclosed.fence} ${unclosed.template}`, ...unclosed.lines)
  }

  return { text: output.join('\n'), head: heads }
}

module.exports = { resolveContainers }
