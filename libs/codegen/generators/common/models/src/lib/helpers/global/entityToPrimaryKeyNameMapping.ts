import type Handlebars from 'handlebars/runtime';

import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type { ParsedModelOpenAPIV3 } from '@ossts/codegen/parsers/openapi/v3';
import type { Dictionary } from '@ossts/shared/typescript/helper-types';

import type { CommonModelsGeneratorSettings } from '../../types';

const defaultIdProp = 'id';

const caches = new WeakMap<
  typeof Handlebars,
  Map<ParsedModelOpenAPIV3, string>
>();

export const entityToPrimaryKeyNameMapping: CodegenHandlebarsHelperWrapper<
  CommonModelsGeneratorSettings
> = ({ handlebarsInstance, settings: generatorSettings }) => {
  // we have to create cache per handlebars instance
  // to make sure that caches won't shared between runs
  // which leads to incorrect results in test
  let cache = caches.get(handlebarsInstance);
  if (!cache) {
    cache = new Map();
    caches.set(handlebarsInstance, cache);
  }

  return function (
    this: ParsedModelOpenAPIV3,
    options: Handlebars.HelperOptions,
  ): string | undefined {
    if (cache.has(this)) return cache.get(this);

    const fullPathHelper: Handlebars.HelperDelegate =
      handlebarsInstance.helpers['utilsFullPath'];

    const fullPath: string[] = fullPathHelper.call(this, options);

    let result: string | undefined = undefined;

    result = getIdPropPathBased(
      this,
      generatorSettings.entityToPrimaryKeyNameMapping,
      fullPath,
    );

    result = result ?? generatorSettings.primaryKeyName ?? defaultIdProp;

    // we want to make sure that key is present to check for default `defaultIdProp` value
    if (result) {
      const propertiesNames = this.properties.map((item) => item.name);

      if (!propertiesNames.includes(result)) {
        if (result !== defaultIdProp) {
          console.warn(
            `!!!-----------WARNING START-----------!!!!\nModel "${this.name}" doesn't have property "${result}".\nAvailable properties are "[${this.properties.map((prop) => prop.name).join(', ')}]". \nProperty id will be ignored.\n!!!------------WARNING END------------!!!!`,
          );
        }
        result = '';
      }
    }

    cache.set(this, result);

    return result;
  };
};

const getIdPropPathBased = (
  type: ParsedModelOpenAPIV3,
  mapping: CommonModelsGeneratorSettings['entityToPrimaryKeyNameMapping'],
  fullPath: string[],
): string | undefined => {
  let result: string | undefined = undefined;

  if (!mapping) return result;

  const valuePathBased = fullPath.reduce<Dictionary<string> | string>(
    (acc, val) => {
      // stop if we already found value
      if (acc === undefined || typeof acc === 'string') return acc;

      return acc[val] ?? acc;
    },
    mapping,
  );

  if (!result && mapping['*'] !== undefined) {
    result = mapping['*'];
  }

  if (typeof valuePathBased === 'string') {
    result = valuePathBased;
  }

  return result;
};
