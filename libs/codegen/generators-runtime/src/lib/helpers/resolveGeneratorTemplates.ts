import type { AbstractExternalGeneratorWithName } from '@ossts/codegen/common';

import { generatorImportPaths, generatorNames } from '../__generated__';
import type { ResolvedGenerator } from '../types';

export const generatorNamesString: readonly string[] = generatorNames;

export const resolveGeneratorTemplates = async <
  TGenerators extends AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName
>(
  generatorCfg: ResolvedGenerator<TGenerators>
): Promise<ResolvedGenerator<TGenerators>> => {
  const isBuiltIn = generatorNamesString.includes(generatorCfg.name);

  if (isBuiltIn) {
    const { precompiledTemplates } = await generatorImportPaths[
      generatorCfg.name
    ]();

    generatorCfg.templates = precompiledTemplates;
  } else {
    // TODO: extract required info from external generator
  }

  return generatorCfg;
};
