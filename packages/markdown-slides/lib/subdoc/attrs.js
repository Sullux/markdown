const parseAttributes = (raw = '') => {
  const attrs = {}
  if (!raw || !raw.trim()) return attrs

  const idMatch = raw.match(/#([a-zA-Z0-9_\-]+)/)
  if (idMatch) attrs.id = idMatch[1]

  const classMatches = raw.match(/\.([a-zA-Z0-9_\-]+)/g)
  if (classMatches) {
    attrs.classes = classMatches.map((c) => c.slice(1))
  }

  const keyValMatches = raw.matchAll(/([a-zA-Z0-9_\-]+)=["']?([^"'\s]+)["']?/g)
  for (const m of keyValMatches) {
    attrs[m[1]] = m[2]
  }

  return attrs
}

module.exports = { parseAttributes }
