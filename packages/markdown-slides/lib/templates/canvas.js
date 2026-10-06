const { markdownToHtml } = require('@sullux/markdown-html')

const parseCoord = (val) => {
  if (typeof val === 'number') return `${val}px`
  if (typeof val === 'string') return /^\d+$/.test(val) ? `${val}px` : val
  return '0%'
}

const buildPositionStyle = (spec) => {
  if (!spec) return ''
  let x = '50%', y = '50%', align = 'center'
  if (Array.isArray(spec)) {
    x = parseCoord(spec[0])
    y = parseCoord(spec[1])
    if (spec[2]) align = spec[2]
  } else if (typeof spec === 'object') {
    if (spec.at) {
      x = parseCoord(spec.at[0])
      y = parseCoord(spec.at[1])
    } else {
      if (spec.x !== undefined) x = parseCoord(spec.x)
      if (spec.y !== undefined) y = parseCoord(spec.y)
    }
    if (spec.align) align = spec.align
  } else if (typeof spec === 'string') {
    const parts = spec.split(',').map((s) => s.trim())
    x = parseCoord(parts[0])
    y = parseCoord(parts[1] || parts[0])
  }

  const transform =
    align === 'center' ? 'translate(-50%, -50%)' :
    align === 'top-left' ? 'none' :
    align === 'bottom-right' ? 'translate(-100%, -100%)' : 'translate(-50%, -50%)'

  return `position: absolute; left: ${x}; top: ${y}; transform: ${transform};`
}

const Canvas = (state = {}, context = {}) => {
  const fm = state.frontmatter || {}
  const layout = fm.layout || {}
  const rendered = markdownToHtml(state.ast)
  let html = rendered.html

  // Apply layout coordinates to elements by id
  for (const [id, spec] of Object.entries(layout)) {
    const posStyle = buildPositionStyle(spec)
    const regex = new RegExp(`(<(?:img|div|p|span)[^>]*\\bid=["']${id}["'][^>]*)style=["']([^"']*)["']`, 'gi')
    if (regex.test(html)) {
      html = html.replace(regex, `$1style="${posStyle} $2"`)
    } else {
      const tagRegex = new RegExp(`(<(?:img|div|p|span)[^>]*\\bid=["']${id}["'][^>]*)>`, 'gi')
      html = html.replace(tagRegex, `$1 style="${posStyle}">`)
    }
  }

  const height = fm.height ? (typeof fm.height === 'number' ? `${fm.height}px` : fm.height) : '100%'
  const width = fm.width ? (typeof fm.width === 'number' ? `${fm.width}px` : fm.width) : '100%'

  const wrapped = `<div class="slide-layout slide-canvas" style="position: relative; width: ${width}; height: ${height}; overflow: hidden;">
${html}
</div>`

  return {
    ...state,
    html: wrapped,
    head: [...(state.head || []), ...(rendered.head || [])],
  }
}

module.exports = { Canvas }
