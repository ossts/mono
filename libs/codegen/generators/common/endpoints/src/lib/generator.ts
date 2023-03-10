import { camelCase } from 'lodash';

import type { AbstractGeneratorWithName } from '@ossts/codegen/common';
import { AbstractGenerator } from '@ossts/codegen/common';
import { mergeObjectsWithSameShape } from '@ossts/shared/typescript/helpers';

import type {
  CommonEndpointsGeneratorConfig,
  CommonEndpointsGeneratorSettings,
} from './types';

export const commonEndpointsGeneratorName = 'common/endpoints' as const;

export class CommonEndpointsGenerator
  extends AbstractGenerator
  implements AbstractGeneratorWithName
{
  name = commonEndpointsGeneratorName;

  constructor(config?: CommonEndpointsGeneratorConfig) {
    super();

    mergeObjectsWithSameShape(this, {}, config, {
      settings: {
        createExportAllWithSuffix: 'Endpoints',
        ...config?.settings,
      },
      entriesRenderCfg: {
        endpoint: {
          dataPath: 'services',
          nameFieldOrFn: (data) => camelCase(data['name']),
        },
      },
      dependsOn: ['utils', ...(config?.dependsOn ?? [])],
    });
  }

  override settings?: CommonEndpointsGeneratorSettings;
}
