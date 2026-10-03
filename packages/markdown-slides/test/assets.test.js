const test = require('node:test')
const assert = require('node:assert')
const path = require('node:path')
const {
  normalizeAssetPath,
  resolveAssetNames,
} = require('../lib/assets/resolver')
const { findImageNodes } = require('../lib/assets/collector')

test('assets - normalizeAssetPath re-roots local and remote paths', () => {
  const remote = normalizeAssetPath(
    'https://sullux.com/images/logo.svg?v=1',
    '/base',
  )
  assert.strictEqual(remote.type, 'remote')
  assert.strictEqual(remote.canonical, '/remote/sullux.com/images/logo.svg')

  const local = normalizeAssetPath('../assets/chart.png', '/base/deck')
  assert.strictEqual(local.type, 'local')
  assert.ok(local.canonical.endsWith('assets/chart.png'))
})

test('assets - resolveAssetNames minimizes suffixes and deduplicates identical paths', () => {
  const assets = [
    { canonical: '/remote/sullux.com/images/logo.svg' },
    { canonical: '/user/project/docs/logo.svg' },
    { canonical: '/remote/sullux.com/images/logo.svg' }, // duplicate
    { canonical: '/user/project/images/diagram.png' }, // unique
  ]

  const mapping = resolveAssetNames(assets)

  assert.strictEqual(mapping.get('/user/project/images/diagram.png'), 'diagram.png')
  assert.strictEqual(mapping.get('/remote/sullux.com/images/logo.svg'), 'images-logo.svg')
  assert.strictEqual(mapping.get('/user/project/docs/logo.svg'), 'docs-logo.svg')
})

test('assets - resolveAssetNames handles case-insensitive collisions and terminal fallback', () => {
  const assets = [
    { canonical: '/user/deck/images/foo.svg' },
    { canonical: '/user/deck/images/Foo.svg' },
  ]

  const mapping = resolveAssetNames(assets)

  const n1 = mapping.get('/user/deck/images/foo.svg')
  const n2 = mapping.get('/user/deck/images/Foo.svg')

  assert.notStrictEqual(n1.toLowerCase(), n2.toLowerCase())
  assert.ok(n1.includes('foo') && n2.includes('Foo'))
  assert.ok(n2.includes('-2.svg'))
})

test('assets - findImageNodes discovers images across blocks and children', () => {
  const ast = {
    blocks: [
      {
        type: 'paragraph',
        children: [
          { type: 'image', url: 'images/one.png' },
          {
            type: 'link',
            children: [{ type: 'image', url: 'https://site.com/two.png' }],
          },
        ],
      },
    ],
  }

  const nodes = findImageNodes(ast)
  assert.strictEqual(nodes.length, 2)
  assert.strictEqual(nodes[0].url, 'images/one.png')
  assert.strictEqual(nodes[1].url, 'https://site.com/two.png')
})
