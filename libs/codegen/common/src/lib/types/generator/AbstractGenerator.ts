import type {
  Dictionary,
  DictionaryWithAny,
} from '@ossts/shared/typescript/helper-types';

import type { GeneratorNameBuiltIn } from '../../__generated__';
import type { CodegenHandlebarsHelperWrapper } from '../handlebars';
import type {
  GeneratorHelpersExportType,
  GeneratorTemplatesExportType,
} from './GeneratorExportTypes';
import type { GeneratorEntriesRenderConfig } from './other';

export const abstractGeneratorFormatters = ['none', 'prettier'] as const;
export type AbstractGeneratorFormatters =
  (typeof abstractGeneratorFormatters)[number];

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
   * Formatter to use before outputting template results.
   *
   * `prettier` - use Prettier (default)
   *
   * `none` - don't format result
   *
   * `(content: string) => string` - custom formatter function
   */
  formatter?: AbstractGeneratorFormatters | AbstractGeneratorCustomFormatter;
}

export type AbstractGeneratorCustomFormatter = (content: string) => string;

export abstract class AbstractGenerator {
  /**
   * Setting for current generator.
   */
  settings?: AbstractGeneratorSettings;

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
   * Set to true to prevent any warnings for this generator
   *
   * Also can be used to override global `suppressWarnings` setting
   */
  suppressWarnings?: boolean;

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
   * Set of templates for this generator
   */
  templates?: Partial<Record<GeneratorTemplatesExportType, DictionaryWithAny>>;

  /**
   * Set of helpers for this generator
   */
  helpers?: Partial<
    Record<
      GeneratorHelpersExportType,
      Dictionary<CodegenHandlebarsHelperWrapper>
    >
  >;

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
