import * as commonEndpoints from '@ossts/codegen/generators/common/endpoints';
import * as commonModels from '@ossts/codegen/generators/common/models';
import * as mockFakerJs from '@ossts/codegen/generators/mock/faker-js';
import * as mockMsw from '@ossts/codegen/generators/mock/msw';
import * as schemaZod from '@ossts/codegen/generators/schema/zod';
import * as utils from '@ossts/codegen/generators/utils';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

export * from './knownGlobalHelpers';

export const generatorImportPaths: Record<string, DictionaryWithAny> = {
  'common/endpoints': commonEndpoints,
  'common/models': commonModels,
  'schema/zod': schemaZod,
  utils: utils,
  'mock/faker-js': mockFakerJs,
  'mock/msw': mockMsw,
};
