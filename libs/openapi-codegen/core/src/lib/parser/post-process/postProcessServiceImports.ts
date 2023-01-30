import type { ParsedService } from '../types';
import { sort, unique } from '../utils';

/**
 * Set unique imports, sorted by name
 */
export const postProcessServiceImports = (service: ParsedService): string[] => {
  return service.imports.filter(unique).sort(sort);
};
