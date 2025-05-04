import { camelCase } from 'lodash';

import type { AbstractGeneratorWithName } from '@ossts/codegen/common';
import { AbstractGenerator } from '@ossts/codegen/common';
import { mergeObjectsWithSameShape } from '@ossts/shared/typescript/helpers';

import type { MockMswGeneratorConfig, MockMswGeneratorSettings } from './types';

export const mockMswGeneratorName = 'mock/msw' as const;

export class MockMswGenerator
  extends AbstractGenerator
  implements AbstractGeneratorWithName
{
  name = mockMswGeneratorName;

  constructor(config?: MockMswGeneratorConfig) {
    super();

    mergeObjectsWithSameShape(this, {}, config, {
      settings: {
        withEntryExportAll: true,
        preventExportNameCapitalization: true,
        ...config?.settings,
      },
      entriesRenderCfg: {
        endpoint: {
          dataPath: 'services',
          nameFieldOrFn: (data) => camelCase(data['name']),
        },
        types: {
          dataPath: '',
          nameFieldOrFn: () => 'types',
        },
        server: {
          dataPath: '',
          nameFieldOrFn: () => 'server',
        },
        helpers: {
          dataPath: '',
          nameFieldOrFn: () => 'helpers',
        },
      },
      dependsOn: [
        'utils',
        'common/models',
        'common/endpoints',
        'schema/zod',
        ...(config?.dependsOn ?? []),
      ],
    });
  }

  declare settings?: MockMswGeneratorSettings;
}
