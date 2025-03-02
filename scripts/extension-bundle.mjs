import { build, context } from 'esbuild'
import { copyFile } from 'fs/promises'

/** @satisfies {import('esbuild').BuildOptions} */
const options = {
  entryPoints: ['extension/scripts/*.ts'],
  bundle: true,
  write: true,
  // target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  outdir: 'dist/scripts',
  plugins: [
    {
      name: 'copy-manifest',
      setup(build) {
        build.onEnd(() => copyFile('extension/manifest.json', 'dist/manifest.json'))
      },
    },
  ],
}

if (process.env.npm_lifecycle_event === 'ext:watch') {
  const ctx = await context(options)
  await ctx.watch()
  console.log('Watching files for changes...')
} else {
  await build({ ...options, minify: true }).catch(() => process.exit(1))
  console.log('Extension bundling complete!')
}
