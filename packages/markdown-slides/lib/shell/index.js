const fs = require('node:fs')
const path = require('node:path')
const { getClientScript } = require('./client')

const THEME_CSS = fs.readFileSync(path.join(__dirname, 'theme.css'), 'utf8')

const renderSlideSection = (slide, index) =>
  `        <section id="${slide.id}" class="slide${index === 0 ? ' active' : ''}" data-index="${index}">\n${slide.html}\n        </section>`

const renderShell = ({ title, ratio, theme, slides = [], head = [] }) => {
  const slidesHtml = slides.map((s, i) => renderSlideSection(s, i)).join('\n')
  const total = slides.length
  const headHtml = head.length ? head.join('\n') + '\n' : ''

  return `<!DOCTYPE html>
<html lang="en" data-theme="${theme || 'dark'}" data-ratio="${ratio || '16:9'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title || 'Presentation'}</title>
  <style>\n${THEME_CSS}\n</style>
${headHtml}</head>
<body>
  <div class="deck-viewport">
    <div class="deck-canvas">
      <div class="slides">
${slidesHtml}
      </div>
      <div class="deck-progress" style="width: ${total > 0 ? (1 / total) * 100 : 0}%;"></div>
    </div>
    <nav class="deck-controls" aria-label="Presentation controls">
      <button class="control-btn btn-prev" aria-label="Previous slide" title="Previous (Left / PageUp)">‹</button>
      <span class="slide-counter">1 / ${total}</span>
      <button class="control-btn btn-next" aria-label="Next slide" title="Next (Right / Space / PageDown)">›</button>
      <button class="control-btn btn-fullscreen" aria-label="Fullscreen" title="Fullscreen (F)">⛶</button>
    </nav>
  </div>
  <script>
${getClientScript()}
  </script>
</body>
</html>`
}

module.exports = {
  renderShell,
  getClientScript,
  THEME_CSS,
}
