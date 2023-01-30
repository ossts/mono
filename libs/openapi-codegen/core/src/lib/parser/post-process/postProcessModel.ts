import type { ParsedModel } from '../types';
import { postProcessModelEnum } from './postProcessModelEnum';
import { postProcessModelEnums } from './postProcessModelEnums';
import { postProcessModelImports } from './postProcessModelImports';

/**
 * Post processes the model.
 * This will clean up any double imports or enum values.
 */
export const postProcessModel = (model: ParsedModel): ParsedModel => {
  return {
    ...model,
    imports: postProcessModelImports(model),
    enums: postProcessModelEnums(model),
    enum: postProcessModelEnum(model),
  };
};
