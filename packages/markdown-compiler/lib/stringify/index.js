const { stringifyNode } = require('./blocks')

const stringifyFrontmatter = (frontmatter) => {
  if (!frontmatter || Object.keys(frontmatter).length === 0) return ''
  let result = '---\n'
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      result += `${key}: [${value.map((v) => v).join(', ')}]\n`
    } else {
      result += `${key}: ${value}\n`
    }
  }
  result += '---\n'
  return result
}

const stringify = ({ frontmatter, blocks }) => {
  let result = stringifyFrontmatter(frontmatter)
  if (blocks) {
    result += blocks.map((b) => stringifyNode(b)).join('')
  }
  return result.trim()
}

module.exports = { stringify, stringifyNode }
