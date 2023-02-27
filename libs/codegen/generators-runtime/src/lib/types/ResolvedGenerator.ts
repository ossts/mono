import type {
  AbstractExternalGenerator,
  AbstractExternalGeneratorWithName,
  GeneratorEntriesRenderConfig,
} from '@ossts/codegen/common';
import type { Dictionary } from '@ossts/shared/typescript/helper-types';

import type { AllGeneratorsResolvedParams, GeneratorName } from './Generator';

/**
 * Generator with resolved templates
 */
export type ResolvedGenerator<
  TGenerators extends AbstractExternalGenerator = AbstractExternalGenerator
> = AllGeneratorsResolvedParams<TGenerators> & {
  /**
   * Global name for this generator.
   *
   * This will be used to namespace global helpers and partials
   */
  globalName: string;

  /**
   * Handlebars copy with all entities preregistered
   */
  handlebarsInstance?: typeof Handlebars;

  /**
   * Template engine entry files resolved rendering config.
   *
   * This will hold final configuration with all configs merged and resolved.
   */
  resolvedEntriesRenderCfg?: Dictionary<GeneratorEntriesRenderConfig>;
};

export type ResolvedGeneratorsMap<
  TGenerators extends AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName
> = Map<GeneratorName<TGenerators>, ResolvedGenerator<TGenerators>>;
