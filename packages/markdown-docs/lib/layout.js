const { getCss } = require('./theme')
const { getSearchScript } = require('./search')

const renderNavItems = (items, currentHref, baseUrl = '') => {
  if (!items || items.length === 0) return ''
  return `<ul class="nav-list">\n` + items.map((item) => {
    const isActive = item.href === currentHref ? ' active' : ''
    const itemHref = item.href ? `${baseUrl}${item.href.replace(/\.md$/, '.html')}` : '#'
    const subNav = item.children ? renderNavItems(item.children, currentHref, baseUrl) : ''
    return `<li class="nav-item">
      <a href="${itemHref}" class="nav-link${isActive}">${item.title}</a>
      ${subNav}
    </li>\n`
  }).join('') + `</ul>\n`
}

const renderPageLayout = ({ title, navTree, contentHtml, currentHref, baseUrl = '' }) => {
  const sidebarNav = renderNavItems(navTree, currentHref, baseUrl)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>${getCss()}</style>
</head>
<body>
  <aside class="app-sidebar">
    <a href="${baseUrl}index.html" class="app-title">${title}</a>
    <div class="search-box">
      <input type="text" id="doc-search" class="search-input" placeholder="Search docs..." />
      <div id="search-results" class="search-results"></div>
    </div>
    <nav class="app-nav">
      ${sidebarNav}
    </nav>
  </aside>
  <main class="app-main">
    <header class="app-header">
      <span class="header-title">${title}</span>
      <button class="theme-toggle" onclick="document.body.toggleAttribute('data-theme', document.body.hasAttribute('data-theme') ? '' : 'dark')">Theme</button>
    </header>
    <article class="app-content">
      ${contentHtml}
    </article>
  </main>
  ${getSearchScript()}
</body>
</html>`
}

module.exports = { renderPageLayout }
