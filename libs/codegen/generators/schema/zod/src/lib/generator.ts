import type { AbstractGeneratorWithName } from '@ossts/codegen/common';
import { AbstractGenerator } from '@ossts/codegen/common';
import { mergeObjectsWithSameShape } from '@ossts/shared/typescript/helpers';

import type {
  SchemaZodGeneratorConfig,
  SchemaZodGeneratorSettings,
} from './types';

export const schemaZodGeneratorName = 'schema/zod' as const;

export class SchemaZodGenerator
  extends AbstractGenerator
  implements AbstractGeneratorWithName
{
  name = schemaZodGeneratorName;

  constructor(config?: SchemaZodGeneratorConfig) {
    super();

    mergeObjectsWithSameShape(
      this,
      {
        entriesRenderCfg: {
          schema: {
            dataPath: 'models',
            nameFieldOrFn: (data) => `${data['name'].replace(/Schema/g, '')}`,
          },
          entityNameTo: {
            dataPath: '',
            nameFieldOrFn: () => 'entityNameTo',
          },
        },
        dependsOn: ['utils', 'common/models', ...(config?.dependsOn ?? [])],
      },
      config
    );
  }

  override settings?: SchemaZodGeneratorSettings;
}
