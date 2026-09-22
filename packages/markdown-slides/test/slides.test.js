const test = require('node:test')
const assert = require('node:assert')
const { parseArgs, buildDeck } = require('../index')

test('markdown-slides - parseArgs correctly parses CLI options', () => {
  const args = ['-i', './my-slides', '-o', './dist', '-t', 'Pitch Deck']
  const options = parseArgs(args)
  assert.strictEqual(options.input, './my-slides')
  assert.strictEqual(options.output, './dist')
  assert.strictEqual(options.title, 'Pitch Deck')
})

test('markdown-slides - buildDeck initializes deck options', () => {
  const res = buildDeck({ input: '.', output: './_test_slides' })
  assert.strictEqual(res.slideCount, 0)
  assert.ok(res.input)
  assert.ok(res.output)
  // Clean up test dir
  const fs = require('node:fs')
  if (fs.existsSync('./_test_slides')) {
    fs.rmSync('./_test_slides', { recursive: true, force: true })
  }
})
