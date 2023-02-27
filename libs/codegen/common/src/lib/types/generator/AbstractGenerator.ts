import type {
  Dictionary,
  DictionaryWithAny,
} from '@ossts/shared/typescript/helper-types';

import type { GeneratorExportType } from './GeneratorExportType';
import type { GeneratorEntriesRenderConfig } from './other';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AbstractGeneratorSettings {}

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
  templates?: Partial<Record<GeneratorExportType, DictionaryWithAny>>;
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
 * This is an internal helper type to prevent duplication
 */
export type AbstractGeneratorAll = '*' | 'all';

export type AbstractGeneratorWithAll = AbstractGenerator | AbstractGeneratorAll;
