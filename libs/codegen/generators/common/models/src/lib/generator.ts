import type { AbstractGeneratorWithName } from '@ossts/codegen/common';
import { AbstractGenerator } from '@ossts/codegen/common';
import { mergeObjectsWithSameShape } from '@ossts/shared/typescript/helpers';

import type {
  CommonModelsGeneratorConfig,
  CommonModelsGeneratorSettings,
} from './types';

export const commonModelsGeneratorName = 'common/models' as const;

export class CommonModelsGenerator
  extends AbstractGenerator
  implements AbstractGeneratorWithName
{
  name = commonModelsGeneratorName;

  constructor(config?: CommonModelsGeneratorConfig) {
    super();

    mergeObjectsWithSameShape(this, {}, config, {
      dependsOn: ['utils', ...(config?.dependsOn ?? [])],
      entriesRenderCfg: {
        modelsWithRefIdsAllowed: {
          dataPath: 'models',
          nameFieldOrFn: (data) => `${data['name']}WithRefIdsAllowed`,
        },
        modelsWithRefIdsOnly: {
          dataPath: 'models',
          nameFieldOrFn: (data) => `${data['name']}WithRefIdsOnly`,
        },
        AllApiEntities: {
          dataPath: '',
          nameFieldOrFn: () => 'AllApiEntities',
        },
        AllApiModels: {
          dataPath: '',
          nameFieldOrFn: () => 'AllApiModels',
        },
        apiEntityToPrimaryKeyMapping: {
          dataPath: '',
          nameFieldOrFn: () => 'apiEntityToPrimaryKeyMapping',
        },
        responseModels: {
          dataPath: 'services',
          nameFieldOrFn: (data) => `${data['name']}Responses`,
        },
        operationsParams: {
          dataPath: 'services',
          nameFieldOrFn: (data) => `${data['name']}OperationsParams`,
        },
      },
    });
  }

  declare settings?: CommonModelsGeneratorSettings;
}
