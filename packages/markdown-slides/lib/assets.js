const fs = require('node:fs')
const path = require('node:path')

const copyAssets = (srcDir, destDir) => {
  const resolvedSrc = path.resolve(srcDir)
  const resolvedDest = path.resolve(destDir)
  if (!fs.existsSync(resolvedSrc)) return

  const copy = (src, dest) => {
    const entries = fs.readdirSync(src, { withFileTypes: true })

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name)

      if (
        entry.name.startsWith('.') ||
        entry.name === 'node_modules' ||
        entry.name === '_slides' ||
        entry.name === '_site' ||
        srcPath === resolvedDest ||
        srcPath.startsWith(resolvedDest + path.sep)
      ) {
        continue
      }

      const destPath = path.join(dest, entry.name)

      if (entry.isDirectory()) {
        copy(srcPath, destPath)
      } else if (
        entry.isFile() &&
        !entry.name.endsWith('.md') &&
        !entry.name.endsWith('.yaml') &&
        !entry.name.endsWith('.yml')
      ) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
        fs.copyFileSync(srcPath, destPath)
      }
    }
  }

  copy(resolvedSrc, resolvedDest)
}

module.exports = { copyAssets }
