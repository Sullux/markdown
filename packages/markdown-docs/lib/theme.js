const getCss = () => `
:root {
  --bg-page: #ffffff; --text-primary: #0f172a; --text-muted: #64748b;
  --border-color: #e2e8f0; --accent-color: #2563eb; --accent-hover: #1d4ed8;
  --code-bg: #0f172a; --code-text: #f8fafc; --code-inline-bg: #f1f5f9;
  --code-inline-color: #0f172a; --callout-bg: #eff6ff;
}
[data-theme="dark"] {
  --bg-page: #121316; --text-primary: #f3f4f6; --text-muted: #a1a1aa;
  --border-color: #22242a; --accent-color: #3b82f6; --accent-hover: #60a5fa;
  --code-bg: #0a0b0e; --code-text: #f3f4f6; --code-inline-bg: #1e2028;
  --code-inline-color: #f3f4f6; --callout-bg: #1e3a8a;
}
* { box-sizing: border-box; margin: 0; padding: 0; scrollbar-width: thin; scrollbar-color: var(--border-color) transparent; }
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: var(--text-primary); background: var(--bg-page); line-height: 1.7; min-height: 100vh; }
.top-header { height: 60px; border-bottom: 1px solid var(--border-color); background: var(--bg-page); display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; position: sticky; top: 0; z-index: 100; }
.header-brand { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); text-decoration: none; display: flex; align-items: center; gap: 0.5rem; }
.search-box { position: relative; width: 280px; }
.search-input { width: 100%; padding: 0.45rem 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-page); color: var(--text-primary); font-size: 0.88rem; outline: none; }
.search-input:focus { border-color: var(--accent-color); }
.search-results { position: absolute; top: 100%; left: 0; right: 0; background: var(--bg-page); border: 1px solid var(--border-color); border-radius: 8px; max-height: 280px; overflow-y: auto; z-index: 200; margin-top: 0.4rem; box-shadow: 0 10px 25px rgba(0,0,0,0.15); display: none; }
.search-item { padding: 0.6rem 0.8rem; text-decoration: none; color: var(--text-primary); display: block; border-bottom: 1px solid var(--border-color); font-size: 0.88rem; }
.search-item:hover { color: var(--accent-color); }
.app-container { display: flex; max-width: 1480px; margin: 0 auto; min-height: calc(100vh - 60px); }
.app-sidebar { width: 270px; shrink: 0; border-right: 1px solid var(--border-color); padding: 1.5rem 1rem; position: sticky; top: 60px; height: calc(100vh - 60px); overflow-y: auto; overflow-x: hidden; }
.nav-section-title { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-top: 1.25rem; margin-bottom: 0.4rem; padding-left: 0.5rem; }
.nav-list { list-style: none; }
.nav-item { margin-bottom: 0.2rem; }
.nav-link { display: block; padding: 0.4rem 0.65rem; color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 500; border-left: 2px solid transparent; transition: all 0.15s ease; overflow-wrap: break-word; word-break: break-word; white-space: normal; line-height: 1.35; }
.nav-link:hover { color: var(--text-primary); }
.nav-link.active { color: var(--accent-color); font-weight: 600; border-left-color: var(--accent-color); }
.nav-sub { list-style: none; padding-left: 0.75rem; margin-top: 0.2rem; border-left: 1px solid var(--border-color); margin-left: 0.5rem; }
.app-main { flex: 1; min-width: 0; max-width: 840px; padding: 2.5rem 3.5rem; margin: 0 auto; }
h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 1.5rem; line-height: 1.25; letter-spacing: -0.03em; color: var(--text-primary); }
h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2.25rem; margin-bottom: 1rem; line-height: 1.3; color: var(--text-primary); }
h3 { font-size: 1.2rem; font-weight: 600; margin-top: 1.75rem; margin-bottom: 0.75rem; line-height: 1.4; color: var(--text-primary); }
h4, h5, h6 { font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary); }
p { margin-bottom: 1.25rem; font-size: 1rem; color: var(--text-primary); line-height: 1.7; }
a { color: var(--accent-color); text-decoration: none; font-weight: 500; }
a:hover { text-decoration: underline; color: var(--accent-hover); }
ul, ol { margin-bottom: 1.25rem; padding-left: 1.75rem; }
li { margin-bottom: 0.4rem; line-height: 1.6; }
code { background: var(--code-inline-bg); color: var(--code-inline-color); padding: 0.2rem 0.4rem; border-radius: 5px; font-size: 0.88em; font-family: ui-monospace, monospace; }
pre { background: var(--code-bg); color: var(--code-text); padding: 1.25rem; border-radius: 8px; overflow-x: auto; margin: 1.5rem 0; font-family: ui-monospace, monospace; font-size: 0.9rem; line-height: 1.6; border: 1px solid var(--border-color); }
pre code { background: none; color: inherit; padding: 0; border: none; font-size: inherit; }
table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 1.5rem 0; border-radius: 8px; border: 1px solid var(--border-color); overflow: hidden; }
th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--border-color); font-size: 0.95rem; }
th { background: var(--bg-page); font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
.callout { border-left: 4px solid var(--accent-color); background: var(--callout-bg); padding: 1.25rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.callout-title { font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em; color: var(--accent-color); }
.app-toc { width: 250px; shrink: 0; padding: 1.5rem 1rem; position: sticky; top: 60px; height: calc(100vh - 60px); overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; }
.toc-title { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 0.75rem; }
.toc-list { list-style: none; margin-bottom: 2rem; border-left: 1px solid var(--border-color); }
.toc-item { margin-bottom: 0.25rem; }
.toc-item.level-3 { padding-left: 0.75rem; }
.toc-link { display: block; padding: 0.2rem 0.75rem; color: var(--text-muted); font-size: 0.85rem; text-decoration: none; border-left: 2px solid transparent; margin-left: -1px; transition: all 0.15s ease; overflow-wrap: break-word; word-break: break-word; white-space: normal; line-height: 1.35; }
.toc-link:hover { color: var(--text-primary); border-left-color: var(--text-muted); }
.theme-picker { margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-color); }
.theme-toggle { cursor: pointer; background: var(--bg-page); border: 1px solid var(--border-color); padding: 0.4rem 0.8rem; border-radius: 6px; color: var(--text-primary); font-size: 0.85rem; font-weight: 600; width: 100%; transition: all 0.15s ease; }
.theme-toggle:hover { border-color: var(--text-muted); }
.hl-kw { color: #ff7b72; font-weight: bold; } .hl-str { color: #a5d6ff; } .hl-num { color: #79c0ff; }
.hl-cmt { color: #8b949e; font-style: italic; } .hl-id { color: #d2a8ff; } .hl-punc { color: #c9d1d9; }
@media (max-width: 1024px) { .app-toc { display: none; } }
@media (max-width: 768px) {
  .app-container { flex-direction: column; }
  .app-sidebar { width: 100%; height: auto; position: relative; top: 0; border-right: none; border-bottom: 1px solid var(--border-color); }
  .app-main { padding: 1.5rem 1rem; }
}
`

module.exports = { getCss }
