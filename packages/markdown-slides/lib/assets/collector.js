const fs = require('node:fs')
const path = require('node:path')
const { normalizeAssetPath, resolveAssetNames } = require('./resolver')

const findImageNodes = (node, acc = []) => {
  if (!node) return acc
  if (node.type === 'image' && node.url) acc.push(node)
  const list = Array.isArray(node.children)
    ? node.children
    : Array.isArray(node.blocks)
      ? node.blocks
      : []
  for (const child of list) findImageNodes(child, acc)
  return acc
}

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

const processSlideAssets = async (slides, outputDir, deckDir) => {
  const imagesDir = path.join(outputDir, 'images')
  if (!fs.existsSync(imagesDir)) {
    await fs.promises.mkdir(imagesDir, { recursive: true })
  }

  const slideEntries = slides.map((slide) => {
    const baseDir = slide.file ? path.dirname(slide.file) : deckDir
    const nodes = findImageNodes(slide.ast)
    const items = nodes.map((node) => ({
      node,
      asset: normalizeAssetPath(node.url, baseDir),
    }))
    return { slide, items }
  })

  const allAssets = slideEntries.flatMap((se) => se.items.map((i) => i.asset))
  const mapping = resolveAssetNames(allAssets)

  // Map each unique canonical asset to its download/copy action
  const uniqueAssets = new Map()
  for (const asset of allAssets) {
    if (!uniqueAssets.has(asset.canonical)) {
      uniqueAssets.set(asset.canonical, asset)
    }
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

  // Rewrite image node URLs in ASTs
  for (const { items } of slideEntries) {
    for (const { node, asset } of items) {
      if (successMap.get(asset.canonical)) {
        node.url = `images/${mapping.get(asset.canonical)}`
      }
    }
  }
}

module.exports = {
  findImageNodes,
  processSlideAssets,
}
