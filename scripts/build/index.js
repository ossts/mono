const { updateAndCopyPackageJSON } = require('./update-and-copy-package-json');
const { copyReleaseResources } = require('./copy-release-resources');

updateAndCopyPackageJSON();
copyReleaseResources();
