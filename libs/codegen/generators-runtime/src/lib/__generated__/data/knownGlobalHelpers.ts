import { helpers as commonEndpointsHelpers } from '@ossts/codegen/generators/common/endpoints';
import { helpers as commonModelsHelpers } from '@ossts/codegen/generators/common/models';
import { helpers as utilsHelpers } from '@ossts/codegen/generators/utils';

export const knownGlobalHelpers = {
  commonEndpoints: commonEndpointsHelpers.globalHelpers,
  commonModels: commonModelsHelpers.globalHelpers,
  utils: utilsHelpers.globalHelpers,
};
