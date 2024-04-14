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

    mergeObjectsWithSameShape(this, {}, config, {
      entriesRenderCfg: {
        schema: {
          dataPath: 'models',
          nameFieldOrFn: (data) => `${data['name']}Schema`,
        },
      },
      dependsOn: ['utils', 'common/models', ...(config?.dependsOn ?? [])],
    });
  }

  override settings?: SchemaZodGeneratorSettings;
}
