import type { ParsedServiceOpenAPIV3 } from '../types';
import { sort, unique } from '../utils';

/**
 * Set unique imports, sorted by name
 */
export const postProcessServiceImports = (
  service: ParsedServiceOpenAPIV3
): string[] => {
  return service.imports.filter(unique).sort(sort);
};
