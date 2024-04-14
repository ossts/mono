import chalk from 'chalk';
import { InvalidOptionArgumentError, Option, program } from 'commander';

import type { AbstractGeneratorSettings } from '@ossts/codegen/common';
import {
  abstractGeneratorFormatters,
  abstractGeneratorSettings,
  schemaParsers,
} from '@ossts/codegen/common';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

import type { Config } from '..';
import { processGenerators, readJSONConfig } from './helpers';

type Options = Config & { jsonConfig?: boolean } & AbstractGeneratorSettings;

export const createProgram = (version: string) => {
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
      '-s, --suppressWarnings',
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

  program.version(version).parse();

  const opts = program.opts<Options>();

  // We need to move some options into generatorSettings object
  if (!opts.jsonConfig) {
    const generatorsSettings: DictionaryWithAny = {};

    abstractGeneratorSettings.forEach((name) => {
      if (!Object.prototype.hasOwnProperty.call(opts, name)) return;
      generatorsSettings[name] = opts[name];
      delete opts[name];
    });

    opts.generatorsSettings = generatorsSettings;
  }

  const options = opts.jsonConfig ?? opts;

  return { program, options };
};
