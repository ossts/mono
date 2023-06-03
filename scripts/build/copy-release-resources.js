const { resolve } = require('node:path');

const { copyFileSync, ensureDirSync, pathExistsSync } = require('fs-extra');

const {
  libRootPath,
  libBinPath,
  distRootPath,
  distBinPath,
  projectRootPath,
} = require('./paths');

module.exports.copyReleaseResources = async () => {
  copyFileSync(
    resolve(libRootPath, 'README.md'),
    resolve(distRootPath, 'README.md')
  );

  const libNPMIgnorePath = resolve(libRootPath, '.npmignore');
  if (pathExistsSync(libNPMIgnorePath)) {
    copyFileSync(libNPMIgnorePath, resolve(distRootPath, '.npmignore'));
  }
  copyFileSync(
    resolve(projectRootPath, 'LICENSE'),
    resolve(distRootPath, 'LICENSE')
  );

  const libBinIndexPath = resolve(libBinPath, 'index.js');
  if (pathExistsSync(libBinIndexPath)) {
    ensureDirSync(distBinPath);
    copyFileSync(
      resolve(libBinPath, 'index.js'),
      resolve(distBinPath, 'index.js')
    );
  }
};
