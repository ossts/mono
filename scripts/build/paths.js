const { resolve } = require('node:path');

const { nxLibPath } = require('./args');

const projectRootPath = resolve(__dirname, `../../`);
const projectRootPackageJSONPath = resolve(projectRootPath, `package.json`);

const distRootPath = resolve(projectRootPath, 'dist', nxLibPath);
const ditPackageJSONPath = resolve(distRootPath, `package.json`);
const distBinPath = resolve(distRootPath, `bin`);

const libRootPath = resolve(projectRootPath, nxLibPath);
const libPackageJSONPath = resolve(libRootPath, 'package.json');
const libBinPath = resolve(libRootPath, 'src', `bin`);

module.exports = {
  nxLibPath,
  projectRootPath,
  projectRootPackageJSONPath,
  distRootPath,
  ditPackageJSONPath,
  distBinPath,
  libRootPath,
  libPackageJSONPath,
  libBinPath,
};
