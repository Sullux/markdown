const URI_RE = /^<([a-zA-Z][a-zA-Z0-9+.-]{1,31}:[^\x00-\x20<>]+)>/
const EMAIL_RE = /^<([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/

const parseAutolink = (text, index) => {
  if (text[index] !== '<') return null
  const slice = text.slice(index)
  const uriMatch = slice.match(URI_RE)
  if (uriMatch) {
    const raw = uriMatch[1]
    return {
      token: {
        type: 'link',
        url: encodeURI(raw),
        children: [{ type: 'text', value: raw }],
      },
      consumedLength: uriMatch[0].length,
    }
  }
  const emailMatch = slice.match(EMAIL_RE)
  if (emailMatch) {
    const raw = emailMatch[1]
    return {
      token: {
        type: 'link',
        url: `mailto:${raw}`,
        children: [{ type: 'text', value: raw }],
      },
      consumedLength: emailMatch[0].length,
    }
  }
  return null
}

module.exports = { parseAutolink }
