import {
  commonEndpointsDefaultConfig,
  commonEndpointsGeneratorName,
} from '@ossts/codegen/generators/common/endpoints';
import {
  commonModelsDefaultConfig,
  commonModelsGeneratorName,
} from '@ossts/codegen/generators/common/models';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

import type { GeneratorNameBuiltIn } from '../../types';
import type { BuiltInGenerators } from '../types';

export * from './precompiledTemplatesStats';

export const generatorNames = [
  commonModelsGeneratorName,
  commonEndpointsGeneratorName,
] as const;

// TODO: Update to satisfies when TS updated to version >= 4.9 in NX
export const generatorsDefaultConfigs: Record<
  GeneratorNameBuiltIn,
  BuiltInGenerators
> = {
  [commonModelsGeneratorName]: commonModelsDefaultConfig,
  [commonEndpointsGeneratorName]: commonEndpointsDefaultConfig,
};

export const generatorImportPaths: Record<
  string,
  () => Promise<DictionaryWithAny>
> = {
  'common/endpoints': () =>
    import('@ossts/codegen/generators/common/endpoints'),
  'common/models': () => import('@ossts/codegen/generators/common/models'),
};
