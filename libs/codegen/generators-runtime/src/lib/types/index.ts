import type {
  AbstractExternalGeneratorWithName,
  AbstractGenerateParams,
} from '@ossts/codegen/common';

import type { GeneratorName, GeneratorsWithAll } from './Generator';
import type { ResolvedGeneratorsMap } from './ResolvedGenerator';

export * from './Generator';
export * from './ResolvedGenerator';

export type GenerateParams<
  TGenerators extends AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName
> = AbstractGenerateParams<
  GeneratorsWithAll | TGenerators,
  ResolvedGeneratorsMap<TGenerators>,
  GeneratorName<TGenerators>
>;
