import type { Dictionary } from '@ossts/shared/typescript/helper-types';

import type { GeneratorNameBuiltIn } from '../../__generated__';
import type { GeneratorEntriesRenderConfig } from './other';

export const abstractGeneratorFormatters = ['none', 'prettier'] as const;
export type AbstractGeneratorFormatters =
  (typeof abstractGeneratorFormatters)[number];

// this should match interface options below. Required in CLI tool
export const abstractGeneratorSettings = [
  'disableLinters',
  'useUnionTypes',
  'useDistinctParams',
  'withEntryExportAll',
  'withExportAll',
  'suppressWarnings',
  'exportAllSuffix',
  'preventExportNameCapitalization',
  'formatter',
] as const;

export interface AbstractGeneratorSettings {
  /**
   * Set to `true` to add comments which will disable linters for generated files
   */
  disableLinters?: boolean;

  /**
   * Set to `true` to generate unions instead of enums
   */
  useUnionTypes?: boolean;

  /**
   * Set to `true` to generate separate function parameters instead of one object type parameter
   */
  useDistinctParams?: boolean;

  /**
   * Set to `true` if you want to have export all statements for each generated entry.
   *
   * This will add in generator's `index.ts`
   *
   * import * as { [name][exportSuffix] } from './[name]';
   *
   * export { [name][exportSuffix] };
   *
   * Defaults to `false`
   */
  withEntryExportAll?: boolean;

  /**
   * Set to `true` or config object to generate export statement
   * which contains all exports of this generator.
   */
  withExportAll?: AbstractGeneratorSettingsExportAll;

  /**
   * Set to true to prevent any warnings on all generators.
   */
  suppressWarnings?: boolean;

  /**
   * Unique identifier to add after name in export all name.
   *
   * Defaults to `Exports`
   */
  exportAllSuffix?: string;

  /**
   * Set this to `true` if first letter in export name inside of index.ts shouldn't be capitalized
   */
  preventExportNameCapitalization?: boolean;

  /**
   * Formatter to use before outputting template results.
   *
   * `prettier` - use Prettier (default)
   *
   * `none` - don't format result
   *
   * `(content: string) => string` - custom formatter function
   */
  formatter?: AbstractGeneratorFormatters | AbstractGeneratorCustomFormatter;

  /**
   * Unique namespace identifier of this generator.
   *
   * This will be passed to Handlebars and should be added to each generated entity,
   * which will make sure that there are no naming collisions
   */
  globalNS?: string;

  /**
   * Set to `true` if previous generated results should be persisted.
   *
   * Defaults to `false`, which will clear generator's dist folder before execution.s
   */
  preventCleanup?: boolean;
}

export type AbstractGeneratorSettingsExportAll =
  | boolean
  | {
      /**
       * Name of export all variable
       */
      name: string;
      /**
       * Name of export all type variable
       */
      typeName?: string;
    };

export type AbstractGeneratorCustomFormatter = (content: string) => string;

export abstract class AbstractGenerator {
  /**
   * Setting for current generator.
   */
  settings?: AbstractGeneratorSettings;

  /**
   * Set this to `true` to disable specific generator
   *
   * Defaults to `false`
   */
  disabled?: boolean;

  /**
   * Path to generator source code.
   *
   * If not provided, generator `name` will be used.
   *
   * Folder with this path should contain at least `templates` folder.
   */
  generatorPath?: string;

  /**
   * Path into which results of this generator should be written
   *
   * By default generator `name` field is used
   *
   * Absolute path can be provided as well.
   */
  outputPath?: string;

  /**
   * Template engine entry files rendering config.
   *
   * This will override internal config and config extracted from entry filename
   */
  entriesRenderCfg?: Dictionary<GeneratorEntriesRenderConfig>;

  /**
   * Set this to `true` if only globalHelpers from generator should be registered.
   *
   * This will also prevent entries from rendering
   */
  helpersOnly?: boolean;

  /**
   * Generators required for this generator to work
   */
  dependsOn?: GeneratorNameBuiltIn[];
}

/**
 * Adds name field to interface.
 * It's moved to separate mode to prevent issue with distinct unions name autocompletion
 */
export interface AbstractGeneratorName {
  /**
   * Name of this generator. Should have unique value across all generators.
   *
   * Will be used as default value for generator root folder path unless `generatorPath` is provided.
   *
   * Will be used as default value for dist folder path unless `outputPath` is provided.
   */
  name: string;
}

/**
 * This interface should be as extend target for all built-in generators
 */
export type AbstractGeneratorWithName = AbstractGenerator &
  AbstractGeneratorName;

/**
 * List of names that mean: "use all generators"
 */
export const generatorsAll = ['*', 'all'] as const;

/**
 * This is an internal helper type to prevent duplication
 */
export type AbstractGeneratorAll = (typeof generatorsAll)[number];

export type AbstractGeneratorWithAll = AbstractGenerator | AbstractGeneratorAll;
