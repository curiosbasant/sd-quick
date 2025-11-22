/**
 * @typedef {import("prettier").Config} PrettierConfig
 * @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig
 */

/** @satisfies {PrettierConfig & TailwindConfig} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],

  // Base Config
  arrowParens: 'always',
  bracketSameLine: true,
  bracketSpacing: true,
  endOfLine: 'lf',
  jsxSingleQuote: true,
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  experimentalTernaries: true,
  experimentalOperatorPosition: 'start',

  // Tailwind Config
  tailwindStylesheet: './src/assets/tailwind.css',

  // tailwindFunctions: ['cn', 'cva', 'tv'],
}

export default config
