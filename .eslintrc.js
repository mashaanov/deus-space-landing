// .eslintrc.js
module.exports = {
  env: {
    browser: true,      // для браузерного кода
    es2021: true,       // для современного JavaScript
    node: true,         // ДОБАВЬТЕ ЭТУ СТРОКУ для Node.js глобальных переменных
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // ваши правила
  },
};