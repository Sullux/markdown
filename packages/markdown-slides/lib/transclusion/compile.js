const fs = require('node:fs')
const path = require('node:path')
const { parse } = require('@sullux/markdown-compiler')
const { compileSubDoc } = require('../subdoc/compile')

const compileTranscludedDoc = async (targetPath, deck, subRes) => {
  const raw = await fs.promises.readFile(targetPath, 'utf8')
  const subAst = parse(raw)
  const name = path.basename(targetPath, path.extname(targetPath))
  const res = compileSubDoc(
    subAst.frontmatter?.template,
    subRes.ast,
    subAst.frontmatter || {},
    { classes: ['transcluded-doc', `transcluded-${name}`] },
    deck,
  )

  return {
    subAst,
    replacement: { type: 'html', value: res.html },
    head: [...subRes.head, ...res.head],
  }
}

module.exports = { compileSubDoc: compileTranscludedDoc }
