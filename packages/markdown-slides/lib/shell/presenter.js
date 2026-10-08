const PRESENTER_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; }
  body { background: #121316; color: #f0f4f8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
  .p-shell { display: grid; grid-template-columns: 1fr 1fr; height: 100vh; gap: 1rem; padding: 1rem; }
  .p-col { display: flex; flex-direction: column; gap: 1rem; height: 100%; min-height: 0; }
  .p-box { background: #1a1c23; border: 1px solid #2d3139; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; position: relative; }
  .p-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #8a99a8; padding: 0.5rem 0.75rem; background: #22252e; border-bottom: 1px solid #2d3139; display: flex; justify-content: space-between; align-items: center; }
  .p-frame { flex: 1; min-height: 0; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #000; padding: 0.5rem; }
  .p-frame-content { width: 100%; height: 100%; transform-origin: top left; pointer-events: none; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
  .p-bar { display: flex; gap: 1rem; background: #1a1c23; border: 1px solid #2d3139; border-radius: 8px; padding: 0.75rem 1rem; align-items: center; justify-content: space-between; }
  .p-metric { display: flex; flex-direction: column; }
  .p-metric-val { font-size: 1.5rem; font-family: monospace; font-weight: 700; color: #38bdf8; }
  .p-metric-lbl { font-size: 0.65rem; text-transform: uppercase; color: #8a99a8; font-weight: 700; }
  .p-notes-box { flex: 1; min-height: 0; }
  .p-notes-body { flex: 1; overflow-y: auto; padding: 1.5rem; font-size: 1.25rem; line-height: 1.6; color: #e2e8f0; }
  .p-notes-body h1, .p-notes-body h2, .p-notes-body h3 { margin-bottom: 0.5rem; color: #fff; font-size: 1.4rem; }
  .p-notes-body p, .p-notes-body ul, .p-notes-body ol { margin-bottom: 1rem; }
  .p-notes-body li { margin-left: 1.5rem; margin-bottom: 0.5rem; }
  .p-empty { color: #64748b; font-style: italic; }
  .btn-reset { background: #2d3139; color: #94a3b8; border: none; border-radius: 4px; padding: 0.2rem 0.5rem; font-size: 0.75rem; cursor: pointer; }
  .btn-reset:hover { background: #38bdf8; color: #000; }
`

const getPresenterHtml = (title, themeCss) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Presenter View — ${title || 'Presentation'}</title>
  <style>${themeCss}\n${PRESENTER_CSS}</style>
</head>
<body>
  <div class="p-shell">
    <div class="p-col">
      <div class="p-box" style="flex: 1.2;">
        <div class="p-label"><span>Current Slide</span><span id="p-curr-num">1</span></div>
        <div class="p-frame"><div id="p-curr-content" class="p-frame-content"></div></div>
      </div>
      <div class="p-box" style="flex: 0.8;">
        <div class="p-label"><span>Up Next</span><span id="p-next-num">2</span></div>
        <div class="p-frame"><div id="p-next-content" class="p-frame-content"></div></div>
      </div>
    </div>
    <div class="p-col">
      <div class="p-bar">
        <div class="p-metric"><span class="p-metric-lbl">Elapsed</span><div style="display:flex;gap:0.5rem;align-items:center;"><span id="p-elapsed" class="p-metric-val">00:00:00</span><button id="p-btn-reset" class="btn-reset">Reset</button></div></div>
        <div class="p-metric"><span class="p-metric-lbl">Clock</span><span id="p-clock" class="p-metric-val">00:00</span></div>
        <div class="p-metric"><span class="p-metric-lbl">Slide</span><span id="p-count" class="p-metric-val">1 / 1</span></div>
      </div>
      <div class="p-box p-notes-box">
        <div class="p-label"><span>Speaker Notes</span></div>
        <div id="p-notes" class="p-notes-body"><p class="p-empty">No notes for this slide.</p></div>
      </div>
    </div>
  </div>
</body>
</html>`

module.exports = {
  PRESENTER_CSS,
  getPresenterHtml,
}
