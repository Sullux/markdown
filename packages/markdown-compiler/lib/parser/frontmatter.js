const parseFrontmatter = (yamlLines) => {
  const data = {}
  for (const line of yamlLines) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const match = line.match(/^([a-zA-Z0-9_\-]+)\s*:\s*(.*)$/)
    if (match) {
      const key = match[1]
      let val = match[2].trim()

      if (val.startsWith('[') && val.endsWith(']')) {
        val = val
          .slice(1, -1)
          .split(',')
          .map((s) => {
            const str = s.trim()
            if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
              return str.slice(1, -1)
            }
            return str
          })
          .filter(Boolean)
      } else {
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        if (val === 'true') val = true
        else if (val === 'false') val = false
        else if (!isNaN(val) && val !== '') val = Number(val)
      }
      data[key] = val
    }
  }
  return data
}

module.exports = { parseFrontmatter }
