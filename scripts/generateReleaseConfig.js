module.exports = (name) => {
  const srcRoot = `libs/${name}`;
  const distRoot = `dist/${srcRoot}`;

  const assets = [`${srcRoot}/package.json`, `${srcRoot}/CHANGELOG.md`];

  /** @type {import('@types/semantic-release').Options} */
  const result = {
    extends: 'release.config.base.js',
    pkgRoot: distRoot,
    tagFormat: name + '-v${version}',
    commitPaths: [`${srcRoot}/*`],
    branches: [
      `release/${name}`,

      // handle "feature" (e.g. 1.x) and "fix" (e.g. 1.1.x) release branches logic
      {
        name: `release/${name}--<%= version %>`,
        version: '+([0-9])?(.{+([0-9]),x}).x',
      },

      // handle alpha, beta and rc releases in format release/${name}--v2.0.0-{alpha,beta,rc}.1
      { name: `release/${name}--alpha`, prerelease: 'alpha' },
      { name: `release/${name}--beta`, prerelease: 'beta' },
      { name: `release/${name}--rc`, prerelease: 'rc' },
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
            `chore(release): Release ${name} ` +
            '${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
        },
      ],
    ],
  };

  return result;
};
