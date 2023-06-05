import { program } from 'commander';

import { processGenerators } from './helpers';

program
  .name('codegen')
  .usage('[options]')
  .requiredOption(
    '-i, --input <value>',
    'OpenAPI specification. Can be a path, url or string content (required)'
  )
  .option('-o, --output [value]', 'Output directory')
  .option(
    '--parseOnly',
    'Set this to true to only run parser logic and return result'
  )
  .requiredOption(
    '-g, --generators <value>',
    'Set of generators to use',
    processGenerators,
    ['*']
  );

export { program };
