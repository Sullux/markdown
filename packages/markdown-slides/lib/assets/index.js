const { copyAssets } = require('./copy')
const { normalizeAssetPath, resolveAssetNames } = require('./resolver')
const { findImageNodes, processSlideAssets } = require('./collector')

module.exports = {
  copyAssets,
  normalizeAssetPath,
  resolveAssetNames,
  findImageNodes,
  processSlideAssets,
}
