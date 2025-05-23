/** @type {import('semantic-release').GlobalConfig} */
export default {
  branches: 'main',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          { breaking: true, release: 'major' },
          { revert: true, release: 'patch' },
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'style', release: 'patch' },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'EXT_VERSION=${nextRelease.version} pnpm run "/^zip:.*/"',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: ['.output/*.zip'],
      },
    ],
  ],
  preset: 'conventionalcommits',
  presetConfig: {
    types: [
      {
        type: 'feat',
        section: '✨ Features',
      },
      {
        type: 'feature',
        section: '✨ Features',
      },
      {
        type: 'fix',
        section: '🚀 Improvements',
      },
      {
        type: 'perf',
        section: '🚀 Improvements',
      },
      {
        type: 'style',
        section: '🚀 Improvements',
      },
      {
        type: 'revert',
        section: '⏪️ Reverts',
      },
      {
        type: 'docs',
        section: 'Documentation',
        hidden: true,
      },
      {
        type: 'chore',
        section: 'Miscellaneous Chores',
        hidden: true,
      },
      {
        type: 'refactor',
        section: 'Code Refactoring',
        hidden: true,
      },
      {
        type: 'test',
        section: 'Tests',
        hidden: true,
      },
      {
        type: 'build',
        section: 'Build System',
        hidden: true,
      },
      {
        type: 'ci',
        section: 'Continuous Integration',
        hidden: true,
      },
    ],
  },
}
