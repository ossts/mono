import type { ParsedService } from '../types';
import { postProcessServiceImports } from './postProcessServiceImports';
import { postProcessServiceOperations } from './postProcessServiceOperations';

export const postProcessService = (service: ParsedService): ParsedService => {
  const clone = { ...service };
  clone.operations = postProcessServiceOperations(clone);
  clone.operations.forEach((operation) => {
    clone.imports.push(...operation.imports);
  });
  clone.imports = postProcessServiceImports(clone);
  return clone;
};
