const parseYaml = (str) => {
  if (!str) return {}
  const lines = str.split(/\r?\n/)
  const root = {}
  const stack = [{ indent: -1, node: root }]

  for (const raw of lines) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue
    const indent = raw.search(/\S/)
    const line = raw.trim()

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop()
    }
    const parent = stack[stack.length - 1].node

    if (line.startsWith('- ')) {
      const rest = line.slice(2).trim()
      const colon = rest.indexOf(':')
      let item = parseVal(rest)
      if (colon !== -1) {
        const k = rest.slice(0, colon).trim()
        const v = parseVal(rest.slice(colon + 1).trim())
        item = { [k]: v }
      }
      if (Array.isArray(parent)) {
        parent.push(item)
        if (typeof item === 'object') stack.push({ indent: indent + 2, node: item })
      } else if (typeof parent === 'object') {
        const top = stack[stack.length - 1]
        if (top.parent && top.key) {
          const arr = [item]
          top.parent[top.key] = arr
          stack[stack.length - 1].node = arr
          if (typeof item === 'object') stack.push({ indent: indent + 2, node: item })
        }
      }
      continue
    }

    const colon = line.indexOf(':')
    if (colon !== -1) {
      const k = line.slice(0, colon).trim()
      const rawV = line.slice(colon + 1).trim()
      const v = parseVal(rawV)

      if (!rawV) {
        const child = {}
        if (Array.isArray(parent)) {
          parent.push({ [k]: child })
        } else {
          parent[k] = child
        }
        stack.push({ indent, node: child, key: k, parent })
      } else {
        if (Array.isArray(parent)) {
          let last = parent[parent.length - 1]
          if (typeof last !== 'object' || last[k] !== undefined) {
            last = {}
            parent.push(last)
          }
          last[k] = v
        } else {
          parent[k] = v
        }
      }
    }
  }

  return root
}

const parseVal = (v) => {
  if (!v) return ''
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1)
  if (v === 'true') return true
  if (v === 'false') return false
  if (!isNaN(v) && v !== '') return Number(v)
  return v
}

module.exports = { parseYaml }
