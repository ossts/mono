import type { ParsedModelOpenAPIV3 } from '../types';
import { sort, unique } from '../utils';

/**
 * Set unique imports, sorted by name
 */
export const postProcessModelImports = (
  model: ParsedModelOpenAPIV3
): string[] => {
  return model.imports
    .filter(unique)
    .sort(sort)
    .filter((name) => model.name !== name);
};
