// prettier-ignore
const scopes = [
  { value: 'openapi-codegen', name: 'openapi-codegen: anything related to openapi-codegen' },
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
