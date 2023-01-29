import { isString } from 'lodash';

import type { ParsedEnum, WithEnumExtension } from '../types';

/**
 * Extend the enum with the x-enum properties. This adds the capability
 * to use names and descriptions inside the generated enums.
 */
export const extendEnum = (
  enumerators: ParsedEnum[],
  definition: WithEnumExtension
): ParsedEnum[] => {
  const names = definition['x-enum-varnames']?.filter(isString);
  const descriptions = definition['x-enum-descriptions']?.filter(isString);

  return enumerators.map((enumerator, index) => ({
    name: names?.[index] || enumerator.name,
    description: descriptions?.[index] || enumerator.description,
    value: enumerator.value,
    type: enumerator.type,
  }));
};
