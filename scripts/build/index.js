const { updateAndCopyPackageJSON } = require('./update-and-copy-package-json');
const { copyReleaseResources } = require('./copy-release-resources');
const { listNPMPublishFiles } = require('./list-npm-publish-files');
const { generateJSONSchema } = require('./generate-json-schema');

(async () => {
  await updateAndCopyPackageJSON();
  await copyReleaseResources();
  await generateJSONSchema();

  await listNPMPublishFiles();
})();
