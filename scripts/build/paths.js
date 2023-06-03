const { resolve } = require('node:path');

const yargsParse = require('yargs-parser');

const { nxLibPath } = yargsParse(process.argv.slice(2));

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
