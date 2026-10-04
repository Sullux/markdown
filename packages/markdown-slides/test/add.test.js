const test = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { addSlide } = require('../lib/add')
const { getBoilerplate } = require('../lib/add/templates')

test('add - getBoilerplate returns customized markdown templates', () => {
  const cover = getBoilerplate('Cover')
  assert.ok(cover.includes('template: Cover'))
  assert.ok(cover.includes('# Presentation Title'))

  const split = getBoilerplate('Split')
  assert.ok(split.includes('template: Split'))
  assert.ok(split.includes('### Left Content'))
  assert.ok(split.includes('### Right Content'))
})

test('add - creates slide file and initializes slides.yaml', async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'test-add-'))
  const res = await addSlide({
    input: tmp,
    name: '01-intro',
    template: 'Cover',
  })

  assert.strictEqual(res.filename, '01-intro.md')
  assert.strictEqual(res.template, 'Cover')
  assert.ok(fs.existsSync(res.filePath))

  const yamlContent = fs.readFileSync(path.join(tmp, 'slides.yaml'), 'utf8')
  assert.ok(yamlContent.includes('- 01-intro.md'))

  // Add second slide
  const res2 = await addSlide({
    input: tmp,
    name: '02-body.md',
    template: 'Split',
  })
  assert.strictEqual(res2.filename, '02-body.md')
  assert.strictEqual(res2.template, 'Split')

  const updatedYaml = fs.readFileSync(path.join(tmp, 'slides.yaml'), 'utf8')
  const idx1 = updatedYaml.indexOf('01-intro.md')
  const idx2 = updatedYaml.indexOf('02-body.md')
  assert.ok(idx1 !== -1 && idx2 !== -1 && idx2 > idx1)
})

test('add - prevents overwriting existing slide file', async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'test-add-'))
  await addSlide({ input: tmp, name: 'slide.md', template: 'Title/Content' })

  await assert.rejects(
    async () => {
      await addSlide({ input: tmp, name: 'slide.md', template: 'Cover' })
    },
    { message: /already exists/ },
  )
})
