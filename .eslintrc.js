// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 0,
    'no-undef': 0,
    'no-console': 0,
    "indent": 0,
    "no-empty": 0,
    "no-new": 0,
    "semi": 0,
    "no-trailing-spaces": 0,
    "eqeqeq": 0,
    "quotes": 0,
    "comma-dangle": 0,
    "space-before-function-paren": 0,
    "one-var": 0,
    "eol-last": 0,
    "no-useless-escape": 0,
    "no-sequences": 0,
    "no-unused-expressions": 0,
    "template-curly-spacing": 0
  }
}
