import { Faker, en } from '@faker-js/faker';

import { generate } from '..';
import { entityToPrimaryKeyNameDefaultMapping } from '../debug/settings';
import {
  disableFSMock,
  generateTempOutputPath,
  generatorsSettings,
} from './helpers.spec';
import { parsedSchemas } from './setup.spec';

describe('MSW', () => {
  it(`Should return pregenerated data`, async ({ task, onTestFinished }) => {
    // we want files to be created normally, because we will use generated JS here
    const { fsExtra, reenableFSMock } = await disableFSMock();

    const output = generateTempOutputPath(task);

    await generate({
      input: '',
      parsedSchema: parsedSchemas.pet,
      output,
      generatorsSettings,
      generators: [
        {
          name: 'common/models',
          settings: {
            entityToPrimaryKeyNameMapping:
              entityToPrimaryKeyNameDefaultMapping.pet,
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
        },
      ],
    });

    const { getServer, entityToDataMap, getPetMockFakerJs } = await import(
      output
    );

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

    const baseUrl = 'http://localhost:3003';

    getServer({
      baseUrl,
      // enableDebugLogging: true,
      // entityToDataMap,
      persistence: {
        initializerParams: {
          generateEntitiesCount: {
            default: 3,
            ApiResponse: 0,
          },
          generatorParams: {
            faker,
            fakerParams: {
              probability: 1,
            },
          },
        },
      },
    }).listen({
      onUnhandledRequest: (req: any) => {
        console.log(`unhandled request intercepted => `, req);
      },
    });

    const petsMap = entityToDataMap.get('Pet');
    const tagsMap = entityToDataMap.get('Tag');
    const categoriesMap = entityToDataMap.get('Category');
    expect(petsMap.size).toBe(3);
    expect(tagsMap.size).toBe(3);
    expect(categoriesMap.size).toBe(6);

    // MARK: --- LIST ---
    const listResponse = await fetch(`${baseUrl}/pet/findByStatus`);
    const listData = await listResponse.json();
    expect(listResponse.ok).toBe(true);
    expect(listResponse.status).toBe(200);
    expect(listData.length).toBe(3);
    expect(listData).toMatchSnapshot();

    // MARK: --- DETAIL ---

    // this ID will always be available due to seed
    const detailResponse = await fetch(`${baseUrl}/pet/586467142318126`);
    const detailData = await detailResponse.json();
    expect(detailResponse.ok).toBe(true);
    expect(detailData).toMatchSnapshot();

    // MARK: --- CREATE ---
    const newPetForCreate = getPetMockFakerJs({
      faker,
      fakerParams: {
        probability: 1,
      },
      mode: 'standalone',
    });
    const createResponse = await fetch(`${baseUrl}/pet`, {
      method: 'POST',
      body: JSON.stringify(newPetForCreate),
    });
    const createData = await createResponse.json();
    expect(createResponse.ok).toBe(true);
    expect(createResponse.status).toBe(200);
    expect(createData).toBeNull();
    expect(petsMap.size).toBe(4);
    expect(tagsMap.size).toBe(4);
    expect(categoriesMap.size).toBe(7);

    // MARK: --- UPDATE ---
    const newPetForUpdate = getPetMockFakerJs({
      faker,
      fakerParams: {
        probability: 1,
      },
      mode: 'standalone',
    });
    newPetForUpdate.id = 5035956471177324;
    const updateResponse = await fetch(`${baseUrl}/pet`, {
      method: 'PUT',
      body: JSON.stringify(newPetForUpdate),
    });
    await updateResponse.json();
    expect(createResponse.ok).toBe(true);
    expect(createResponse.status).toBe(200);
    expect(createData).toBeNull();
    expect(petsMap.size).toBe(4);
    expect(tagsMap.size).toBe(5);
    expect(categoriesMap.size).toBe(8);
    expect(petsMap.get(newPetForUpdate.id)).toStrictEqual(newPetForUpdate);

    // MARK: --- DELETE ---
    // expect "success"
    const deleteResponse = await fetch(`${baseUrl}/pet/5035956471177324`, {
      method: 'DELETE',
    });
    const deleteData = await deleteResponse.json();
    expect(deleteResponse.ok).toBe(true);
    expect(deleteData).toBeNull();
    expect(petsMap.size).toBe(3);

    // expect error "not found"
    const deleteNotFoundResponse = await fetch(
      `${baseUrl}/pet/5035956471177324`,
      {
        method: 'DELETE',
      }
    );
    expect(deleteNotFoundResponse.ok).toBe(false);
    expect(deleteNotFoundResponse.status).toBe(400);
    expect(deleteNotFoundResponse).not.toBe('');
    expect(petsMap.size).toBe(3);

    // MARK: --- CLEANUP ---

    // !!!IMPORTANT!!! don't forget to restore mocked FS to write results as snapshots
    reenableFSMock();

    // comment this to see generated FakerJS generators used in this test
    // but don't for get to restore this removal call to prevent unnecessary cluttering during CI
    onTestFinished(async () => {
      await fsExtra.remove(output);
    });
  });
});
