const { highlightJs } = require('./js')
const { highlightJson } = require('./json')
const { highlightYaml } = require('./yaml')
const { highlightBash } = require('./bash')
const { highlightHtml } = require('./html')
const { highlightSql } = require('./sql')
const { escapeHtml } = require('../escape')

const DEFAULT_TOKENIZERS = {
  js: highlightJs,
  javascript: highlightJs,
  json: highlightJson,
  yaml: highlightYaml,
  yml: highlightYaml,
  bash: highlightBash,
  sh: highlightBash,
  zsh: highlightBash,
  html: highlightHtml,
  xml: highlightHtml,
  sql: highlightSql,
}

const highlightCode = (code, lang, customTokenizers) => {
  const tokenizers = { ...DEFAULT_TOKENIZERS, ...customTokenizers }
  const normalizedLang = (lang || '').toLowerCase()
  const tokenizer = tokenizers[normalizedLang]
  if (tokenizer) {
    return tokenizer(code)
  }
  return escapeHtml(code)
}

module.exports = { DEFAULT_TOKENIZERS, highlightCode }
