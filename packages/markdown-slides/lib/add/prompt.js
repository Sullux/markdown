const readline = require('node:readline/promises')
const { TEMPLATE_BOILERPLATES } = require('./templates')

const TEMPLATE_NAMES = Object.keys(TEMPLATE_BOILERPLATES)

const promptTemplate = async () => {
  if (!process.stdin.isTTY) return TEMPLATE_NAMES[0]

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  console.log('\nSelect a slide template:')
  TEMPLATE_NAMES.forEach((name, i) => {
    const isDef = i === 0 ? ' (default)' : ''
    console.log(`  ${i + 1}) ${name}${isDef}`)
  })

  try {
    const answer = await rl.question('\nChoose template [1-6] (default: 1): ')
    const trimmed = answer.trim()
    if (!trimmed || trimmed === '1') return TEMPLATE_NAMES[0]

    const num = parseInt(trimmed, 10)
    if (!isNaN(num) && num >= 1 && num <= TEMPLATE_NAMES.length) {
      return TEMPLATE_NAMES[num - 1]
    }

    const matched = TEMPLATE_NAMES.find(
      (n) => n.toLowerCase() === trimmed.toLowerCase(),
    )
    return matched || TEMPLATE_NAMES[0]
  } finally {
    rl.close()
  }
}

module.exports = {
  TEMPLATE_NAMES,
  promptTemplate,
}
