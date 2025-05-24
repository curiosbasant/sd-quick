import { defineConfig } from 'wxt'
import tailwindcss from '@tailwindcss/vite'

// See https://wxt.dev/api/config.html
export default defineConfig({
  autoIcons: {
    grayscaleOnDevelopment: false,
  },
  hooks: {
    'build:manifestGenerated': (wxt, manifest) => {
      if (wxt.config.mode === 'development') {
        manifest.name += ' (DEV)'
        manifest.version_name = '0.0.0-dev'
      }
    },
  },
  manifest: () => ({
    // Get the next release version from `semantic-release`
    version: import.meta.env.EXT_VERSION,
    name: 'ShalaDarpan Quick',
    short_name: 'SD Quick',
    author: { email: 'basantbrpl@gmail.com' },
  }),
  modules: ['@wxt-dev/auto-icons', '@wxt-dev/module-react'],
  srcDir: 'src',
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  webExt: {
    // prevent auto opening the browser
    disabled: true,
  },
  zip: {
    // Zipped file name
    artifactTemplate: '{{name}}-v{{version}}-{{browser}}.zip',
    zipSources: false,
  },
})
