import { Faker, en } from '@faker-js/faker';

import { generate } from '..';
import { entityToPrimaryKeyNameDefaultMapping } from '../debug/settings';
import {
  disableFSMock,
  encodeJSON,
  generateMockOutputPath,
  generateTempOutputPath,
  generatorsSettings,
} from './helpers.spec';
import { parsedSchemas } from './setup.spec';

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
      input: '',
      parsedSchema: parsedSchemas.pet,
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
      await import(output);

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
      generatorParams: {
        faker,
        preventReferenceResolve: true,
      },
    });

    const generatedDataNoResolveStringified = encodeJSON(entityToDataMap);

    expect(generatedDataNoResolveStringified).toMatchSnapshot();

    // test restoring from initial and registering entities
    // this won't be an issue because we reset initial state on each `initialize` call
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

  it('Should support CRUD operations and keep track of entities with the relations', async ({
    task,
    onTestFinished,
  }) => {
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
      ],
    });

    const {
      initialize,
      entityToDataMap,
      modelDependenciesMap,
      modelRefsMap,
      removeEntityIfAllowed,
      getUserMockFakerJs,
      getPetMockFakerJs,
      getTagMockFakerJs,
      getCategoryMockFakerJs,
      registerEntityAndReturnId,
      createEntity,
      updateEntity,
    } = await import(output);

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

    initialize({
      generateEntitiesCount: {
        default: 3,
        ApiResponse: 0,
      },
      generatorParams: {
        faker,
      },
    });

    const petsMap = entityToDataMap.get('Pet');
    const tagsMap = entityToDataMap.get('Tag');
    const usersMap = entityToDataMap.get('User');
    const categoriesMap = entityToDataMap.get('Category');
    expect(petsMap.size).toBe(3);
    expect(tagsMap.size).toBe(3);
    expect(usersMap.size).toBe(3);
    expect(categoriesMap.size).toBe(4);
    expect(modelDependenciesMap.size).toBe(2);
    expect(modelRefsMap.size).toBe(2);

    // MARK: --- DELETE ---
    // 1. expect "success"
    const [isRemoved, deleteMessage] = removeEntityIfAllowed(
      'Pet',
      4895266431930164
    );
    expect(isRemoved).toBe(true);
    expect(deleteMessage).toBeUndefined();
    expect(petsMap.size).toBe(2);

    // 2. expect error "not found"
    const [isRemovedNotFound, deleteMessageNotFound] = removeEntityIfAllowed(
      'Pet',
      647875750
    );
    expect(isRemovedNotFound).toBe(false);
    expect(deleteMessageNotFound).not.toBe('');
    expect(petsMap.size).toBe(2);

    // 3. expect error and than success "is dependency"
    // 3.1. expect error
    const entityAsDependencyId = 8699624478886955;
    const refToModelAsDependency = tagsMap.get(entityAsDependencyId);
    const refsCountSetForRefAsDependency = modelRefsMap.get(
      refToModelAsDependency
    );
    expect(refsCountSetForRefAsDependency.size).toBe(1);
    const [isRemovedIsDependency, deleteMessageIsDependency] =
      removeEntityIfAllowed('Tag', entityAsDependencyId);
    expect(isRemovedIsDependency).toBe(false);
    expect(deleteMessageIsDependency).not.toBe('');
    expect(tagsMap.size).toBe(3);
    // 3.2. now we remove Pet which should free Tag "refToModelAsDependency" from removing
    expect(modelDependenciesMap.size).toBe(2);
    expect(modelRefsMap.size).toBe(2);
    const [isRemovedBlockingPet, deleteMessageBlockingPet] =
      removeEntityIfAllowed('Pet', 8438432109226822);
    expect(isRemovedBlockingPet).toBe(true);
    expect(deleteMessageBlockingPet).toBeUndefined();
    expect(petsMap.size).toBe(1);
    expect(modelDependenciesMap.size).toBe(1);
    expect(modelRefsMap.size).toBe(1);
    // ok blocking Pet removed, now we should be able to remove Tag
    expect(refsCountSetForRefAsDependency.size).toBe(0);
    const [isRemovedIsDependencySuccess, deleteMessageIsDependencySuccess] =
      removeEntityIfAllowed('Tag', entityAsDependencyId);
    expect(isRemovedIsDependencySuccess).toBe(true);
    expect(deleteMessageIsDependencySuccess).toBeUndefined();
    expect(tagsMap.size).toBe(2);

    // MARK: --- CREATE ---

    // 1. Simple create (no refs)
    // 1.1. this has no ID, so we intentionally skip it.
    getUserMockFakerJs({
      faker,
      mode: 'standalone',
    });
    expect(usersMap.size).toBe(3);

    // 1.2. this one is ok and should be registered
    getUserMockFakerJs({
      faker,
    });
    expect(usersMap.size).toBe(4);

    // 2. create entity with dependency links

    // 2.1. force create entity with all it's dependencies set
    expect(petsMap.size).toBe(1);
    expect(tagsMap.size).toBe(2);
    expect(categoriesMap.size).toBe(4);
    // this will create new Pet with all it's dependencies
    // register new entities and update all required relations
    getPetMockFakerJs({
      faker,
      fakerParams: {
        probability: 1,
      },
    });

    expect(petsMap.size).toBe(2);
    expect(tagsMap.size).toBe(3);
    expect(categoriesMap.size).toBe(5);
    expect(modelRefsMap.size).toBe(3);
    expect(modelDependenciesMap.size).toBe(2);

    // 3. Create entity without registering and linking and call it manually
    // we don't auto register because it doesn't resolve dependencies linking
    // we will call `registerEntityAndReturnId` later
    const newUnregisteredPet = getPetMockFakerJs({
      faker,
      fakerParams: {
        probability: 1,
      },
      mode: 'standalone',
    });

    expect(petsMap.size).toBe(2);
    expect(modelRefsMap.size).toBe(3);
    expect(modelDependenciesMap.size).toBe(2);

    // 3.1. Now we register previously created standalone entity
    registerEntityAndReturnId('Pet', newUnregisteredPet);
    expect(petsMap.size).toBe(3);
    expect(modelRefsMap.size).toBe(5);
    expect(modelDependenciesMap.size).toBe(3);

    // 4. Create new entity with `createEntity` helper
    const newUnregisteredPetForCreateMethod = getPetMockFakerJs({
      faker,
      fakerParams: {
        probability: 1,
      },
      mode: 'standalone',
    });

    const newUnregisteredPetCreatedViaMethod = createEntity(
      'Pet',
      newUnregisteredPetForCreateMethod,
      {
        faker,
      }
    );
    expect(newUnregisteredPetCreatedViaMethod).toMatchSnapshot();
    expect(petsMap.size).toBe(4);
    expect(modelRefsMap.size).toBe(7);
    expect(modelDependenciesMap.size).toBe(4);

    // MARK: --- UPDATE ---

    // TODO: 1. Test update of record without reference (point to previous IDs)

    // 3. Update item with new new refs
    const newUnregisteredPetForUpdateWithRefs = getPetMockFakerJs({
      faker,
      fakerParams: {
        probability: 1,
      },
      mode: 'standalone',
    });
    // 3.1. set ID to one of the previously registered models
    newUnregisteredPetForUpdateWithRefs.id =
      newUnregisteredPetCreatedViaMethod.id;

    updateEntity('Pet', newUnregisteredPetForUpdateWithRefs);
    expect(petsMap.size).toBe(4);
    expect(modelRefsMap.size).toBe(9);
    expect(modelDependenciesMap.size).toBe(5);
    expect(petsMap.get(newUnregisteredPetForUpdateWithRefs.id)).toStrictEqual(
      newUnregisteredPetForUpdateWithRefs
    );

    // 3. Attempt to update non existing entity - error
    const newUnregisteredPetForUpdateNonExisting = getPetMockFakerJs({
      faker,
      fakerParams: {
        probability: 1,
      },
      mode: 'standalone',
    });
    // 3.1. change id to the which is definitely not registered
    newUnregisteredPetForUpdateNonExisting.id = -1;

    expect(() =>
      updateEntity('Pet', newUnregisteredPetForUpdateNonExisting)
    ).toThrowError();

    // 4. Update Tag which is reference by Pet. Check all old relations removed and new created
    expect(tagsMap.size).toBe(6);
    const tagReferencedByOtherModel =
      newUnregisteredPetForUpdateWithRefs.tags[0];
    const categoryReferencedByOtherModel =
      newUnregisteredPetForUpdateWithRefs.category;
    const newTagForUpdate = getTagMockFakerJs({
      faker,
      fakerParams: {
        probability: 1,
      },
      mode: 'standalone',
    });
    const newCategoryForUpdate = getCategoryMockFakerJs({
      faker,
      fakerParams: {
        probability: 1,
      },
      mode: 'standalone',
    });
    // 4.1. make sure ids match those of existing items with refs
    newTagForUpdate.id = tagReferencedByOtherModel.id;
    newCategoryForUpdate.id = categoryReferencedByOtherModel.id;

    updateEntity('Tag', newTagForUpdate);
    updateEntity('Category', newCategoryForUpdate);
    expect(tagsMap.size).toBe(6);
    expect(modelRefsMap.size).toBe(9);
    expect(modelDependenciesMap.size).toBe(5);
    expect(tagsMap.get(newTagForUpdate.id)).toStrictEqual(newTagForUpdate);
    expect(categoriesMap.get(newCategoryForUpdate.id)).toStrictEqual(
      newCategoryForUpdate
    );

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
      input: '',
      parsedSchema: parsedSchemas.pet,
      output: generateMockOutputPath(task),
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
