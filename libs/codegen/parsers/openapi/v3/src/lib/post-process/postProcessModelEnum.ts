import type { ParsedEnumOpenAPIV3, ParsedModelOpenAPIV3 } from '../types';

/**
 * Set unique enum values for the model
 */
export const postProcessModelEnum = (
  model: ParsedModelOpenAPIV3,
): ParsedEnumOpenAPIV3[] => {
  return model.enum.filter((property, index, arr) => {
    return arr.findIndex((item) => item.name === property.name) === index;
  });
};
