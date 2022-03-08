module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  plugins: ['prettier'],
  extends: [
    'prettier',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    '@nuxtjs/eslint-config-typescript',
  ],
  // https://eslint.org/docs/rules/
  rules: {
    'nuxt/no-env-in-hooks': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'prettier/prettier': 'warn',
    semi: 'off',
    indent: 'off',
    'no-console': 'off',
    'comma-dangle': ['error', 'only-multiline'],
    // Vue rules
    // - https://eslint.vuejs.org/rules
    'vue/no-multiple-template-root': 'off',
    'vue/html-self-closing': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: true,
      },
    ],
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/no-v-html': 'off',
    // Prettier rules
    'max-len': [0, 120],
    code: [0, 120],
    'print-width': [0, 120],
    'space-before-function-paren': [0],
    'arrow-parens': [0],
    curly: [0],
    'keyword-spacing': [0],
  },
};
