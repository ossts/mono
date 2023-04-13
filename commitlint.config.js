const { scopes } = require('./scripts/commitizen');

/** @type import('@commitlint/types').UserConfig */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': async (ctc) => [
      2,
      'always',
      scopes.map((item) => item.value),
    ],
  },
};
