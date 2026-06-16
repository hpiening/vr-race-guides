/**
 * Usage: node scripts/package-guide.js <slug>
 * Example: node scripts/package-guide.js rocky-mountain
 *
 * Takes the shared out/ build and creates a self-contained deploy/<slug>/ folder
 * that can be dragged straight to its own Netlify site.
 */

const fs = require('fs')
const path = require('path')

const slug = process.argv[2]

if (!slug) {
  console.error('Error: provide a guide slug. Example: node scripts/package-guide.js rocky-mountain')
  process.exit(1)
}

const outDir = path.join(__dirname, '..', 'out')
const guideOut = path.join(outDir, slug)
const deployDir = path.join(__dirname, '..', 'deploy', slug)

if (!fs.existsSync(guideOut)) {
  console.error(`Error: out/${slug}/ not found. Run npm run build first.`)
  process.exit(1)
}

// Clean and recreate the deploy folder
fs.rmSync(deployDir, { recursive: true, force: true })
fs.mkdirSync(deployDir, { recursive: true })

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// Copy shared static assets
for (const folder of ['_next', 'fonts', 'images']) {
  const src = path.join(outDir, folder)
  if (fs.existsSync(src)) {
    copyDir(src, path.join(deployDir, folder))
  }
}

// Copy the guide's index.html to the root
fs.copyFileSync(
  path.join(guideOut, 'index.html'),
  path.join(deployDir, 'index.html')
)

// Copy index.txt if it exists (Next.js plain-text route)
const txtSrc = path.join(guideOut, 'index.txt')
if (fs.existsSync(txtSrc)) {
  fs.copyFileSync(txtSrc, path.join(deployDir, 'index.txt'))
}

// Add a _redirects file so Netlify handles 404s gracefully
fs.writeFileSync(
  path.join(deployDir, '_redirects'),
  '/*  /index.html  200\n'
)

console.log(`\n✓ deploy/${slug}/ is ready`)
console.log(`  Drag the deploy/${slug}/ folder to Netlify`)
console.log(`  Then set the custom domain for the guide\n`)
