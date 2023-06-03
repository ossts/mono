import { generatorsAll } from '@ossts/codegen/common';
import { tupleIncludes } from '@ossts/shared/typescript/helpers';

export const processGenerators = (
  value: string
): (string | { name: string })[] => {
  return value.split(',').map((name) => {
    if (tupleIncludes(generatorsAll, name)) return name;

    return { name };
  });
};
