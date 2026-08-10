const path = require('node:path')
const { getCss } = require('./theme')
const { getSearchScript } = require('./search')

const calcRelativeHref = (currentHref, targetHref) => {
  if (!targetHref) return '#'
  const currentDir = path.dirname(currentHref)
  const rel = path.relative(currentDir, targetHref.replace(/\.md$/, '.html'))
  return rel || './'
}

const renderNavTree = (items, currentHref) => {
  if (!items || items.length === 0) return ''
  let html = ''
  let group = []

  const flushGroup = () => {
    if (group.length === 0) return ''
    const list = `<ul class="nav-list">\n` + group.map((item) => {
      const active = item.href === currentHref ? ' active' : ''
      const href = calcRelativeHref(currentHref, item.href)
      const sub = item.children?.length ? renderNavTree(item.children, currentHref) : ''
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

const renderTocList = (toc) => {
  if (!toc || toc.length === 0) return ''
  return `<div class="toc-title">On this page</div>\n<ul class="toc-list">\n` + toc.map((item) => `
    <li class="toc-item level-${item.level}">
      <a href="#${item.id}" class="toc-link">${item.title}</a>
    </li>
  `).join('') + `</ul>\n`
}

const renderPageLayout = ({ title, navTree, toc, contentHtml, currentHref }) => {
  const sidebarNav = renderNavTree(navTree, currentHref)
  const tocHtml = renderTocList(toc)
  const appTitle = title.split(' - ')[1] || title

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title><style>${getCss()}</style>
  <script>
    function toggleTheme() {
      var html = document.documentElement, next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      if (next === 'dark') html.setAttribute('data-theme', 'dark'); else html.removeAttribute('data-theme');
      try { localStorage.setItem('sullux-theme', next); } catch(e) {}
    }
    (function() {
      try {
        var saved = localStorage.getItem('sullux-theme');
        if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      } catch(e) {}
    })();
  </script>
</head>
<body>
  <header class="top-header">
    <a href="${calcRelativeHref(currentHref, 'index.html')}" class="header-brand">📚 ${appTitle}</a>
    <div class="search-box">
      <input type="text" id="doc-search" class="search-input" placeholder="Search docs..." />
      <div id="search-results" class="search-results"></div>
    </div>
  </header>
  <div class="app-container">
    <aside class="app-sidebar"><nav class="app-nav">${sidebarNav}</nav></aside>
    <main class="app-main"><article class="app-article">${contentHtml}</article></main>
    <aside class="app-toc">
      ${tocHtml}
      <div class="theme-picker">
        <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">Theme</button>
      </div>
    </aside>
  </div>
  ${getSearchScript()}
</body>
</html>`
}

module.exports = { renderPageLayout, calcRelativeHref }
