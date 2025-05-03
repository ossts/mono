import { generate } from '../';
import { entityToPrimaryKeyNameDefaultMapping, inputs } from './settings';

const input: keyof typeof inputs = 'pet';

generate({
  input: inputs[input],
  output: 'dist/tmp/codegen',
  generators: [
    {
      name: 'common/models',
      settings: {
        // primaryKeyName: 'uuid',
        entityToPrimaryKeyNameMapping:
          entityToPrimaryKeyNameDefaultMapping[input],
      },
    },
    {
      name: 'mock/faker-js',
      settings: {
        fakerGenerators: {
          pathBased: {
            id: '.number.int()',
          },
        },
      },
    },
    {
      name: 'mock/msw',
      settings: {},
    },
  ],
});
