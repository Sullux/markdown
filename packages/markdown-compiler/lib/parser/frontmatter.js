const { parseYaml } = require('../yaml')

const parseFrontmatter = (yaml) =>
  parseYaml(Array.isArray(yaml) ? yaml.join('\n') : yaml)

module.exports = { parseFrontmatter }
