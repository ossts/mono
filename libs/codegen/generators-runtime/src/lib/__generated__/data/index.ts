import * as commonEndpoints from '@ossts/codegen/generators/common/endpoints';
import * as commonModels from '@ossts/codegen/generators/common/models';
import * as utils from '@ossts/codegen/generators/utils';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

export * from './knownGlobalHelpers';

export const generatorImportPaths: Record<string, DictionaryWithAny> = {
  'common/endpoints': commonEndpoints,
  'common/models': commonModels,
  utils: utils,
};
