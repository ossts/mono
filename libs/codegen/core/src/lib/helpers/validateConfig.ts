import type { AbstractExternalGeneratorWithName } from '@ossts/codegen/common';

import type { Config } from '../types';

export const validateConfig = <
  TGenerators extends
    AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName,
>({
  input,
  parsedSchema,
}: Config<TGenerators>) => {
  if (!input && !parsedSchema)
    throw new Error(`Either "input" or "parsedSchema" required`);
};
