const fs = require('node:fs')
const path = require('node:path')

const copyAssets = async (srcDir, destDir) => {
  const resolvedSrc = path.resolve(srcDir)
  const resolvedDest = path.resolve(destDir)
  if (!fs.existsSync(resolvedSrc)) return

  const copy = async (src, dest) => {
    const entries = await fs.promises.readdir(src, { withFileTypes: true })

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
        await copy(srcPath, destPath)
      } else if (
        entry.isFile() &&
        !entry.name.endsWith('.md') &&
        !entry.name.endsWith('.yaml') &&
        !entry.name.endsWith('.yml')
      ) {
        if (!fs.existsSync(dest)) {
          await fs.promises.mkdir(dest, { recursive: true })
        }
        await fs.promises.copyFile(srcPath, destPath)
      }
    }
  }

  await copy(resolvedSrc, resolvedDest)
}

module.exports = { copyAssets }
