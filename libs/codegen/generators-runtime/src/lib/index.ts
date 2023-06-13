import type { AbstractExternalGeneratorWithName } from '@ossts/codegen/common';

import { renderEntries, resolveGenerators } from './helpers';
import type { GenerateParams } from './types';

export const runGenerators = async <
  TGenerators extends AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName
>({
  generators: generatorsCfg = ['*'],
  suppressWarnings,
  generatorsSettings,
  output = 'codegen',
  beforeAll,
  afterAll,
  ...other
}: GenerateParams<TGenerators>) => {
  const generators = await resolveGenerators(generatorsCfg, generatorsSettings);

  if (beforeAll?.(generators) === false) return;

  await renderEntries(generators, {
    output,
    suppressWarnings,
    ...other,
  });

  afterAll?.(generators);
};
