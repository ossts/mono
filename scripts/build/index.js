const { updateAndCopyPackageJSON } = require('./update-and-copy-package-json');
const { copyReleaseResources } = require('./copy-release-resources');
const { listNPMPublishFiles } = require('./list-npm-publish-files');

(async () => {
  await updateAndCopyPackageJSON();
  await copyReleaseResources();
  await listNPMPublishFiles();
})();
