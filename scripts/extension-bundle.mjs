import { build, context } from 'esbuild'

/** @satisfies {import('esbuild').BuildOptions} */
const options = {
  entryPoints: ['extension/scripts/*.ts'],
  bundle: true,
  // minify: true,
  write: true,
  // target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  outdir: 'dist',
}

if (process.env.npm_lifecycle_event === 'ext:watch') {
  const ctx = await context(options)
  await ctx.watch()
  console.log('Watching files for changes...')
} else {
  await build(options).catch(() => process.exit(1))
  console.log('Extension bundling complete!')
}
