import { describe, it } from 'vitest';

import { generate } from '..';
import { entityToPrimaryKeyNameDefaultMapping } from '../debug/settings';
import { generateMockOutputPath, generatorsSettings } from './helpers.spec';
import { parsedSchemas } from './setup.spec';

describe('Basic', () => {
  it('Should work with default parameters', async ({ task }) => {
    await generate({
      input: '',
      parsedSchema: parsedSchemas.complex,
      output: generateMockOutputPath(task),
      generatorsSettings,
      generators: [
        '*',
        {
          name: 'common/models',
          settings: {
            entityToPrimaryKeyNameMapping:
              entityToPrimaryKeyNameDefaultMapping.complex,
          },
        },
        // we test this separately because it generates random data
        // without properer setup
        {
          name: 'mock/msw',
          disabled: true,
        },
      ],
    });

    // just to make vitest runner happy
    expect(true).toBe(true);
  });
});
