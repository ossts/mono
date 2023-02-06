import { isString } from 'lodash';

import type { ParsedEnumOpenAPIV3, WithEnumExtensionOpenAPIV3 } from '../types';

/**
 * Extend the enum with the x-enum properties. This adds the capability
 * to use names and descriptions inside the generated enums.
 */
export const extendEnum = (
  enumerators: ParsedEnumOpenAPIV3[],
  definition: WithEnumExtensionOpenAPIV3
): ParsedEnumOpenAPIV3[] => {
  const names = definition['x-enum-varnames']?.filter(isString);
  const descriptions = definition['x-enum-descriptions']?.filter(isString);

  return enumerators.map((enumerator, index) => ({
    name: names?.[index] || enumerator.name,
    description: descriptions?.[index] || enumerator.description,
    value: enumerator.value,
    type: enumerator.type,
  }));
};
