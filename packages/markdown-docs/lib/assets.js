const fs = require('node:fs')
const path = require('node:path')

const copyAssets = (srcDir, destDir) => {
  if (!fs.existsSync(srcDir)) return
  const entries = fs.readdirSync(srcDir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '_site') continue
    const srcPath = path.join(srcDir, entry.name)
    const destPath = path.join(destDir, entry.name)

    if (entry.isDirectory()) {
      copyAssets(srcPath, destPath)
    } else if (entry.isFile() && !entry.name.endsWith('.md')) {
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

module.exports = { copyAssets }
