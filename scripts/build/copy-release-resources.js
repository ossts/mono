const { resolve } = require('node:path');

const { copyFileSync } = require('fs-extra');

const { libRootPath, distRootPath, projectRootPath } = require('./paths');

module.exports.copyReleaseResources = async () => {
  copyFileSync(
    resolve(libRootPath, 'README.md'),
    resolve(distRootPath, 'README.md')
  );
  copyFileSync(
    resolve(projectRootPath, 'LICENSE'),
    resolve(distRootPath, 'LICENSE')
  );
};
