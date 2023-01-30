import type { ParsedEnum, ParsedModel } from '../types';

/**
 * Set unique enum values for the model
 */
export const postProcessModelEnum = (model: ParsedModel): ParsedEnum[] => {
  return model.enum.filter((property, index, arr) => {
    return arr.findIndex((item) => item.name === property.name) === index;
  });
};
