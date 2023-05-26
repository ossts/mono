const { resolve } = require('node:path');

const yargsParse = require('yargs-parser');
const { readJsonSync, writeJSONSync, read } = require('fs-extra');

const { extractImports } = require('./extract-imports');

(async () => {
  const { nxLibPath } = yargsParse(process.argv.slice(2));

  const libPackageJSON = readJsonSync(
    resolve(__dirname, `../../${nxLibPath}/package.json`)
  );

  const githubBasePath = 'https://github.com/ossts/mono';

  const projectRoot = resolve(__dirname, `../../`);
  const distRootPath = resolve(projectRoot, 'dist', nxLibPath);

  const {
    dependencies: rootDependencies,
    devDependencies: rootDevDependencies,
  } = readJsonSync(resolve(projectRoot, `package.json`));
  const rootDependenciesKeys = Object.keys(rootDependencies);
  const rootDevDependenciesKeys = Object.keys(rootDevDependencies);

  const { outputs: metaFileOutputs } = readJsonSync(
    resolve(distRootPath, 'metafile-cjs.json')
  );

  const dtsImports = await extractImports(resolve(distRootPath, 'index.d.ts'));

  const requiredDependencies = new Set(dtsImports);
  for (let key in metaFileOutputs) {
    if (!key.endsWith('.js')) continue;

    metaFileOutputs[key].imports.forEach(({ path }) =>
      requiredDependencies.add(path)
    );
  }

  if (!libPackageJSON['dependencies']) {
    libPackageJSON['dependencies'] = {};
  }
  if (!libPackageJSON['devDependencies']) {
    libPackageJSON['devDependencies'] = {};
  }

  for (let dependency of requiredDependencies) {
    if (rootDependencies[dependency]) {
      libPackageJSON['dependencies'][dependency] = rootDependencies[dependency];
    } else if (rootDevDependencies[dependency]) {
      libPackageJSON['devDependencies'][dependency] =
        rootDevDependencies[dependency];

      // this is required to resolve deep import paths
      // which may be longer than package name
    } else if (dependency.includes('/')) {
      const matchedDependency = rootDependenciesKeys.find((name) =>
        dependency.startsWith(name)
      );
      if (matchedDependency) {
        libPackageJSON['dependencies'][matchedDependency] =
          rootDependencies[matchedDependency];
        continue;
      }

      const matchedDevDependency = rootDevDependenciesKeys.find((name) =>
        dependency.startsWith(name)
      );

      if (!matchedDevDependency) continue;

      libPackageJSON['devDependencies'][matchedDevDependency] =
        rootDevDependencies[matchedDevDependency];
    }
  }

  libPackageJSON['homepage'] = `${githubBasePath}/tree/main/${nxLibPath}`;
  libPackageJSON['repository'] = {
    type: 'git',
    url: `${githubBasePath}.git`,
    directory: nxLibPath,
  };

  libPackageJSON['bugs'] = {
    url: `${githubBasePath}/issues`,
  };

  libPackageJSON['main'] = 'index.js';
  libPackageJSON['types'] = 'index.d.ts';

  writeJSONSync(resolve(distRootPath, `package.json`), libPackageJSON, {
    spaces: 2,
  });
})();
