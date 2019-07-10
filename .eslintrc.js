module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'vue/no-use-v-if-with-v-for': 0,
    'no-tabs': 0,
    'eqeqeq': 0,
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'vue/script-indent': ['warn', 2, {
      'baseIndent': 1
    }],
    'camelcase': 'off',
    'no-unused-vars': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  'overrides': [
    {
      'files': ['*.vue'],
      'rules': {
        'indent': 'off'
      }
    }
  ]
}
