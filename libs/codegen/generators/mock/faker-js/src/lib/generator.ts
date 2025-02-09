import type { AbstractGeneratorWithName } from '@ossts/codegen/common';
import { AbstractGenerator } from '@ossts/codegen/common';
import { mergeObjectsWithSameShape } from '@ossts/shared/typescript/helpers';

import type {
  MockFakerJsGeneratorConfig,
  MockFakerJsGeneratorSettings,
} from './types';

export const mockFakerJsGeneratorName = 'mock/faker-js' as const;

export class MockFakerJsGenerator
  extends AbstractGenerator
  implements AbstractGeneratorWithName
{
  name = mockFakerJsGeneratorName;

  constructor(config?: MockFakerJsGeneratorConfig) {
    super();

    mergeObjectsWithSameShape(
      this,
      {
        entriesRenderCfg: {
          schema: {
            dataPath: 'models',
            nameFieldOrFn: (data) => `${data['name'].replace(/Schema/g, '')}`,
          },
        },
        dependsOn: ['utils', 'common/models', ...(config?.dependsOn ?? [])],
      },
      config
    );
  }

  override settings?: MockFakerJsGeneratorSettings;
}
