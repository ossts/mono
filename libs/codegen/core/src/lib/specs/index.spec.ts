import path from 'node:path';

import type { PathOrFileDescriptor } from 'fs-extra';
import type { Test } from 'vitest';
import { describe, it } from 'vitest';

import type { AbstractGeneratorSettings } from '@ossts/codegen/common';
import { mockJSONSchemaV3, petStoreSchema } from '@ossts/codegen/common';
import { emptyFn } from '@ossts/shared/typescript/helpers';

import { generate } from '..';

const generatorsSettings: AbstractGeneratorSettings = {
  preventCleanup: true,
};

const generateMockOutputPath = ({ name, suite: { name: suiteName } }: Test) => {
  return path.resolve(__dirname, '__snapshots__', suiteName, name);
};

// https://vitest.dev/api/vi.html#vi-mock
vi.mock('fs-extra', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await importOriginal<typeof import('fs-extra')>();

  return {
    ...mod,

    ensureFile: emptyFn,
    ensureFileSync: emptyFn,
    writeFile: async (
      path: PathOrFileDescriptor,
      content: string | NodeJS.ArrayBufferView
    ) => {
      expect(content).toMatchFileSnapshot(path.toString() + '.snap');
    },
  };
});

describe('Basic', () => {
  it('Should work with default parameters', async ({ meta }) => {
    await generate({
      input: mockJSONSchemaV3,
      output: generateMockOutputPath(meta),
      generatorsSettings,
    });
  });
});

describe('FakerJS', () => {
  it('Should change output based on provided settings', async ({ meta }) => {
    await generate({
      input: petStoreSchema,
      output: generateMockOutputPath(meta),
      generatorsSettings,
      generators: [
        {
          name: 'mock/faker-js',
          settings: {
            fakerGenerators: {
              generate: (type, { fullPath, params }) => {
                if (type.name === 'userStatus') {
                  return `.helpers.fake('published')`;
                }
                if (fullPath[0] === 'user' && fullPath[1] === 'id') {
                  return `.string.fromCharacters(${params})`;
                }

                return null;
              },
              pathBased: {
                id: '.string.uid($$params$$)',
              },
            },
            fakerParamsGenerators: {
              pathBased: {
                name: `10`,
                User: {
                  id: `'abc_xyz', { min: 5, max: 20 }`,
                  email: `{provider: 'example.fakerjs.dev', allowSpecialCharacters: true}`,
                },
              },
            },
          },
        },
      ],
    });
  });
});
