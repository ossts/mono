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
        AllApiEntities: {
          dataPath: '',
          nameFieldOrFn: () => 'AllApiEntities',
        },
        AllApiModels: {
          dataPath: '',
          nameFieldOrFn: () => 'AllApiModels',
        },
      },
    });
  }

  override settings?: CommonModelsGeneratorSettings;
}
