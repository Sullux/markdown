const getCss = () => `
:root {
  --bg-primary: #ffffff;
  --bg-sidebar: #f7f9fa;
  --text-primary: #1c1e21;
  --text-muted: #5c6975;
  --border-color: #e8ecf0;
  --accent-color: #3b82f6;
  --accent-hover: #1d4ed8;
  --code-bg: #f3f4f6;
  --callout-info-bg: #eff6ff;
  --callout-info-border: #3b82f6;
}

[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-sidebar: #1e293b;
  --text-primary: #f8fafc;
  --text-muted: #94a3b8;
  --border-color: #334155;
  --accent-color: #60a5fa;
  --accent-hover: #93c5fd;
  --code-bg: #1e293b;
  --callout-info-bg: #1e3a8a;
  --callout-info-border: #60a5fa;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: var(--text-primary); background: var(--bg-primary); line-height: 1.6; display: flex; min-height: 100vh; }

.app-sidebar { width: 280px; background: var(--bg-sidebar); border-right: 1px solid var(--border-color); padding: 1.5rem; display: flex; flex-direction: column; shrink: 0; }
.app-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); text-decoration: none; display: flex; align-items: center; gap: 0.5rem; }
.search-box { margin-bottom: 1rem; position: relative; }
.search-input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-primary); color: var(--text-primary); }
.search-results { position: absolute; top: 100%; left: 0; right: 0; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; max-height: 250px; overflow-y: auto; z-index: 100; display: none; }
.search-item { padding: 0.5rem; text-decoration: none; color: var(--text-primary); display: block; border-bottom: 1px solid var(--border-color); }
.search-item:hover { background: var(--code-bg); }

.nav-list { list-style: none; }
.nav-item { margin-bottom: 0.25rem; }
.nav-link { display: block; padding: 0.4rem 0.6rem; color: var(--text-muted); text-decoration: none; border-radius: 4px; font-size: 0.95rem; }
.nav-link:hover, .nav-link.active { color: var(--accent-color); font-weight: 600; background: var(--code-bg); }
.nav-sub { list-style: none; padding-left: 1rem; margin-top: 0.25rem; }

.app-main { flex: 1; display: flex; flex-direction: column; overflow-x: hidden; }
.app-header { padding: 1rem 2rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
.app-content { flex: 1; padding: 2rem 3rem; max-width: 900px; }
.theme-toggle { cursor: pointer; background: none; border: 1px solid var(--border-color); padding: 0.4rem 0.8rem; border-radius: 6px; color: var(--text-primary); }

pre { background: var(--code-bg); padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1rem 0; font-family: monospace; }
code { background: var(--code-bg); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9em; }
pre code { background: none; padding: 0; }

.callout { border-left: 4px solid var(--callout-info-border); background: var(--callout-info-bg); padding: 1rem; margin: 1rem 0; border-radius: 0 6px 6px 0; }
.callout-title { font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em; }

table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
th, td { border: 1px solid var(--border-color); padding: 0.6rem 0.8rem; text-align: left; }
th { background: var(--code-bg); }

.hl-kw { color: #d73a49; font-weight: bold; }
.hl-str { color: #032f62; }
.hl-num { color: #005cc5; }
.hl-cmt { color: #6a737d; font-style: italic; }
.hl-id { color: #6f42c1; }
.hl-punc { color: #24292e; }

@media (max-width: 768px) {
  body { flex-direction: column; }
  .app-sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--border-color); }
  .app-content { padding: 1.5rem; }
}
`

module.exports = { getCss }
