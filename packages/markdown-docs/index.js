const { generateSite } = require('./lib/site')
const { normalizeConfig } = require('./lib/config')

module.exports = { generateSite, generateDocs: generateSite, normalizeConfig }
