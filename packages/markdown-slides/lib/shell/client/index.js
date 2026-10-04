const { getPresenterScript } = require('./presenter')
const { getCoreScript } = require('./core')

const getClientScript = (title = '', themeCss = '') =>
  `(function () {
${getPresenterScript(title, themeCss)}
${getCoreScript()}
})();`

module.exports = {
  getClientScript,
}
