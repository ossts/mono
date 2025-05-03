import { helpers as commonEndpointsHelpers } from '@ossts/codegen/generators/common/endpoints';
import { helpers as commonModelsHelpers } from '@ossts/codegen/generators/common/models';
import { helpers as mockFakerJsHelpers } from '@ossts/codegen/generators/mock/faker-js';
import { helpers as mockMswHelpers } from '@ossts/codegen/generators/mock/msw';
import { helpers as schemaZodHelpers } from '@ossts/codegen/generators/schema/zod';
import { helpers as utilsHelpers } from '@ossts/codegen/generators/utils';

export const knownGlobalHelpers = {
  commonEndpoints: commonEndpointsHelpers.globalHelpers,
  commonModels: commonModelsHelpers.globalHelpers,
  schemaZod: schemaZodHelpers.globalHelpers,
  utils: utilsHelpers.globalHelpers,
  mockFakerJs: mockFakerJsHelpers.globalHelpers,
  mockMsw: mockMswHelpers.globalHelpers,
};
