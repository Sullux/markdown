const { getPresenterScript } = require('./presenter')
const { getCoreScript } = require('./core')
const { getScaleScript } = require('./scale')

const getClientScript = (title = '', themeCss = '') =>
  `(function () {
${getPresenterScript(title, themeCss)}
${getScaleScript()}
${getCoreScript()}
})();`

module.exports = {
  getClientScript,
}
