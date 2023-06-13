const yargsParse = require('yargs-parser');

const { nxLibPath, withJSONSchema } = yargsParse(process.argv.slice(2));

module.exports = {
  nxLibPath,
  withJSONSchema,
};
