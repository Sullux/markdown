const path = require('node:path')
const { getCss } = require('./theme')
const { getSearchScript } = require('./search')
const { SVGS } = require('./icons')

const calcRelativeHref = (currentHref, targetHref) => targetHref ? (path.relative(path.dirname(currentHref), targetHref.replace(/\.md$/, '.html')) || './') : '#'

const renderNavTree = (items, currentHref) => {
  if (!items?.length) return ''
  let html = '', group = []
  const flushGroup = () => {
    if (!group.length) return ''
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

const renderTocList = (toc) => toc?.length ? `<div class="toc-title">On this page</div>\n<ul class="toc-list">\n` + toc.map((i) => `<li class="toc-item level-${i.level}"><a href="#${i.id}" class="toc-link" onclick="closeAllDrawers()">${i.title}</a></li>`).join('') + `</ul>\n` : ''

const resolveAssetHref = (currentHref, assetPath) => (!assetPath || assetPath.startsWith('http') || assetPath.startsWith('<svg') || assetPath.startsWith('data:') || assetPath.startsWith('/')) ? assetPath : calcRelativeHref(currentHref, assetPath.replace(/^\.\//, ''))

const renderSingleLogo = (logo, modeClass, title, currentHref) => logo ? (typeof logo === 'string' && logo.startsWith('<svg') ? logo : `<img src="${resolveAssetHref(currentHref, logo)}" alt="${title || 'Logo'}" class="${modeClass ? `brand-logo ${modeClass}` : 'brand-logo'}" />`) : ''

const renderBrandLogo = (logo, title, currentHref) => {
  const titleSpan = title ? `<span>${title}</span>` : ''
  if (!logo) return title ? `📚 ${title}` : '📚'
  if (typeof logo === 'string') return `${renderSingleLogo(logo, '', title, currentHref)}${titleSpan}`
  if (typeof logo === 'object') return `${renderSingleLogo(logo.light, 'logo-light', title, currentHref)}${renderSingleLogo(logo.dark, 'logo-dark', title, currentHref)}${titleSpan}`
  return title ? `📚 ${title}` : '📚'
}

const renderFavicon = (f) => f ? `<link rel="icon" href="${f}" />` : `<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>">`

const renderHeaderLinks = (links = []) => links?.length ? `<div class="header-links">` + links.map((l) => `<a href="${l.url}" target="_blank" rel="noopener" class="header-link">${l.title} ↗</a>`).join('') + `</div>` : ''

const renderPageLayout = ({ title, siteTitle, navTree, toc, contentHtml, currentHref, logo, favicon, links, theme }) => {
  const sidebarNav = renderNavTree(navTree, currentHref)
  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>${renderFavicon(favicon)}<style>${getCss(theme)}</style>
  <script>
    function setThemeMode(m) {
      try { localStorage.setItem('sullux-theme-mode', m); } catch(e) {}
      if (m === 'light' || m === 'dark') document.documentElement.setAttribute('data-theme', m); else document.documentElement.removeAttribute('data-theme');
      document.querySelectorAll('.theme-opt').forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-mode') === m); });
    }
    function toggleDrawer(id) {
      var d = document.getElementById(id), b = document.getElementById('drawer-backdrop'), open = d?.classList.contains('open');
      closeAllDrawers(); if (!open && d && b) { d.classList.add('open'); b.classList.add('open'); }
    }
    function closeAllDrawers() { document.querySelectorAll('.app-sidebar, .app-toc, .drawer-backdrop').forEach(function(e) { e.classList.remove('open'); }); }
    (function() {
      var m = 'system'; try { m = localStorage.getItem('sullux-theme-mode') || 'system'; } catch(e) {}
      if (m === 'light' || m === 'dark') document.documentElement.setAttribute('data-theme', m);
    })();
    window.addEventListener('DOMContentLoaded', function() { setThemeMode(localStorage.getItem('sullux-theme-mode') || 'system'); });
  </script>
</head><body>
  <header class="top-header">
    <div class="header-left"><button class="header-btn hamburger-btn" onclick="toggleDrawer('sidebar-drawer')" aria-label="Toggle navigation">${SVGS.hamburger}</button><a href="${calcRelativeHref(currentHref, 'index.html')}" class="header-brand">${renderBrandLogo(logo, siteTitle, currentHref)}</a></div>
    <div class="header-center"><div class="search-box"><input type="text" id="doc-search" class="search-input" placeholder="Search docs..." /><div id="search-results" class="search-results"></div></div></div>
    <div class="header-right">${renderHeaderLinks(links)}<button class="header-btn page-index-btn" onclick="toggleDrawer('toc-drawer')" aria-label="Toggle page outline">${SVGS.pageIndex}</button></div>
  </header>
  <div class="app-container">
    <aside id="sidebar-drawer" class="app-sidebar"><div class="drawer-header"><span class="drawer-title">Navigation</span><button class="drawer-close" onclick="closeAllDrawers()">${SVGS.close}</button></div><nav class="app-nav">${sidebarNav}</nav></aside>
    <main class="app-main"><article class="app-article">${contentHtml}</article></main>
    <aside id="toc-drawer" class="app-toc">
      <div class="drawer-header"><span class="drawer-title">Page Outline</span><button class="drawer-close" onclick="closeAllDrawers()">${SVGS.close}</button></div>
      ${renderTocList(toc)}
      <div class="theme-picker">
        <button class="theme-opt" data-mode="light" onclick="setThemeMode('light')" title="Light">${SVGS.sun}</button>
        <button class="theme-opt" data-mode="system" onclick="setThemeMode('system')" title="System">${SVGS.system}</button>
        <button class="theme-opt" data-mode="dark" onclick="setThemeMode('dark')" title="Dark">${SVGS.moon}</button>
      </div>
    </aside>
  </div>
  <div id="drawer-backdrop" class="drawer-backdrop" onclick="closeAllDrawers()"></div>
  ${getSearchScript()}
</body></html>`
}

module.exports = { renderPageLayout, calcRelativeHref }
