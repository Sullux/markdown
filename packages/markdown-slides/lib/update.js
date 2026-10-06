const { spawn } = require('node:child_process')

const updatePackage = (pkg = '@sullux/markdown-slides@latest') =>
  new Promise((resolve, reject) => {
    console.log(`Updating via npm: npm install -g ${pkg} ...\n`)
    const child = spawn('npm', ['install', '-g', pkg], {
      stdio: 'inherit',
      shell: true,
    })
    child.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, pkg })
      } else {
        reject(new Error(`npm install exited with code ${code}`))
      }
    })
    child.on('error', reject)
  })

module.exports = { updatePackage }
