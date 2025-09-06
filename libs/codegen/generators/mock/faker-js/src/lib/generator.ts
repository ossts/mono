import { isPlainObject, merge } from 'lodash';

import type { AbstractGeneratorWithName } from '@ossts/codegen/common';
import { AbstractGenerator } from '@ossts/codegen/common';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';
import { mergeObjectsWithSameShape } from '@ossts/shared/typescript/helpers';

import type {
  MockFakerJsGeneratorConfig,
  MockFakerJsGeneratorSettings,
} from './types';

export const mockFakerJsGeneratorName = 'mock/faker-js' as const;

export class MockFakerJsGenerator
  extends AbstractGenerator
  implements AbstractGeneratorWithName
{
  name = mockFakerJsGeneratorName;

  constructor(config?: MockFakerJsGeneratorConfig) {
    super();

    const settings = getFinalSettings(config?.settings);

    mergeObjectsWithSameShape(
      this,
      {
        entriesRenderCfg: {
          schema: {
            dataPath: 'models',
            nameFieldOrFn: (data) => data['name'],
          },
          types: {
            dataPath: '',
            nameFieldOrFn: () => 'types',
            doNotAddToIndex: true,
          },
          helpers: {
            dataPath: '',
            nameFieldOrFn: () => 'helpers',
          },
        },
        dependsOn: [
          'utils',
          'common/models',
          'schema/zod',
          ...(config?.dependsOn ?? []),
        ],
      },
      config,
      {
        settings,
      },
    );
  }

  declare settings?: MockFakerJsGeneratorSettings;
}

/**
 * Merges default values with user settings.
 *
 * Transforms all faker generators keys toLowerCase to make it match different styles
 */
const getFinalSettings = (
  settings: MockFakerJsGeneratorConfig['settings'],
): MockFakerJsGeneratorConfig['settings'] => {
  const defaultSettings: MockFakerJsGeneratorConfig['settings'] = {
    fakerGenerators: {
      pathBased: {
        id: '.string.uuid($$params$$)',
        username: '.internet.username($$params$$)',
        firstName: '.person.firstName($$params$$)',
        lastName: '.person.lastName($$params$$)',
        email: '.internet.email($$params$$)',
        password: '.internet.password($$params$$)',
        phone: '.phone.number($$params$$)',
        url: '.internet.url($$params$$)',
        ip: '.internet.ip($$params$$)',
      },
    },
    fakerParamsGenerators: {
      typeBased: {
        binary: '{ min: 0, max: 1024 }',
      },
    },
  };

  const mergedSettings = settings
    ? merge(defaultSettings, settings)
    : defaultSettings;

  if (mergedSettings.fakerGenerators?.typeBased) {
    mergedSettings.fakerGenerators.typeBased = lowerCaseKeysRecursive(
      mergedSettings.fakerGenerators?.typeBased,
    );
  }
  if (mergedSettings.fakerGenerators?.pathBased) {
    mergedSettings.fakerGenerators.pathBased = lowerCaseKeysRecursive(
      mergedSettings.fakerGenerators?.pathBased,
    );
  }
  if (mergedSettings.fakerParamsGenerators?.typeBased) {
    mergedSettings.fakerParamsGenerators.typeBased = lowerCaseKeysRecursive(
      mergedSettings.fakerParamsGenerators?.typeBased,
    );
  }
  if (mergedSettings.fakerParamsGenerators?.pathBased) {
    mergedSettings.fakerParamsGenerators.pathBased = lowerCaseKeysRecursive(
      mergedSettings.fakerParamsGenerators?.pathBased,
    );
  }

  return mergedSettings;
};

const lowerCaseKeysRecursive = (
  obj: DictionaryWithAny | undefined,
): DictionaryWithAny | undefined => {
  if (!isPlainObject(obj)) return;

  const newObj: DictionaryWithAny = {};

  for (const key in obj) {
    let newVal = obj[key];

    if (isPlainObject(newVal)) {
      newVal = lowerCaseKeysRecursive(newVal);
    }

    newObj[key.toLowerCase()] = newVal;
  }

  return newObj;
};
