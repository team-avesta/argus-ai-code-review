module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-length': [2, 'always', 500],
    'body-max-line-length': [2, 'always', 300],
  },
};
