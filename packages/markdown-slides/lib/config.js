const parseArgs = (args) => {
  const options = {}
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === 'add') {
      options.command = 'add'
      if (args[i + 1] && !args[i + 1].startsWith('-')) {
        options.name = args[++i]
      }
    } else if (arg === 'update') {
      options.command = 'update'
    } else if (arg === '-i' || arg === '--input') {
      options.input = args[++i]
    } else if (arg === '-o' || arg === '--output') {
      options.output = args[++i]
    } else if (arg === '--template') {
      options.template = args[++i]
    } else if (arg === '-t' || arg === '--title') {
      if (options.command === 'add') {
        options.template = args[++i]
      } else {
        options.title = args[++i]
      }
    } else if (arg === '-c' || arg === '--config') {
      options.config = args[++i]
    } else if (
      arg === '--templates' ||
      arg === '-l' ||
      arg === '--list-templates'
    ) {
      options.templates = true
    } else if (arg === '-h' || arg === '--help') {
      options.help = true
    } else if (!arg.startsWith('-') && !options.input) {
      options.input = arg
    }
  }
  return options
}

module.exports = { parseArgs }
