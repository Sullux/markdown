const fs = require('node:fs')
const path = require('node:path')

const cssTemplate = fs.readFileSync(path.join(__dirname, 'theme.css'), 'utf8')

const getCss = (theme = {}) => {
  const vars = `
:root {
  --theme-light-bg: ${theme.bgLight || theme.light?.bg || '#ffffff'};
  --theme-light-accent: ${theme.accentLight || theme.light?.accent || theme.accent || '#2563eb'};
  --theme-light-code-bg: ${theme.light?.codeBg || '#f8fafc'};
  --theme-light-code-text: ${theme.light?.codeText || '#0f172a'};
  --theme-dark-bg: ${theme.bgDark || theme.dark?.bg || '#121316'};
  --theme-dark-accent: ${theme.accentDark || theme.dark?.accent || theme.accent || '#3b82f6'};
  --theme-dark-code-bg: ${theme.dark?.codeBg || '#0a0b0e'};
  --theme-dark-code-text: ${theme.dark?.codeText || '#f3f4f6'};
}`
  return `${vars}\n${cssTemplate}`
}

module.exports = { getCss }
