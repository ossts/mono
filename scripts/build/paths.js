const { resolve } = require('node:path');

const yargsParse = require('yargs-parser');

const { nxLibPath } = yargsParse(process.argv.slice(2));

const projectRootPath = resolve(__dirname, `../../`);
const projectRootPackageJSONPath = resolve(projectRootPath, `package.json`);

const distRootPath = resolve(projectRootPath, 'dist', nxLibPath);
const ditPackageJSONPath = resolve(distRootPath, `package.json`);

const libRootPath = resolve(projectRootPath, nxLibPath);
const libPackageJSONPath = resolve(libRootPath, 'package.json');

module.exports = {
  nxLibPath,
  projectRootPath,
  projectRootPackageJSONPath,
  distRootPath,
  ditPackageJSONPath,
  libRootPath,
  libPackageJSONPath,
};
