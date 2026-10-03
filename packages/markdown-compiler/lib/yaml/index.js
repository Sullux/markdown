const { parseScalar, formatBlockScalar } = require('./scalar')

const setKeyValue = (parent, k, val) => {
  if (Array.isArray(parent)) {
    let last = parent[parent.length - 1]
    if (typeof last !== 'object' || last[k] !== undefined) {
      last = {}
      parent.push(last)
    }
    last[k] = val
  } else {
    parent[k] = val
  }
}

const flushBlockScalar = (bs) => {
  if (bs) setKeyValue(bs.parent, bs.key, formatBlockScalar(bs.lines, bs.mode))
}

const handleListItem = (line, indent, parent, stack) => {
  const rest = line.slice(2).trim()
  const colon = rest.indexOf(':')
  let item = parseScalar(rest)
  if (colon !== -1 && !rest.startsWith('"') && !rest.startsWith("'")) {
    const k = rest.slice(0, colon).trim()
    item = { [k]: parseScalar(rest.slice(colon + 1).trim()) }
  }
  if (Array.isArray(parent)) {
    parent.push(item)
    if (typeof item === 'object') stack.push({ indent: indent + 2, node: item })
  } else if (typeof parent === 'object') {
    const top = stack[stack.length - 1]
    if (top.parent && top.key) {
      top.parent[top.key] = [item]
      top.node = top.parent[top.key]
      if (typeof item === 'object') stack.push({ indent: indent + 2, node: item })
    }
  }
}

const parseYaml = (str) => {
  if (!str) return {}
  const lines = str.split(/\r?\n/)
  const root = {}
  const stack = [{ indent: -1, node: root }]
  let bs = null

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i], indent = raw.search(/\S/), trimmed = raw.trim()

    if (bs) {
      if (indent > bs.indent || (!trimmed && indent === -1)) {
        bs.lines.push(raw)
        continue
      }
      flushBlockScalar(bs)
      bs = null
    }

    if (!trimmed || trimmed.startsWith('#')) continue
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop()
    const parent = stack[stack.length - 1].node

    if (trimmed.startsWith('- ')) {
      handleListItem(trimmed, indent, parent, stack)
      continue
    }

    const colon = trimmed.indexOf(':')
    if (colon === -1) continue
    const k = trimmed.slice(0, colon).trim()
    const rawV = trimmed.slice(colon + 1).trim()

    if (rawV.startsWith('|') || rawV.startsWith('>')) {
      bs = { key: k, indent, mode: rawV, lines: [], parent }
    } else if (!rawV) {
      const child = {}
      if (Array.isArray(parent)) parent.push({ [k]: child })
      else parent[k] = child
      stack.push({ indent, node: child, key: k, parent })
    } else {
      setKeyValue(parent, k, parseScalar(rawV))
    }
  }

  if (bs) flushBlockScalar(bs)
  return root
}

module.exports = { parseYaml }
