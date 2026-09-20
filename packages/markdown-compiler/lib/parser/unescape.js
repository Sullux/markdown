const ASCII_PUNCTUATION = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/

const unescapeBackslashes = (str) =>
  str ? str.replace(/\\([!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])/g, '$1') : str

const normalizeUrl = (url) =>
  url ? encodeURI(url).replace(/%25([0-9a-fA-F]{2})/g, '%$1') : ''

module.exports = { unescapeBackslashes, normalizeUrl, ASCII_PUNCTUATION }
