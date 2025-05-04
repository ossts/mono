import type { ParsedServiceOpenAPIV3 } from '../types';
import { postProcessServiceImports } from './postProcessServiceImports';
import { postProcessServiceOperations } from './postProcessServiceOperations';

export const postProcessService = (
  service: ParsedServiceOpenAPIV3,
): ParsedServiceOpenAPIV3 => {
  const clone = { ...service };
  clone.operations = postProcessServiceOperations(clone);
  clone.operations.forEach((operation) => {
    clone.imports.push(...operation.imports);
  });
  clone.imports = postProcessServiceImports(clone);
  return clone;
};
