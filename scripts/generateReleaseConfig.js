/**
 * Generates release config which will publish to NPM and create new Github release.
 *
 * @param {string} packageName Name of package in NPM and in Github release notes
 * @param {string} branchName Name of the branch after `release/`
 * @param {string} path Path to package root relative to `libs` folder
 * @param {string[]?} additionalCommitPaths Additional path to check for commits
 * @returns
 */
module.exports = (
  packageName,
  branchName = packageName,
  path = packageName,
  additionalCommitPaths = [],
) => {
  const srcRoot = `libs/${path}`;
  const distRoot = `dist/${srcRoot}`;

  const assets = [`${srcRoot}/package.json`, `${srcRoot}/CHANGELOG.md`];

  /** @type {import('@types/semantic-release').Options} */
  const result = {
    extends: 'release.config.base.js',
    pkgRoot: distRoot,
    tagFormat: packageName + '-v${version}',
    commitPaths: [`${srcRoot}/*`, ...additionalCommitPaths],
    branches: [
      `release/${branchName}`,

      // handle "feature" (e.g. 1.x) and "fix" (e.g. 1.1.x) release branches logic
      {
        name: `release/${branchName}--<%= version %>`,
        version: '+([0-9])?(.{+([0-9]),x}).x',
      },

      // handle alpha, beta and rc releases in format release/${branchName}--v2.0.0-{alpha,beta,rc}.1
      { name: `release/${branchName}--alpha`, prerelease: 'alpha' },
      { name: `release/${branchName}--beta`, prerelease: 'beta' },
      { name: `release/${branchName}--rc`, prerelease: 'rc' },
    ],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      [
        '@semantic-release/changelog',
        {
          changelogFile: `${srcRoot}/CHANGELOG.md`,
        },
      ],
      [
        '@semantic-release/changelog',
        {
          changelogFile: `${distRoot}/CHANGELOG.md`,
        },
      ],
      '@semantic-release/npm',
      '@semantic-release/github',
      [
        '@semantic-release/git',
        {
          assets,
          message:
            `chore(release): Release ${packageName} ` +
            '${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
        },
      ],
    ],
  };

  return result;
};
