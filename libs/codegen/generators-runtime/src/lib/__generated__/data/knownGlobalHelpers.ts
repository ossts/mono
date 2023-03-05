import { helpers as commonEndpointsHelpers } from '@ossts/codegen/generators/common/endpoints';
import { helpers as commonModelsHelpers } from '@ossts/codegen/generators/common/models';

export const knownGlobalHelpers = {
  commonEndpoints: commonEndpointsHelpers.globalHelpers,
  commonModels: commonModelsHelpers.globalHelpers,
};
