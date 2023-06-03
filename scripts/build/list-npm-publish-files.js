const { execSync } = require('child_process');

const { distRootPath } = require('./paths');

module.exports.listNPMPublishFiles = async () => {
  const currentDir = process.cwd();
  process.chdir(distRootPath);
  execSync('npm pack --dry-run');
  process.chdir(currentDir);
};
