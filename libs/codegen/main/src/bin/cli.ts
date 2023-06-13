import chalk from 'chalk';
import { InvalidOptionArgumentError, Option, program } from 'commander';

import {
  abstractGeneratorFormatters,
  schemaParsers,
} from '@ossts/codegen/common';

import { processGenerators, readJSONConfig } from './helpers';

program
  .name('codegen')
  .usage('[options]')
  .option(
    '-i, --input <value>',
    'OpenAPI specification. Can be a path, url or string content'
  )
  .option(
    '--jsonConfig <path>',
    'Path to JSON configuration file',
    readJSONConfig
  )
  .option('-o, --output <value>', 'Output directory')
  .option(
    '-g, --generators <value>',
    'Set of generators to use',
    processGenerators,
    ['*']
  )
  .addOption(
    new Option(
      '--schemaType <value>',
      'Schema type name. Defaults to "openapi"'
    ).choices(schemaParsers)
  )
  .option(
    '-s',
    '--suppressWarnings',
    'Set to `true` to prevent any warnings on all generators. This can be overridden on generator level'
  )
  .option(
    '--disableLinters',
    'Set to `true` to add comments which will disable linters for generated files'
  )
  .option(
    '--useUnionTypes',
    'Set to `true` to generate unions instead of enums'
  )
  .option(
    '--useDistinctParams',
    'Set to `true` to generate separate function parameters instead of one object type parameter'
  )
  .addOption(
    new Option(
      '--formatter <value>',
      'Formatter to use before outputting template results. Defaults to "prettier"'
    ).choices(abstractGeneratorFormatters)
  )
  .action((options) => {
    if (!options.input && !options.jsonConfig) {
      throw new InvalidOptionArgumentError(
        `Either "input" or "jsonConfig" should be provided`
      );
    } else if (
      !options.suppressWarnings &&
      options.input &&
      options.jsonConfig
    ) {
      console.warn(
        chalk.yellow('"input" option is ignored if "jsonConfig" is provided')
      );
    }
  });

export { program };
