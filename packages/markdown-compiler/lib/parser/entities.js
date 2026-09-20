const ENTITIES = {
  nbsp: '\u00A0', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  copy: '©', reg: '®', trade: '™', AElig: 'Æ', aelig: 'æ',
  Dcaron: 'Ď', dcaron: 'ď', frac34: '¾', frac12: '½', frac14: '¼',
  HilbertSpace: 'ℋ', DifferentialD: 'ⅆ', ClockwiseContourIntegral: '∲',
  ngE: '\u2267\u0338', ouml: 'ö', Ouml: 'Ö', auml: 'ä', Auml: 'Ä',
  uuml: 'ü', Uuml: 'Ü', eacute: 'é', Eacute: 'É', agrave: 'à',
  egrave: 'è', igrave: 'ì', ograve: 'ò', ugrave: 'ù',
}

const parseEntity = (text, index) => {
  if (text[index] !== '&') return null
  const rest = text.slice(index)

  const hex = rest.match(/^&#[xX]([0-9a-fA-F]{1,6});/)
  if (hex) {
    const val = parseInt(hex[1], 16)
    const ch = (val === 0 || val > 0x10FFFF) ? '\uFFFD' : String.fromCodePoint(val)
    return { token: { type: 'text', value: ch }, consumedLength: hex[0].length }
  }

  const dec = rest.match(/^&#([0-9]{1,7});/)
  if (dec) {
    const val = parseInt(dec[1], 10)
    const ch = (val === 0 || val > 0x10FFFF) ? '\uFFFD' : String.fromCodePoint(val)
    return { token: { type: 'text', value: ch }, consumedLength: dec[0].length }
  }

  const named = rest.match(/^&([a-zA-Z0-9]+);/)
  if (named && ENTITIES[named[1]] !== undefined) {
    return { token: { type: 'text', value: ENTITIES[named[1]] }, consumedLength: named[0].length }
  }

  return null
}

const decodeEntities = (str) => {
  if (!str || !str.includes('&')) return str
  return str.replace(/&(?:#x([0-9a-fA-F]{1,6})|#([0-9]{1,7})|([a-zA-Z0-9]+));/g, (match, hex, dec, named) => {
    if (hex) {
      const val = parseInt(hex, 16)
      return val === 0 || val > 0x10ffff ? '\uFFFD' : String.fromCodePoint(val)
    }
    if (dec) {
      const val = parseInt(dec, 10)
      return val === 0 || val > 0x10ffff ? '\uFFFD' : String.fromCodePoint(val)
    }
    if (named && ENTITIES[named] !== undefined) {
      return ENTITIES[named]
    }
    return match
  })
}

module.exports = { parseEntity, decodeEntities, ENTITIES }
