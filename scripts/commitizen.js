const { resolve } = require('node:path');
const { readJsonSync } = require('fs-extra');

const scopes = readJsonSync(
  resolve(__dirname, '../__generated__/cz-scopes.json'),
);

/** @type {import('cz-git').CommitizenGitOptions} */
module.exports = {
  scopes: [
    ...scopes,
    {
      value: 'workspace',
      name: 'workspace: anything related to workspace itself (not related to any of the projects)',
    },
  ],
  maxSubjectLength: 100,
  allowCustomScopes: false,
  allowEmptyScopes: false,
  allowCustomIssuePrefix: false,
  allowEmptyIssuePrefix: false,
};
