import { defineConfig } from 'oxfmt';

export default defineConfig({
  arrowParens: 'avoid',
  bracketSpacing: true,
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  jsxSingleQuote: true,
  bracketSameLine: false,
  printWidth: 85,
  proseWrap: 'always',
  requirePragma: false,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  vueIndentScriptAndStyle: true,
  objectWrap: 'collapse',
  sortTailwindcss: true,
  sortPackageJson: false,
  ignorePatterns: ['node_modules', 'publish', 'publish_npm', 'lib'],
});
