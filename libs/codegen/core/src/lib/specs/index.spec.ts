import path from 'node:path';

import type { PathOrFileDescriptor } from 'fs-extra';
import type { RunnerTask } from 'vitest';
import { describe, it } from 'vitest';

import { Faker, en } from '@faker-js/faker';

import type { AbstractGeneratorSettings } from '@ossts/codegen/common';
import { mockJSONSchemaV3, petStoreSchema } from '@ossts/codegen/common';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';
import { emptyFn } from '@ossts/shared/typescript/helpers';

import { generate } from '..';

const generatorsSettings: AbstractGeneratorSettings = {
  preventCleanup: true,
};

const generateMockOutputPath = ({ name, suite }: RunnerTask) => {
  return path.resolve(__dirname, '__snapshots__', suite?.name ?? '', name);
};

const generateTempOutputPath = ({ name, suite }: RunnerTask) => {
  return path.resolve(__dirname, 'tmp', suite?.name ?? '', name);
};

// https://vitest.dev/api/vi.html#vi-mock
vi.mock(import('fs-extra'), async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await importOriginal();

  return {
    ...mod,

    ensureFile: emptyFn,
    ensureFileSync: emptyFn,
    writeFile: (async (
      path: PathOrFileDescriptor,
      content: string | NodeJS.ArrayBufferView
    ) => {
      await expect(content).toMatchFileSnapshot(path.toString() + '.snap');
    }) as any,
  };
});

const encodeJSON = (data: DictionaryWithAny): string =>
  JSON.stringify(data, (key, value) => {
    if (value instanceof Map || value instanceof Set) {
      return [...value];
    }

    return value;
  });

const disableFSMock = async () => {
  const fsExtra = await import('fs-extra');

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actualFsExtra = await vi.importActual<typeof import('fs-extra')>(
    'fs-extra'
  );

  const writeFileSpy = vi
    .spyOn(fsExtra, 'writeFile')
    .mockImplementation(actualFsExtra.writeFile);
  const ensureFileSpy = vi
    .spyOn(fsExtra, 'ensureFile')
    .mockImplementation(actualFsExtra.ensureFile);
  const ensureFileSyncSpy = vi
    .spyOn(fsExtra, 'ensureFileSync')
    .mockImplementation(actualFsExtra.ensureFileSync);

  // vi.restoreAllMocks();

  return {
    fsExtra,
    writeFileSpy,
    ensureFileSpy,
    ensureFileSyncSpy,
    reenableFSMock: () => {
      writeFileSpy.mockRestore();
      ensureFileSpy.mockRestore();
      ensureFileSyncSpy.mockRestore();
    },
  };
};

describe('Basic', () => {
  it('Should work with default parameters', async ({ task }) => {
    await generate({
      input: mockJSONSchemaV3,
      output: generateMockOutputPath(task),
      generatorsSettings,
    });
  });
});

describe('Models', () => {
  it('Should support primaryKey overrides', async ({ task }) => {
    await generate({
      input: petStoreSchema,
      output: generateMockOutputPath(task),
      generatorsSettings,
      generators: [
        {
          name: 'common/models',
          settings: {
            primaryKeyName: 'uuid',
            entityToPrimaryKeyNameMapping: {
              ApiResponse: '',
              Order: 'orderId',
              Tag: 'idTag',
            },
          },
        },
      ],
    });
  });
});

const fakerJSHelpersPathInTmp = `mock/faker-js/helpersMockFakerJs`;

// those should execute one after another. don't make this concurrent
// otherwise FS spies won't work as expected
describe('FakerJS', () => {
  it(`Should initialize required entities based on requested items count`, async ({
    task,
    onTestFinished,
  }) => {
    // we want files to be created normally, because we will use generated JS here
    const { fsExtra, reenableFSMock } = await disableFSMock();

    const output = generateTempOutputPath(task);

    await generate({
      input: petStoreSchema,
      output,
      generatorsSettings,
      generators: [
        {
          name: 'common/models',
          settings: {
            entityToPrimaryKeyNameMapping: {
              ApiResponse: '',
            },
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
      ],
    });

    const { initialize, entityToDataMap, modelDependenciesMap, modelRefsMap } =
      await import(`${output}/${fakerJSHelpersPathInTmp}`);

    const faker = new Faker({
      locale: [en],
    });

    // 300 - has Pet models with:
    // - category
    // - tags
    // - empty category and tags
    const seed = 300;

    // this is required to get same datetime values on each run
    faker.setDefaultRefDate(seed);
    faker.seed(seed);

    // here we generate data without resolving dependencies to make it possible
    // to reuse this as "initialData" and check both at the same time
    initialize({
      generateEntitiesCount: {
        default: 3,
        ApiResponse: 0,
      },
      noResolve: true,
      generatorParams: {
        faker,
      },
    });

    const generatedDataNoResolveStringified = encodeJSON(entityToDataMap);

    expect(generatedDataNoResolveStringified).toMatchSnapshot();

    // test restoring from initial and resolving dependencies
    initialize({
      initialData: JSON.parse(generatedDataNoResolveStringified),
    });

    const generatedDataResolvedStringified = encodeJSON(entityToDataMap);

    expect(generatedDataResolvedStringified).toMatchSnapshot();

    const modelDependenciesStringified = encodeJSON(modelDependenciesMap);
    const modelRefsStringified = encodeJSON(modelRefsMap);

    expect(modelDependenciesStringified).toMatchSnapshot();
    expect(modelRefsStringified).toMatchSnapshot();

    // !!!IMPORTANT!!! don't forget to restore mocked FS to write results as snapshots
    reenableFSMock();

    // comment this to see generated FakerJS generators used in this test
    // but don't for get to restore this removal call to prevent unnecessary cluttering during CI
    onTestFinished(async () => {
      await fsExtra.remove(output);
    });
  });

  it('Should change output based on provided settings', async ({ task }) => {
    await generate({
      input: petStoreSchema,
      output: generateMockOutputPath(task),
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
