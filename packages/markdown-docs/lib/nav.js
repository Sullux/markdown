const path = require('node:path')

const normalizeTargetHref = (href) => {
  if (!href) return '#'
  if (['http://', 'https://', '/', '#', 'mailto:'].some((p) => href.startsWith(p))) return href
  return href
    .replace(/(?:^|\/)README\.(?:md|html)(#.*)?$/i, (match) => match.replace(/README\.(?:md|html)/i, 'index.html'))
    .replace(/\.md(#.*)?$/, (match) => match.replace(/\.md/, '.html'))
}

const calcRelativeHref = (currentHref, targetHref) => {
  if (!targetHref) return '#'
  const normalizedTarget = normalizeTargetHref(targetHref)
  if (['http://', 'https://', '/', '#', 'mailto:'].some((p) => normalizedTarget.startsWith(p))) return normalizedTarget
  const normalizedCurrent = normalizeTargetHref(currentHref)
  const rel = path.relative(path.dirname(normalizedCurrent), normalizedTarget)
  return rel || './'
}

const renderNavTree = (items, currentHref) => {
  if (!items?.length) return ''
  let html = '', group = []
  const flushGroup = () => {
    if (!group.length) return ''
    const list = `<ul class="nav-list">\n` + group.map((item) => {
      const sub = item.children?.length ? renderNavTree(item.children, currentHref) : ''
      if (!item.href) {
        return `<li class="nav-item nav-category"><span class="nav-label">${item.title}</span>${sub ? `<div class="nav-sub">${sub}</div>` : ''}</li>\n`
      }
      const active = normalizeTargetHref(item.href) === normalizeTargetHref(currentHref) ? ' active' : ''
      const href = calcRelativeHref(currentHref, item.href)
      return `<li class="nav-item"><a href="${href}" class="nav-link${active}">${item.title}</a>${sub ? `<div class="nav-sub">${sub}</div>` : ''}</li>\n`
    }).join('') + `</ul>\n`
    group = []
    return list
  }
  for (const item of items) {
    if (item.type === 'section') {
      html += `${flushGroup()}<div class="nav-section-title">${item.title}</div>\n`
      if (item.items?.length) html += renderNavTree(item.items, currentHref)
    } else group.push(item)
  }
  return html + flushGroup()
}

module.exports = { normalizeTargetHref, calcRelativeHref, renderNavTree }
