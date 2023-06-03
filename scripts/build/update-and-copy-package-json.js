const { resolve } = require('node:path');

const { readJsonSync, writeJSONSync, removeSync } = require('fs-extra');

const { extractImports } = require('./extract-imports');
const {
  nxLibPath,
  libPackageJSONPath,
  projectRootPackageJSONPath,
  distRootPath,
  ditPackageJSONPath,
} = require('./paths');

module.exports.updateAndCopyPackageJSON = async () => {
  const libPackageJSON = readJsonSync(libPackageJSONPath);

  const githubBasePath = 'https://github.com/ossts/mono';

  const {
    dependencies: rootDependencies,
    devDependencies: rootDevDependencies,
  } = readJsonSync(projectRootPackageJSONPath);
  const rootDependenciesKeys = Object.keys(rootDependencies);
  const rootDevDependenciesKeys = Object.keys(rootDevDependencies);

  const metaFilePath = resolve(distRootPath, 'metafile-cjs.json');
  const { outputs: metaFileOutputs } = readJsonSync(metaFilePath);

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
  libPackageJSON['module'] = 'index.mjs';
  libPackageJSON['types'] = 'index.d.ts';

  writeJSONSync(ditPackageJSONPath, libPackageJSON, {
    spaces: 2,
  });
};
