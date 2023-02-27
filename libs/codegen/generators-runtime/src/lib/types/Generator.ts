import type { LiteralUnion, SetRequired } from 'type-fest';

import type {
  AbstractExternalGenerator,
  AbstractExternalGeneratorUXName,
  AbstractExternalGeneratorWithName,
  AbstractGeneratorAll,
  AbstractGeneratorWithName,
} from '@ossts/codegen/common';

import type { BuiltInGenerators, generatorNames } from '../__generated__';

export type GeneratorNameBuiltIn = (typeof generatorNames)[number];
export type GeneratorNameExternal<
  TGenerators extends AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName
> = TGenerators['name'];

/**
 * All generators
 */
export type GeneratorName<
  TGenerators extends AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName
> = LiteralUnion<
  GeneratorNameBuiltIn | GeneratorNameExternal<TGenerators>,
  string
>;

/**
 * All generators without the one that is used for creating external generators
 */
export type GeneratorsWithAllInternal =
  | AbstractGeneratorAll
  | BuiltInGenerators
  | AbstractExternalGeneratorUXName;

/**
 * All available internal generators with addition of external generators
 */
export type GeneratorsWithAll =
  | GeneratorsWithAllInternal
  | AbstractExternalGenerator;

/**
 * All possible generators, including those that passed as generic ones
 */
export type AllGenerators<
  TGenerators extends AbstractExternalGenerator = AbstractExternalGenerator
> = AbstractGeneratorWithName | TGenerators;

/**
 * All possible generators, with required parameters marked as required
 */
export type AllGeneratorsResolvedParams<
  TGenerators extends AbstractExternalGenerator = AbstractExternalGenerator
> = SetRequired<
  AllGenerators<TGenerators>,
  keyof Pick<AbstractExternalGenerator, 'outputPath' | 'generatorPath'>
>;
