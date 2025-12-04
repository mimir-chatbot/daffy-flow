import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  typescript: true,
  jsonc: true,
  rules: {
    'node/prefer-global/process': 'off',
    'array-bracket-spacing': 'off',
    'unused-imports/no-unused-vars': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'one-var': 'off',
    'no-console': 'off',
    'jsdoc/check-param-names': 'off',
    'curly': ['warn', 'multi-or-nest'],
    'antfu/if-newline': 'off',
    'antfu/curly': 'off',
    'antfu/consistent-list-newline': 'off',
    'brace-style': 'off',
    'style/no-tabs': 'warn',
  },
})
