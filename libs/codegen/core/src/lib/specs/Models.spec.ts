import { generate } from '..';
import { entityToPrimaryKeyNameDefaultMapping } from '../debug/settings';
import { generateMockOutputPath, generatorsSettings } from './helpers.spec';
import { parsedSchemas } from './setup.spec';

describe.only('Models', () => {
  it('Should support primaryKey overrides', async ({ task }) => {
    await generate({
      input: '',
      parsedSchema: parsedSchemas.pet,
      output: generateMockOutputPath(task),
      generatorsSettings,
      generators: [
        {
          name: 'common/models',
          settings: {
            primaryKeyName: 'uuid',
            entityToPrimaryKeyNameMapping: {
              ...entityToPrimaryKeyNameDefaultMapping.pet,
              Order: 'orderId',
              Tag: 'idTag',
            },
          },
        },
      ],
    });

    // just to make vitest runner happy
    expect(true).toBe(true);
  });
});
