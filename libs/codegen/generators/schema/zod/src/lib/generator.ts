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
          schemaWithRefIdsAllowed: {
            dataPath: 'models',
            nameFieldOrFn: (data) =>
              `${data['name'].replace(/Schema/g, '')}WithRefIdsAllowed`,
          },
          schemaWithRefIdsOnly: {
            dataPath: 'models',
            nameFieldOrFn: (data) =>
              `${data['name'].replace(/Schema/g, '')}WithRefIdsOnly`,
          },
          entityNameTo: {
            dataPath: '',
            nameFieldOrFn: () => 'entityNameTo',
          },
          entityNameToWithRefIdsOnly: {
            dataPath: '',
            nameFieldOrFn: () => 'entityNameToWithRefIdsOnly',
          },
          entityNameToWithRefIdsAllowed: {
            dataPath: '',
            nameFieldOrFn: () => 'entityNameToWithRefIdsAllowed',
          },
        },
        dependsOn: ['utils', 'common/models', ...(config?.dependsOn ?? [])],
      },
      config,
    );
  }

  declare settings?: SchemaZodGeneratorSettings;
}
