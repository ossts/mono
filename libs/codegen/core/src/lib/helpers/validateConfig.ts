import type { AbstractExternalGeneratorWithName } from '@ossts/codegen/common';

import type { Config } from '../types';

export const validateConfig = <
  TGenerators extends AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName
>({
  input,
}: Config<TGenerators>) => {
  if (!input) throw new Error(`"input" is required`);
};
