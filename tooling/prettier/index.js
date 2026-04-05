import path from 'path'

/**
 * @typedef {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} PrettierConfig
 * @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig
 */

/** @satisfies { PrettierConfig & TailwindConfig } */
const config = {
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],

  // Base Config
  arrowParens: 'always',
  bracketSameLine: true,
  bracketSpacing: true,
  endOfLine: 'lf', // ensure linux-style line ending i.e \n
  jsxSingleQuote: true,
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  experimentalOperatorPosition: 'start',
  experimentalTernaries: true,

  // Tailwind Config
  tailwindFunctions: ['cn', 'cx', 'tv'],

  // Import Config
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(react-dom(.*)$)|^(react-native(.*)$)',
    '^(expo(.*)$)|^(expo$)|^(next/(.*)$)|^(next$)|^(wxt/(.*)$)|^(wxt$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@sd/(.*)$',
    '',
    '^~/',
    '^[../]',
    '^[./]',
  ],
  importOrderBuiltinModulesToTop: true,
  importOrderCombineTypeAndValueImports: true,
  importOrderMergeDuplicateImports: true,
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderTypeScriptVersion: '5.9.2',

  overrides: [
    {
      files: 'apps/extension/**',
      options: {
        tailwindStylesheet: path.join(
          import.meta.dirname,
          '../../apps/extension/src/assets/tailwind.css',
        ),
      },
    },
    {
      files: 'apps/mobile/**',
      options: {
        tailwindStylesheet: path.join(import.meta.dirname, '../../apps/mobile/src/styles.css'),
      },
    },
  ],
}

export default config
