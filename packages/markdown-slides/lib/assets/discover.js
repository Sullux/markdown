const HTML_IMG_REGEX = /<img\b[^>]*?\bsrc=["']([^"']+)["']/gi
const CSS_URL_REGEX = /url\(\s*["']?([^"')]+)["']?\s*\)/gi

const findAssets = (node, acc = []) => {
  if (!node) return acc
  if (node.type === 'image' && node.url) {
    acc.push({ type: 'image', node, url: node.url })
  } else if (node.type === 'html' && node.value) {
    for (const m of node.value.matchAll(HTML_IMG_REGEX)) {
      acc.push({ type: 'html', node, url: m[1] })
    }
  } else if (node.type === 'codeBlock' && (node.language === 'css' || node.languageMetadata === 'template')) {
    for (const m of (node.value || '').matchAll(CSS_URL_REGEX)) {
      acc.push({ type: 'css', node, url: m[1] })
    }
  }

  const list = Array.isArray(node.children)
    ? node.children
    : Array.isArray(node.blocks)
      ? node.blocks
      : []
  for (const child of list) findAssets(child, acc)
  return acc
}

const rewriteAsset = (item, newUrl) => {
  if (item.type === 'image') {
    item.node.url = newUrl
  } else if (item.type === 'html') {
    const escaped = item.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    item.node.value = item.node.value.replace(
      new RegExp(`(src=["'])${escaped}(["'])`, 'g'),
      `$1${newUrl}$2`,
    )
  } else if (item.type === 'css') {
    const escaped = item.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    item.node.value = item.node.value.replace(
      new RegExp(`(url\\(\\s*["']?)${escaped}(["']?\\s*\\))`, 'g'),
      `$1${newUrl}$2`,
    )
  }
}

module.exports = {
  findAssets,
  rewriteAsset,
}
