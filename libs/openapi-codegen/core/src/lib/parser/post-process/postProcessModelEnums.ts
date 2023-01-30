import type { ParsedModel } from '../types';

/**
 * Set unique enum values for the model
 */
export const postProcessModelEnums = (model: ParsedModel): ParsedModel[] => {
  return model.enums.filter((property, index, arr) => {
    return arr.findIndex((item) => item.name === property.name) === index;
  });
};
