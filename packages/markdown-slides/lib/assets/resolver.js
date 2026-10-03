const os = require('node:os')
const path = require('node:path')

const normalizeAssetPath = (rawUrl, baseDir) => {
  if (/^https?:\/\//i.test(rawUrl)) {
    try {
      const parsed = new URL(rawUrl)
      const pathname = parsed.pathname.replace(/\/+$/, '')
      return {
        type: 'remote',
        url: rawUrl,
        canonical: `/remote/${parsed.hostname}${pathname}`,
      }
    } catch {
      return { type: 'remote', url: rawUrl, canonical: `/remote/${rawUrl}` }
    }
  }

  const resolved = path.resolve(baseDir, rawUrl).replace(/\\/g, '/')
  const home = os.homedir().replace(/\\/g, '/')
  let canonical = resolved
  if (canonical.startsWith(home)) {
    canonical = '/user' + canonical.slice(home.length)
  }
  canonical = canonical.replace(/^[a-zA-Z]:/, (m) =>
    m[0].toLowerCase() === 'c' ? '' : `/${m[0].toLowerCase()}`,
  )

  return { type: 'local', path: resolved, canonical }
}

const resolveAssetNames = (assets) => {
  // Deduplicate identical canonical paths
  const uniqueMap = new Map()
  for (const asset of assets) {
    if (!uniqueMap.has(asset.canonical)) {
      uniqueMap.set(asset.canonical, asset)
    }
  }

  const items = Array.from(uniqueMap.values()).map((asset) => {
    const parts = asset.canonical.split('/').filter(Boolean)
    const currentName = parts.pop() || 'asset'
    return { asset, currentName, remaining: parts }
  })

  let active = items
  while (active.length > 0) {
    const groups = new Map()
    for (const item of active) {
      const key = item.currentName.toLowerCase()
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(item)
    }

    const nextActive = []
    for (const [, group] of groups) {
      if (group.length > 1) {
        let hasRemaining = false
        for (const item of group) {
          if (item.remaining.length > 0) {
            hasRemaining = true
            item.currentName = `${item.remaining.pop()}-${item.currentName}`
          }
        }
        if (hasRemaining) {
          nextActive.push(...group)
        } else {
          // Terminal fallback: append numeric suffix
          group.forEach((item, idx) => {
            if (idx > 0) {
              const dotIdx = item.currentName.lastIndexOf('.')
              item.currentName =
                dotIdx > 0
                  ? `${item.currentName.slice(0, dotIdx)}-${idx + 1}${item.currentName.slice(dotIdx)}`
                  : `${item.currentName}-${idx + 1}`
            }
          })
        }
      }
    }
    active = nextActive
  }

  const mapping = new Map()
  for (const item of items) {
    mapping.set(item.asset.canonical, item.currentName)
  }
  return mapping
}

module.exports = {
  normalizeAssetPath,
  resolveAssetNames,
}
