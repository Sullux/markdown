const parseArgs = (args) => {
  const options = {}
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '-i' || arg === '--input') {
      options.input = args[++i]
    } else if (arg === '-o' || arg === '--output') {
      options.output = args[++i]
    } else if (arg === '-t' || arg === '--title') {
      options.title = args[++i]
    } else if (arg === '-c' || arg === '--config') {
      options.config = args[++i]
    } else if (arg === '-h' || arg === '--help') {
      options.help = true
    } else if (!arg.startsWith('-') && !options.input) {
      options.input = arg
    }
  }
  return options
}

module.exports = { parseArgs }
