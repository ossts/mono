import { generate } from '..';
import { entityToPrimaryKeyNameDefaultMapping } from '../debug/settings';
import { generateMockOutputPath, generatorsSettings } from './helpers.spec';
import { parsedSchemas } from './setup.spec';

describe('Models', () => {
  it('Should work with default settings', async ({ task }) => {
    await generate({
      input: '',
      parsedSchema: parsedSchemas.pet,
      output: generateMockOutputPath(task),
      generatorsSettings,
      generators: [
        {
          name: 'common/models',
        },
      ],
    });

    // just to make vitest runner happy
    expect(true).toBe(true);
  });

  it('Should support primaryKey overrides', async ({ task }) => {
    const consoleMock = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    await generate({
      input: '',
      parsedSchema: parsedSchemas.pet,
      output: generateMockOutputPath(task),
      generatorsSettings,
      generators: [
        {
          name: 'common/models',
          settings: {
            entityToPrimaryKeyNameMapping: {
              ...entityToPrimaryKeyNameDefaultMapping.pet,
              Order: 'orderId',
              Tag: 'name',
            },
          },
        },
      ],
    });

    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenLastCalledWith(
      expect.stringMatching('Property id will be ignored'),
    );

    // just to make vitest runner happy
    expect(true).toBe(true);
  });
});
