const detabLine = (line) => {
  if (!line || !line.includes('\t')) return line
  let col = 0, i = 0, res = ''
  while (i < line.length) {
    const char = line[i]
    if (char === ' ') {
      res += ' '
      col++
      i++
    } else if (char === '\t') {
      const add = 4 - (col % 4)
      res += ' '.repeat(add)
      col += add
      i++
    } else if (char === '>' || char === '-' || char === '*' || char === '+' || (char >= '0' && char <= '9')) {
      res += char
      col++
      i++
      if (char >= '0' && char <= '9') {
        while (i < line.length && line[i] >= '0' && line[i] <= '9') { res += line[i]; col++; i++ }
        if (i < line.length && (line[i] === '.' || line[i] === ')')) { res += line[i]; col++; i++ }
      }
      while (i < line.length && (line[i] === ' ' || line[i] === '\t')) {
        if (line[i] === ' ') { res += ' '; col++; i++ }
        else { const add = 4 - (col % 4); res += ' '.repeat(add); col += add; i++ }
      }
      break
    } else {
      break
    }
  }
  return res + line.slice(i)
}

module.exports = { detabLine }
