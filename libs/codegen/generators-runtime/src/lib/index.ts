import type { AbstractExternalGeneratorWithName } from '@ossts/codegen/common';

import { renderEntries, resolveGenerators } from './helpers';
import type { GenerateParams } from './types';

export const runGenerators = async <
  TGenerators extends AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName
>({
  parsedSchema,
  generators: generatorsCfg,
  output = 'codegen',
  sequential,
  suppressWarnings,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
}: GenerateParams<TGenerators>) => {
  const generators = await resolveGenerators(generatorsCfg);

  if (beforeAll?.(generators) === false) return;

  await renderEntries(generators, {
    parsedSchema,
    output,
    suppressWarnings,
    sequential,
    beforeEach,
    afterEach,
  });

  afterAll?.(generators);
};
