import type Handlebars from 'handlebars/runtime';

import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type { ParsedModelOpenAPIV3 } from '@ossts/codegen/parsers/openapi/v3';
import type { Dictionary } from '@ossts/shared/typescript/helper-types';

import type { CommonModelsGeneratorSettings } from '../../types';

export const entityToPrimaryKeyNameMapping: CodegenHandlebarsHelperWrapper<
  CommonModelsGeneratorSettings
> = ({ handlebarsInstance, settings: generatorSettings }) =>
  function (this: ParsedModelOpenAPIV3, options: Handlebars.HelperOptions) {
    const fullPathHelper: Handlebars.HelperDelegate =
      handlebarsInstance.helpers['utilsFullPath'];

    const fullPath = fullPathHelper.call(this, options);

    let result: string | undefined = undefined;

    result = getIdPropPathBased(
      this,
      generatorSettings.entityToPrimaryKeyNameMapping,
      fullPath
    );

    return result ?? generatorSettings.primaryKeyName ?? 'id';
  };

const getIdPropPathBased = (
  type: ParsedModelOpenAPIV3,
  mapping: CommonModelsGeneratorSettings['entityToPrimaryKeyNameMapping'],
  fullPath: string[]
): string | undefined => {
  let result: string | undefined = undefined;

  if (!mapping) return result;

  const valuePathBased = fullPath.reduce<Dictionary<string> | string>(
    (acc, val) => {
      // stop if we already found value
      if (acc === undefined || typeof acc === 'string') return acc;

      return acc[val] ?? acc;
    },
    mapping
  );

  if (!result && mapping['*'] !== undefined) {
    result = mapping['*'];
  }

  if (typeof valuePathBased === 'string') {
    result = valuePathBased;
  }

  return result;
};
