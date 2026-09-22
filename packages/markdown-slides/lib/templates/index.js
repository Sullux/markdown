const { titleContent } = require('./title-content')
const { headerColumnsFooter } = require('./header-columns-footer')
const { cover } = require('./cover')
const { split } = require('./split')
const { media } = require('./media')
const { quote } = require('./quote')
const { runTemplates, resolveTemplate } = require('./pipeline')

const BUILT_IN_TEMPLATES = {
  'Title/Content': titleContent,
  'title/content': titleContent,
  Standard: titleContent,
  standard: titleContent,

  'Header/Columns/Footer': headerColumnsFooter,
  'header/columns/footer': headerColumnsFooter,

  Cover: cover,
  cover: cover,
  Title: cover,
  title: cover,

  Split: split,
  split: split,
  Columns: split,
  columns: split,

  Media: media,
  media: media,
  FullBleed: media,
  fullbleed: media,

  Quote: quote,
  quote: quote,
}

module.exports = {
  BUILT_IN_TEMPLATES,
  titleContent,
  headerColumnsFooter,
  cover,
  split,
  media,
  quote,
  runTemplates,
  resolveTemplate,
}
