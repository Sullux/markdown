const ASCII_PUNCTUATION = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/

const unescapeBackslashes = (str) =>
  str ? str.replace(/\\([!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])/g, '$1') : str

module.exports = { unescapeBackslashes, ASCII_PUNCTUATION }
