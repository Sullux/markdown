const slugify = (str, usedSlugs = new Set()) => {
  let base = String(str || '')
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

  if (!base) base = 'section'

  let slug = base
  let counter = 1
  while (usedSlugs.has(slug)) {
    slug = `${base}-${counter}`
    counter++
  }
  usedSlugs.add(slug)
  return slug
}

module.exports = { slugify }
