import {
  commonEndpointsDefaultConfig,
  commonEndpointsGeneratorName,
} from '@ossts/codegen/generators/common/endpoints';
import {
  commonModelsDefaultConfig,
  commonModelsGeneratorName,
} from '@ossts/codegen/generators/common/models';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

import type { BuiltInGenerators, GeneratorNameBuiltIn } from '../types';

export * from './knownGlobalHelpers';

export const generatorNames = [
  commonEndpointsGeneratorName,
  commonModelsGeneratorName,
] as const;

// TODO: Update to satisfies when TS updated to version >= 4.9 in NX
export const generatorsDefaultConfigs: Record<
  GeneratorNameBuiltIn,
  BuiltInGenerators
> = {
  [commonEndpointsGeneratorName]: commonEndpointsDefaultConfig,
  [commonModelsGeneratorName]: commonModelsDefaultConfig,
};

export const generatorImportPaths: Record<
  string,
  () => Promise<DictionaryWithAny>
> = {
  'common/endpoints': () =>
    import('@ossts/codegen/generators/common/endpoints'),
  'common/models': () => import('@ossts/codegen/generators/common/models'),
};
