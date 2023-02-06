import type { ParsedModelOpenAPIV3 } from '../types';

/**
 * Set unique enum values for the model
 */
export const postProcessModelEnums = (
  model: ParsedModelOpenAPIV3
): ParsedModelOpenAPIV3[] => {
  return model.enums.filter((property, index, arr) => {
    return arr.findIndex((item) => item.name === property.name) === index;
  });
};
