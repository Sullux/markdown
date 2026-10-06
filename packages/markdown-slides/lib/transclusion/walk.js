const fs = require('node:fs')
const path = require('node:path')
const { parse } = require('@sullux/markdown-compiler')
const { compileSubDoc } = require('./compile')

const isTransclusionNode = (node) =>
  node?.type === 'image' && node.url && /\.md(arkdown)?$/i.test(node.url)

const resolveNode = async (node, slideDir, deck, visited) => {
  const targetPath = path.resolve(slideDir, node.url)
  if (visited.has(targetPath)) {
    return {
      replacement: { type: 'html', value: `<!-- Cyclic: ${node.url} -->` },
      head: [],
    }
  }
  if (!fs.existsSync(targetPath)) {
    return {
      replacement: { type: 'html', value: `<!-- Missing: ${node.url} -->` },
      head: [],
    }
  }

  const raw = await fs.promises.readFile(targetPath, 'utf8')
  const subAst = parse(raw)
  const subRes = await walkBlocks(
    subAst.blocks || [],
    path.dirname(targetPath),
    deck,
    new Set(visited).add(targetPath),
  )

  return compileSubDoc(targetPath, deck, { ast: subAst, head: subRes.head })
}

const walkBlocks = async (blocks, slideDir, deck, visited = new Set()) => {
  const head = []
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]
    if (b.type === 'paragraph' && b.children?.length === 1 && isTransclusionNode(b.children[0])) {
      const res = await resolveNode(b.children[0], slideDir, deck, visited)
      blocks[i] = res.replacement
      head.push(...res.head)
      continue
    }
    if (b.children) {
      for (let j = 0; j < b.children.length; j++) {
        if (isTransclusionNode(b.children[j])) {
          const res = await resolveNode(b.children[j], slideDir, deck, visited)
          b.children[j] = res.replacement
          head.push(...res.head)
        }
      }
    }
    if (b.blocks) {
      const sub = await walkBlocks(b.blocks, slideDir, deck, visited)
      head.push(...sub.head)
    }
  }
  return { head }
}

const resolveSlideTransclusions = async (slides, deck) => {
  for (const slide of slides) {
    const slideDir = slide.file ? path.dirname(slide.file) : deck.dir
    const visited = slide.file ? new Set([path.resolve(slide.file)]) : new Set()
    const { head } = await walkBlocks(slide.ast?.blocks || [], slideDir, deck, visited)
    slide.extraHead = [...(slide.extraHead || []), ...head]
  }
}

module.exports = { isTransclusionNode, walkBlocks, resolveSlideTransclusions }
