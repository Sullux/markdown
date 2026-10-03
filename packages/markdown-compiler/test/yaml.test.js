const test = require('node:test')
const assert = require('node:assert')
const { parseYaml } = require('../lib/yaml')

test('yaml - primitives, quotes, booleans, and nulls', () => {
  const yaml = `
title: "Quarterly Review"
count: 42
pi: 3.14
enabled: true
draft: false
empty: null
tilde: ~
`
  const data = parseYaml(yaml)
  assert.strictEqual(data.title, 'Quarterly Review')
  assert.strictEqual(data.count, 42)
  assert.strictEqual(data.pi, 3.14)
  assert.strictEqual(data.enabled, true)
  assert.strictEqual(data.draft, false)
  assert.strictEqual(data.empty, undefined)
  assert.strictEqual(data.tilde, undefined)
})

test('yaml - nested dictionaries and lists', () => {
  const yaml = `
meta:
  author: Charles
  nested:
    level: 3
tags:
  - architecture
  - compiler
slides:
  - file: 01-intro.md
    template: Cover
  - file: 02-deep.md
    template: Split
`
  const data = parseYaml(yaml)
  assert.strictEqual(data.meta.author, 'Charles')
  assert.strictEqual(data.meta.nested.level, 3)
  assert.deepStrictEqual(data.tags, ['architecture', 'compiler'])
  assert.strictEqual(data.slides.length, 2)
  assert.strictEqual(data.slides[0].file, '01-intro.md')
  assert.strictEqual(data.slides[0].template, 'Cover')
  assert.strictEqual(data.slides[1].template, 'Split')
})

test('yaml - inline JSON flow arrays and objects', () => {
  const yaml = `
tags: ["one", "two", "three"]
config: {"ratio": "16:9", "theme": "dark"}
`
  const data = parseYaml(yaml)
  assert.deepStrictEqual(data.tags, ['one', 'two', 'three'])
  assert.deepStrictEqual(data.config, { ratio: '16:9', theme: 'dark' })
})

test('yaml - multiline literal block scalar (|)', () => {
  const yaml = `
notes: |
  Welcome everyone to the review.
  Please keep questions until the end.
title: Done
`
  const data = parseYaml(yaml)
  assert.strictEqual(
    data.notes,
    'Welcome everyone to the review.\nPlease keep questions until the end.\n',
  )
  assert.strictEqual(data.title, 'Done')
})

test('yaml - multiline literal block scalar with strip chomping (|-)', () => {
  const yaml = `
notes: |-
  Line 1
  Line 2
title: Done
`
  const data = parseYaml(yaml)
  assert.strictEqual(data.notes, 'Line 1\nLine 2')
})

test('yaml - multiline folded block scalar (>)', () => {
  const yaml = `
summary: >
  This is a long paragraph
  that should fold into a single line.

  And this is a second paragraph.
`
  const data = parseYaml(yaml)
  assert.strictEqual(
    data.summary,
    'This is a long paragraph that should fold into a single line.\n\nAnd this is a second paragraph.\n',
  )
})
