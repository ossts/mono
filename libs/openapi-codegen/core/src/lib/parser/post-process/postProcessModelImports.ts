import type { ParsedModel } from '../types';
import { sort, unique } from '../utils';

/**
 * Set unique imports, sorted by name
 */
export const postProcessModelImports = (model: ParsedModel): string[] => {
  return model.imports
    .filter(unique)
    .sort(sort)
    .filter((name) => model.name !== name);
};
