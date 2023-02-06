// prettier-ignore
const scopes = [
  { value: 'codegen', name: 'codegen: anything related to codegen' },
];

/** @type {import('cz-git').CommitizenGitOptions} */
module.exports = {
  scopes,
  maxSubjectLength: 100,
  allowCustomScopes: false,
  allowEmptyScopes: false,
  allowCustomIssuePrefix: false,
  allowEmptyIssuePrefix: false,
};
