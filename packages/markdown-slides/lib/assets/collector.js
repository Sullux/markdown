const fs = require('node:fs')
const path = require('node:path')
const { normalizeAssetPath, resolveAssetNames } = require('./resolver')
const { findAssets, rewriteAsset } = require('./discover')

const fetchRemoteAsset = async (url, destPath) => {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buffer = Buffer.from(await res.arrayBuffer())
    await fs.promises.writeFile(destPath, buffer)
    return true
  } catch (err) {
    console.warn(`Warning: Failed to fetch remote asset ${url}: ${err.message}`)
    return false
  }
}

const copyLocalAsset = async (srcPath, destPath) => {
  try {
    if (!fs.existsSync(srcPath)) {
      console.warn(`Warning: Local asset not found: ${srcPath}`)
      return false
    }
    await fs.promises.copyFile(srcPath, destPath)
    return true
  } catch (err) {
    console.warn(`Warning: Failed to copy local asset ${srcPath}: ${err.message}`)
    return false
  }
}

const collectAstEntries = (slides = [], deckDir, registry = {}) => {
  const entries = slides.map((slide) => ({
    baseDir: slide.file ? path.dirname(slide.file) : deckDir,
    ast: slide.ast,
  }))
  for (const t of Object.values(registry)) {
    if (t?.ast) {
      entries.push({ baseDir: t.dir || deckDir, ast: t.ast })
    }
  }
  return entries
}

const processSlideAssets = async (slides, outputDir, deckDir, registry = {}) => {
  const imagesDir = path.join(outputDir, 'images')
  if (!fs.existsSync(imagesDir)) {
    await fs.promises.mkdir(imagesDir, { recursive: true })
  }

  const entries = collectAstEntries(slides, deckDir, registry)
  const entryItems = entries.map(({ baseDir, ast }) => ({
    items: findAssets(ast).map((item) => ({
      ...item,
      asset: normalizeAssetPath(item.url, baseDir),
    })),
  }))

  const allAssets = entryItems.flatMap((e) => e.items.map((i) => i.asset))
  const mapping = resolveAssetNames(allAssets)

  const uniqueAssets = new Map()
  for (const asset of allAssets) {
    if (!uniqueAssets.has(asset.canonical)) uniqueAssets.set(asset.canonical, asset)
  }

  const successMap = new Map()
  await Promise.all(
    Array.from(uniqueAssets.values()).map(async (asset) => {
      const filename = mapping.get(asset.canonical)
      const destPath = path.join(imagesDir, filename)
      const ok =
        asset.type === 'remote'
          ? await fetchRemoteAsset(asset.url, destPath)
          : await copyLocalAsset(asset.path, destPath)
      successMap.set(asset.canonical, ok)
    }),
  )

  for (const { items } of entryItems) {
    for (const item of items) {
      if (successMap.get(item.asset.canonical)) {
        rewriteAsset(item, `images/${mapping.get(item.asset.canonical)}`)
      }
    }
  }
}

const findImageNodes = (node, acc = []) =>
  findAssets(node).filter((a) => a.type === 'image').map((a) => a.node)

module.exports = {
  findImageNodes,
  processSlideAssets,
}
