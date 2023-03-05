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
    const { precompiledTemplates, helpers, globalName } =
      await generatorImportPaths[generatorCfg.name]();

    if (globalName) {
      generatorCfg.globalName = globalName;
    }

    generatorCfg.templates = precompiledTemplates;
    generatorCfg.helpers = helpers;
  } else {
    // TODO: extract required info from external generator
  }

  return generatorCfg;
};
