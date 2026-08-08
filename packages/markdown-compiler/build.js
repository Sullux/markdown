const fs = require('node:fs')
const path = require('node:path')

const copyRecursiveSync = (src, dest) => {
  if (!fs.existsSync(src)) return
  const stats = fs.statSync(src)
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
    for (const child of fs.readdirSync(src)) {
      copyRecursiveSync(path.join(src, child), path.join(dest, child))
    }
  } else if (!src.endsWith('.test.js')) {
    fs.copyFileSync(src, dest)
  }
}

const buildDeployPkg = (pkg) => {
  const deployPkg = { ...pkg }
  delete deployPkg.scripts
  delete deployPkg.devDependencies
  return deployPkg
}

const updateReadme = (deployDir, tagName, repoUrl) => {
  const readmePath = path.join(deployDir, 'README.md')
  if (!fs.existsSync(readmePath)) return
  let readme = fs.readFileSync(readmePath, 'utf8')
  if (repoUrl) {
    const cleanRepo = repoUrl.replace(/\.git$/, '').replace(/^git\+/, '')
    const baseUrl = `${cleanRepo}/blob/${tagName}`
    readme = readme.replace(/\]\((docs|architecture)\//g, `](${baseUrl}/$1/`)
    readme = readme.replace(/\]\(LICENSE\)/g, `](${baseUrl}/LICENSE)`)
  }
  fs.writeFileSync(readmePath, readme)
}

const deploy = () => {
  const root = __dirname
  const pkgPath = path.join(root, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  const tagName = `v${pkg.version}`
  const deployDir = path.join(root, '.deploy')

  console.log(`Staging deployment for ${pkg.name}@${pkg.version}...`)

  if (fs.existsSync(deployDir)) fs.rmSync(deployDir, { recursive: true, force: true })
  fs.mkdirSync(deployDir, { recursive: true })

  copyRecursiveSync(path.join(root, 'lib'), path.join(deployDir, 'lib'))

  const rootFiles = ['README.md', 'index.js', 'LICENSE']
  for (const file of rootFiles) {
    const src = path.join(root, file)
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(deployDir, file))
  }

  const deployPkg = buildDeployPkg(pkg)
  fs.writeFileSync(path.join(deployDir, 'package.json'), JSON.stringify(deployPkg, null, 2))

  updateReadme(deployDir, tagName, pkg.repository?.url)
  console.log('Deployment staging complete!')
}

deploy()
